import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {FuseValidators} from '@fuse/validators';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/firebase/auth.service';
import {Router} from "@angular/router";

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    code = null

    /**
     * Constructor
     */
    constructor(
        private authService: AuthService,
        private _formBuilder: FormBuilder,
        private router: Router
    ) {
        if (this.router.getCurrentNavigation()) {
            this.code = this.router.getCurrentNavigation().extras.state
        } else {
            this.router.navigateByUrl('four-oh-four')
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword() {

        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this.authService.resetPassword(this.code.oobCode, this.resetPasswordForm.get('password').value)
            .then(
                (response) => {

                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'Your password has been reset.'
                    };
                },
                (response) => {

                    // Set the alert
                    console.log(response)
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.'
                    };
                }
            )
            .finally(() => {

                // Re-enable the form
                this.resetPasswordForm.enable();

                // Reset the form
                this.resetPasswordNgForm.resetForm();

                // Show the alert
                this.showAlert = true;
            })
    }
}
