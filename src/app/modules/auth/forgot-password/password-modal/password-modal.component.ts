// Dialog box component for submitting the reset link
import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from "../../../../core/firebase/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-password-modal',
    templateUrl: './password-modal.component.html'
})
export class PasswordModalComponent implements OnInit {
    passwordResetForm: FormGroup;
    closeModal: string;
    @Input() email: string

    constructor(
        private modalService: NgbModal,
        private authService: AuthService,
        private router: Router
    ) {
    }

    triggerModal(content) {
        this.sendResetLink()
        this.modalService.open(content, {ariaLabelledBy: 'password-modal'}).result.then((res) => {
            this.closeModal = `Closed with: ${res}`;
        }, (res) => {
            this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
        });
    }

    onPasswordResetClick() {
        let link = this.passwordResetForm.value.link
        let startDelimiter = 'oobCode='
        let endDelimiter = '&apiKey'
        let startIndex = link.indexOf(startDelimiter)
        let endIndex = link.indexOf(endDelimiter)
        let oobCode = link.substring(startIndex + startDelimiter.length, endIndex)
        this.modalService.dismissAll('Save click')
        this.router.navigateByUrl('/reset-password', {state: {oobCode: oobCode}})
    }

    sendResetLink() {
        this.authService.forgotPassword(this.email)
    }

    ngOnInit() {
        this.initModalForm();
    }

    initModalForm() {
        this.passwordResetForm = new FormGroup({
            link: new FormControl(null, [Validators.required, Validators.minLength(10)])
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
