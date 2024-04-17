import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExtraOptions, PreloadAllModules, RouterModule} from '@angular/router';
import {MarkdownModule} from 'ngx-markdown';
import {FuseModule} from '@fuse';
import {FuseConfigModule} from '@fuse/services/config';
import {FuseMockApiModule} from '@fuse/lib/mock-api';
import {CoreModule} from 'app/core/core.module';
import {appConfig} from 'app/core/config/app.config';
import {mockApiServices} from 'app/mock-api';
import {LayoutModule} from 'app/layout/layout.module';
import {AppComponent} from 'app/app.component';
import {appRoutes} from 'app/app.routing';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {environment} from '../environments/environment';
import {FourOhFourComponent} from './modules/landing/four-oh-four/four-oh-four.component';

// Firebase modules
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from "@angular/fire/database";

// Firebase services
import {AuthService} from './core/firebase/auth.service';
import {FirebaseService} from "./core/firebase/firebase.service";

// Office JS providers
import {ExcelService} from './core/officeJs/excel.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules
};

@NgModule({
    declarations: [
        AppComponent,
        FourOhFourComponent

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,


        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),

        // Firebase initialization
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule, // firestore
        AngularFireAuthModule, NgbModule // auth
    ],
    providers: [
        AuthService,
        ExcelService,
        FirebaseService,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
