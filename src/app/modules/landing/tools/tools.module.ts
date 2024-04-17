import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ToolsComponent } from 'app/modules/landing/tools/tools.component';
import { MatSliderModule } from '@angular/material/slider';



import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';

import {ChartCardComponent} from 'app/layout/common/chart-card/chart-card.component';



const toolsRoutes: Route[] = [
    {
        path     : '',
        component: ToolsComponent
    }
];

@NgModule({
    declarations: [
        ToolsComponent,
        ChartCardComponent
     

        //Fuse Imports
        // FuseCardComponent,
    ],
    imports: [
        MatSliderModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatProgressBarModule,
        MatTooltipModule,
        FuseCardModule,
        SharedModule,
        
     
        

        //Routing
        RouterModule.forChild(toolsRoutes)
    ]
})
export class ToolsModule
{
}
