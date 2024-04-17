import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {ChartsComponent} from 'app/modules/landing/charts/charts.component';
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {FuseCardModule} from '@fuse/components/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule} from "@angular/forms";
import { ChartCardComponent } from './chart-card/chart-card.component';

const chartsRoutes: Route[] = [
    {
        path: '',
        component: ChartsComponent
    }
];

@NgModule({
    declarations: [
        ChartsComponent,
        ChartCardComponent
    ],
    imports: [
        RouterModule.forChild(chartsRoutes),
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatExpansionModule,
        FuseCardModule,
        FormsModule
    ]
})
export class ChartsModule
{
}
