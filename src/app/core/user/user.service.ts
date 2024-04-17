import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
// import { User } from 'app/core/user/user.types';
import {User} from "app/core/firebase/user";
import { AuthService } from 'app/core/firebase/auth.service';
import {FirebaseService} from "app/core/firebase/firebase.service";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';




@Injectable({
    providedIn: 'root' 
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    userProfile$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    profileRef:  AngularFireObject<any>;
    profile: Observable<any>;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private dbService: FirebaseService,
        private authService: AuthService,       
        private db:   AngularFireDatabase      
        
        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    //above are old methods need to consider if still required

    getUserProfile() {
        let uid = this.authService.getCurrentUID();
      
            let profileRef =  this.db.object('/user/' + uid + '/profile');
            
            let profile = profileRef.valueChanges().subscribe(val => {
                console.log('profile value', val)
            })
            
            return profileRef.valueChanges();
            // console.log(profile);
        
        // let profile = this.dbService.getUserProfile(this.authService.getCurrentUID());
        // console.log(profile)

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> 
    {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
