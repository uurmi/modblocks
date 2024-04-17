import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {MyCollectionComponent} from 'app/modules/landing/my-collection/my-collection.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SaveCollectionItemModalComponent} from "./save-collection-item-modal/save-collection-item-modal.component";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";

const myCollectionRoutes: Route[] = [
    {
        path: '',
        component: MyCollectionComponent
    }
];

@NgModule({
    declarations: [
        MyCollectionComponent,
        SaveCollectionItemModalComponent
    ],
    imports: [
        RouterModule.forChild(myCollectionRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        CommonModule,
        NgbModule,
        FormsModule,
        NgMultiSelectDropDownModule
    ]
})
export class MyCollectionModule {
}
