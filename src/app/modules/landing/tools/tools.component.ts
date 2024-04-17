import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'app/core/officeJs/excel.service';
import { FirebaseService } from '../../../core/firebase/firebase.service';

@Component({
    selector: 'app-tools',
    templateUrl: './tools.component.html',
    styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent implements OnInit {
    constructor(
        private excelService: ExcelService,
        private dbService: FirebaseService
    ) {}

    value = 40;
    valueSet;

    ngOnInit(): void {}

    // Gets all ranges from the database to display in the component "My collection"
    async getRangeValues() {
        let rangeValues = await  this.excelService.getRangeValues();
        console.log(rangeValues);
    
        //  this.excelService.getRangeValues().then((returnedValue) => {rangeValues = returnedValue});
        //  console.log("I am range values", rangeValues);
         return rangeValues;
    }

    formatLabel(value: number) {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return value;
    }

    async getExtendedRange(){
        this.excelService.getExtendedRange();
    }

    async loopRange(){
        this.excelService.loopRange();
    }



    async refreshValue(){
    
        let activeVal = await this.getRangeValues();      
        this.value = activeVal[0].value[0];
    }





}
