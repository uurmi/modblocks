import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ExcelService} from "../../../core/officeJs/excel.service";
import {AngularFireList} from "@angular/fire/database";
import {FirebaseService} from "../../../core/firebase/firebase.service";
import {CollectionItem} from "../../../core/firebase/collectionItem";
import {AuthService} from "../../../core/firebase/auth.service";
import {User} from "../../../core/firebase/user";

@Component({
    selector: 'my-collection',
    templateUrl: './my-collection.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MyCollectionComponent implements OnInit {

    collectionItemRef: AngularFireList<CollectionItem> = null
    private collectionItemPath = '/collectionItem'
    userRef: AngularFireList<User> = null
    private userPath = '/user'
    data = []
    dataIds = []
    loading = true
    itemsAdded = false


    /**
     * Constructor
     */
    constructor(
        private excelService: ExcelService,
        private dbService: FirebaseService,
        private authService: AuthService
    ) {

    }


    chipColor(item) {


        switch (item) {
            case 'Format':
                return 'text-blue-800 bg-blue-100 dark:text-blue-50 dark:bg-blue-500'
                // code block
                break;
            case 'Range':
                return 'text-amber-800 bg-amber-100 dark:text-amber-50 dark:bg-amber-500'
                break;
            default:
            // code block
        }


    }

    ngOnInit() {
        this.userRef = this.dbService.getAll(this.userPath);
        this.data = []
        this.dataIds = []
        this.getData()
    }

    getData() {
        this.loading = true
        this.collectionItemRef = this.dbService.getAll(this.collectionItemPath);
        this.getCollectionItemsFromDatabase()
        this.loading = false;
    }

    // Gets collection items related to the current user from the database to display in the component "My collection"
    getCollectionItemsFromDatabase() {
        let items = {}
        this.authService.getCurrentUser()
            .subscribe((user) => {
                this.dbService.getUserItems(this.userPath, user.uid)
                    .once('value', (snapshot) => {
                        items = snapshot.val()
                    }).then(() => {
                    this.dbService.addListener(this.collectionItemPath, 'child_added', (data) => {
                        if (items.hasOwnProperty(data.key) || this.itemsAdded) {
                            this.data.push(data.val())
                            this.dataIds.push(data.key)
                        }
                    })
                })
            })
    }

    // Loads the selected range or format into the selected area in the worksheet
    async loadItem(item) {
        switch (item.type) {
            case 'Range':
                await this.excelService.loadSavedRange(item.item);
                break
            case 'Format':
                await this.excelService.loadSavedFormat(item.item);
                break
        }
    }

    deleteItem(item) {
        const itemIndex = this.data.findIndex(element => element === item)
        const itemKey = this.dataIds[itemIndex]

        this.data.splice(itemIndex, 1)
        this.dataIds.splice(itemIndex, 1)

        let deletePath = this.authService.user + '/collectionItems';
        this.dbService.deleteChild(
            this.userPath,
            deletePath,
            itemKey)
        this.dbService.deleteChild(
            this.collectionItemPath,
            '',
            itemKey)
    }

    itemsAddedEvent($event) {
        this.itemsAdded = $event
    }
}
