import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth"
import firebase from "firebase";
import {FirebaseService} from "./firebase.service";
import {AngularFireList} from "@angular/fire/database";
import {User} from "./user";
import {BehaviorSubject} from 'rxjs';
import auth = firebase.auth;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    idToken$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    isLoggedIn = false;
    user = null;
    userRef: AngularFireList<User> = null;
    private userPath = '/user';

    constructor(
        public firebaseAuth: AngularFireAuth,
        public db: FirebaseService
    ) {

        firebaseAuth.user.subscribe(this.user$);
        firebaseAuth.idToken.subscribe(this.idToken$);
        //Use an rxjs behavior subject so that at later points/different components, we can simply import this service and run .getValue() on user$ or idToken$ to synchronously get the current value of it
        //this avoids additional subscriptions later on and waiting for the subscription to pass the value...

        // as per this example: https://www.nerd.vision/post/using-firebase-auth-in-angular-components-synchronously
        // behavior subjects are an extension on observables. They remember the last value that was pushed through them, allowing you to read their current value whenever you wish too without having to wait for it to resolve.


        this.userRef = db.getAll(this.userPath);
        this.getCurrentUser().subscribe((data) => {
            this.user = data ? data.uid : null
        })
    }



    getCurrentUser() {
        return this.firebaseAuth.user

    }

    getCurrentUID() {
        return this.user$.getValue().uid;
    }

    getUserProfile(){

    }

    async getUser(){

        return this.user$.getValue();

    }

    async signIn(formValue: any) {
        const email = formValue.email;
        const password = formValue.password;
        const rememberMe = formValue.rememberMe;
        const persistence = rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.SESSION;
        // set persistence according to user preference
        await this.firebaseAuth.setPersistence(persistence)
            .then(
                async () => {
                    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
                        .then(res => {
                            this.isLoggedIn = true;
                        })
                }
            )
    }

    async signInWithGoogle() {
        const provider = new auth.GoogleAuthProvider();
        const credential = await this.firebaseAuth.signInWithPopup(provider)
            .then(res => {

                this.isLoggedIn = true;
            });
    }

    async signInWithMicrosoft() {
        const provider = new auth.OAuthProvider('microsoft.com');
        const credential = await this.firebaseAuth.signInWithPopup(provider)
            .then(res => {

                this.isLoggedIn = true;
            });
    }

    async signUp(formValue: any) {
        const user: User = {
            name: formValue.name,
            email: formValue.email
        }
        const email = formValue.email;
        const password = formValue.password;
        await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                user.id = cred.user.uid
                this.db.createWithId(this.userPath, user, user.id)

                // this.sendVerificationMail();
            }).then(() => {
                this.isLoggedIn = true;

            });

    }

    // async sendVerificationMail() {
    //     return (await this.firebaseAuth.currentUser).sendEmailVerification();
    // }

    async signOut() {
        await this.firebaseAuth.signOut()
            .then(res => {
                this.isLoggedIn = false;
            })
    }

    async forgotPassword(email: any) {
        await this.firebaseAuth.sendPasswordResetEmail(email);
    }

    async resetPassword(code, password) {
        await this.firebaseAuth.confirmPasswordReset(code, password);
    }

    check() {
        this.firebaseAuth.onAuthStateChanged(user => {
            this.isLoggedIn = !!user;
            this.user = user;
        })
        return this.isLoggedIn;
    }
}
