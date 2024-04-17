// Dialog box component for saving a range
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ExcelService} from "../../../../core/officeJs/excel.service";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-save-collection-item-modal',
    templateUrl: './save-collection-item-modal.component.html',
    styleUrls: ['./save-collection-item-modal.component.scss']
})
export class SaveCollectionItemModalComponent implements OnInit {

    saveCollectionItemForm: FormGroup;
    closeModal: string;
    @Output() itemCreatedEvent = new EventEmitter<any>()

    attributes = [];
    dropdownSettings: any = {};

    constructor(
        private modalService: NgbModal,
        private excelService: ExcelService
    ) {
    }

    triggerModal(content) {
        this.modalService.open(content, {ariaLabelledBy: 'save-collection-item-modal'}).result.then((res) => {
            this.closeModal = `Closed with: ${res}`;
        }, (res) => {
            this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
        });
    }

    onSaveCollectionItemClick() {
        this.itemCreatedEvent.emit(true)
        this.excelService.saveCollectionItem(this.saveCollectionItemForm.value);
        this.modalService.dismissAll('Save click')
    }

    ngOnInit() {
        this.attributes = [
            'Font Styling',
            'Alignment and Orientation',
            'Border styling',
            'Number Format',
            'Cell Fill Color',
        ];
        this.dropdownSettings = {
            singleSelection: false,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: false
        };
        this.initModalForm();
    }

    initModalForm() {
        this.saveCollectionItemForm = new FormGroup({
            name: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            attributes: new FormControl('', Validators.required)
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

    onItemSelect() {
        console.log(this.saveCollectionItemForm.value)
    }
}
