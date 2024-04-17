import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import {MatButtonModule} from '@angular/material/button';
import {FuseCardModule} from '@fuse/components/card';
import { FuseHighlightModule } from '@fuse/components/highlight';

import { HttpClientModule } from '@angular/common/http'; 

const landingHomeRoutes: Route[] = [
    {
        path     : '',
        component: LandingHomeComponent
    }
];

@NgModule({
    declarations: [
        LandingHomeComponent
    ],
    imports: [
        RouterModule.forChild(landingHomeRoutes),
        CommonModule,
        HttpClientModule,
        FuseHighlightModule,
        MatButtonModule,
        FuseCardModule
    ]
})
export class LandingHomeModule
{
}
