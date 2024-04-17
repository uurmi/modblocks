import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/firebase/auth.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [localStorage.getItem('email')? localStorage.getItem('email') : 'test@test.test', [Validators.required, Validators.email]],
            password: ['password', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    async signIn() {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        await this.authService.signIn(this.signInForm.value)
            .then(
                () => {
                    // Save user email if requested
                    if (this.signInForm.value.rememberMe) {
                        localStorage.setItem('email', this.signInForm.value.email);
                    }

                    // Set the redirect url.
                    // The '/signed-in-redirect' is my-collection dummy url to catch the request and redirect the user
                    // to the correct page after my-collection successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    signInWithGoogle(): void {
        // Sign in
        this.authService.signInWithGoogle()
            .then(
                () => {
                    // Set the redirect url.
                    // The '/signed-in-redirect' is my-collection dummy url to catch the request and redirect the user
                    // to the correct page after my-collection successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Could not sign in using Google'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    signInWithMicrosoft(): void {
        // Sign in
        this.authService.signInWithMicrosoft()
            .then(
                () => {
                    // Set the redirect url.
                    // The '/signed-in-redirect' is my-collection dummy url to catch the request and redirect the user
                    // to the correct page after my-collection successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Could not sign in using Microsoft'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    signInWithLinkedIn() {

    }
}
