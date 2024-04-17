import { Component,ChangeDetectorRef, ViewEncapsulation, AfterViewInit, OnInit, OnChanges } from '@angular/core';
import { ExcelService } from 'app/core/officeJs/excel.service';
import { AuthService } from 'app/core/firebase/auth.service';
import { FirebaseService } from 'app/core/firebase/firebase.service';
import { Observable, BehaviorSubject, timer } from 'rxjs';

import * as excelFormula from 'excel-formula';
import * as ClipboardJS from 'clipboard';

// import { timer } from 'd3-timer';


@Component({
    selector     : 'home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent implements OnInit, OnChanges, AfterViewInit
{
    public testObservable$: Observable<any>;
    public activeRange$ = new BehaviorSubject<any>('');
    public prettyHTML$: Observable<any>;

   
    
    /** 
     * Constructor
     */
    constructor( 
        public excelService: ExcelService, 
        public authService: AuthService,
      
        )
    {
       
        this.user = this.checkUser()
        console.log(this.user, this.checkUser,'user!');
        this.excelService.data$.subscribe(this.activeRange$);
        this.testObservable$=this.excelService.data$;
        // this.prettyHTML$ = excelFormula.formatFormulaHTML(this.activeRange$.getValue().getFormulaString());
        
        
        
    }


    

    public user;
   
    button = new ClipboardJS('.btn');
    formattedFormula = excelFormula.formatFormula('IF(1+1=2,"true","false")');
    formattedFormulaHtml = excelFormula.formatFormulaHTML('IF(1+1=2,"true","false")')
    public formatted;


    ngOnInit(){

        // let formulaString = this.getCellFormula();
        // this.formatted = excelFormula.formatFormulaHTML(formulaString);
       
       

    }

    // ngAfterViewInit(): void {
    //     //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //     //Add 'implements AfterViewInit' to the class.
    //     this.beautify();
        
    // }

    ngOnChanges(){
        console.log('changed!')

    }

    getCellFormula(){
        let formulas = this.activeRange$.getValue().formulas;
        let formulaString = formulas[0][0];
        // let logme2 = this.activeRange$.getValue().getFormulaString();
        console.log('log me:')
        console.log(formulaString);

        return formulaString;
        // console.log(logme2)
    }



    async checkUser(){

        console.log('this user is', this.authService.user$.getValue() )
    }

    loadDataStore(){
        console.log('value:')
        console.log(this.activeRange$.getValue());
        // this.excelService.logDataStore();
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        console.log('view init!')
        this.beautify();
      this.authService.getCurrentUser()
    }


    async prettyFormula(){
        var forumulaDiv = document.getElementById("prettyFormula");
        
        let cellProps:any = this.excelService.getCellFormula();
        let formulaString =  await this.excelService.getFormulaString();
        console.log('formatted', formulaString)
        let formatted = excelFormula.formatFormulaHTML(formulaString);
        forumulaDiv.innerHTML = formatted;
    }

    async beautify(){
        var forumulaDiv = document.getElementById("prettyFormula");
        let formulaString = this.getCellFormula();
        
        console.log('formatted', formulaString)
        let formatted = excelFormula.formatFormulaHTML(formulaString);
        forumulaDiv.innerHTML = formatted;
    }



    async cellFormula(){
        let formula = await  this.excelService.getFormulaString();
        console.log(formula)
    
    }

    
}
