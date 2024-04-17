import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    itemRef: AngularFireObject<any>;
    item: Observable<any>;
    profileRef:  AngularFireObject<any>;
    profile: Observable<any>;

    constructor(
        private db: AngularFireDatabase
    ) {

        this.itemRef = db.object('item');
        this.itemRef.set({ name: 'Joe' });
        this.item = this.itemRef.valueChanges();
    }

    getOne(path: string, id): Observable<any> {
        return this.db.object(path + '/' + id).valueChanges()
    }

    getAll(path: string): AngularFireList<any> {
        return this.db.list(path)
    }

    getUserItems(path: string, uid: string) {
        return this.db.database.ref(path + '/' + uid + '/collectionItems')
            .orderByValue()
            .equalTo(true)
    }

    viewItemObj(uid: string){
        let profileRef =  this.db.object('/user/' + uid + '/profile');
        let profile = profileRef.valueChanges().subscribe(val => {
            console.log('profile value', val)
        })
        // console.log(profile);
    }

    // getUserProfile(uid: string) {
    //     return this.db.database.ref('/user/' + uid + '/profile')
    //         .orderByValue()
    //         .equalTo(true)
    // }

    addListener(path: string, event, callback) {
        this.db.database.ref(path).on(event, (data) => {
            callback(data)
        })
    }

    create(ref: AngularFireList<any>, element: any): any {
        return ref.push(element)
    }

    createWithId(path, element: any, id: any): any {
        return this.db.database.ref(path + '/' + id)
            .set(element)
    }

    getIds(ref: AngularFireList<any>): any {
        return ref.snapshotChanges()
    }

    update(ref: AngularFireList<any>, key: string, data): any {
        return ref.update(key, data)
    }

    deleteChild(path: string, child: string, key: string): any {
        return this.db.database.ref(path).child(child + '/' + key).remove()
    }
}
