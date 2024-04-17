import {Route} from '@angular/router';
import {NoAuthGuard} from 'app/core/auth/guards/noAuth.guard';
import {LayoutComponent} from 'app/layout/layout.component';
import {InitialDataResolver} from 'app/app.resolvers';
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {FourOhFourComponent} from "./modules/landing/four-oh-four/four-oh-four.component";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['send-email']);


// @formatter:off
// tslint:disable:max-line-length
// @ts-ignore
// @ts-ignore
export const appRoutes: Route[] = [

    // Redirect empty path to '/home'
    {path: '', pathMatch: 'full', redirectTo: 'home'},

    // Redirect signed in user to the '/home'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is my-collection small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: '/home'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)
            },
            {
                path: 'forgot-password',
                loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)
            },
            {
                path: 'reset-password',
                loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)
            },
            {
                path: 'sign-in',
                loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)
            },
            {
                path: 'sign-up',
                loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)
            }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AngularFireAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
            authGuardPipe: redirectUnauthorizedToLogin
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule),
                canActivate: [AngularFireAuthGuard],
            }
        ]
    },

    // Landing routes
    {
        path: '',
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin},
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'home',
                loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule),
                canActivate: [AngularFireAuthGuard],
            },
            {
                path: 'my-collection',
                loadChildren: () => import('app/modules/landing/my-collection/my-collection.module').then(m => m.MyCollectionModule),
                canActivate: [AngularFireAuthGuard],
            },
            {
                path: 'charts',
                loadChildren: () => import('app/modules/landing/charts/charts.module').then(m => m.ChartsModule),
                canActivate: [AngularFireAuthGuard],
            },
            {
                path: 'tools',
                loadChildren: () => import('app/modules/landing/tools/tools.module').then(m => m.ToolsModule),
                canActivate: [AngularFireAuthGuard],
            },
            {
                path: 'settings',
                loadChildren: () => import('app/modules/landing/settings/settings.module').then(m => m.SettingsModule),
                canActivate: [AngularFireAuthGuard],
            }
        ]
    },

    // 404 Component
    {path: 'four-oh-four', component: FourOhFourComponent},
    {
        path: '*',
        resolve: {
            initialData: InitialDataResolver,
        },
        component: FourOhFourComponent
    },

];
