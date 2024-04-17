import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {AuthService} from "../../../core/firebase/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent
{
    /**
     * Constructor
     */
    constructor(
        private authService: AuthService,
        private route: ActivatedRoute
    )
    {}


}
