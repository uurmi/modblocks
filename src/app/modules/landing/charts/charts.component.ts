import {ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';
import {ExcelService} from '../../../core/officeJs/excel.service';
import * as d3 from 'd3';
import html2canvas from 'html2canvas';

@Component({
    selector: 'charts',
    templateUrl: './charts.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ChartsComponent {
    values = [[]];
    // charts = [];
    valueTypes = [
        ['number', 'number', 'number'],
        ['number', 'number', 'number'],
    ];

    // add axes describing the values
    private xAxis;
    private yAxis;
    private xScale;
    private yScale;
    private width;
    private height;
    private svg;
    private barGroup;
    private g: any;
    private bars;
    private x;
    private y;
    private t;
    public winWidth;
    public winHeight;
    public testVar;

    public xLabel;
    public yLabel;
    public datasetExtent;
    public panelOpenState = false;
    public chartBucket;

    public charts = [];

    public data: any;

    // target the prescribed root node and add an svg element
    private margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50, // add more white space on the left side of the visualization to display the names
    };

    xFieldName = 'name';
    yFieldName = 'points';

    defaultColor = 'orange';
    transitionTime = 1500;

    /**
     * Constructor
     */
    constructor(
        private excelService: ExcelService,
        private changeDetection: ChangeDetectorRef
    ) {
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.winHeight = 500;
        this.winWidth = 800;
       
    }

    async createBinding() {
        await this.excelService.bindToChart(this);
    }

    async addValue(chartObject){
        this.charts.push(chartObject);
    }

    async updateValues(values, chartId) { 
        this.values = values;
        // this.charts.push(values)

        let chartToUpdate = this.charts.find(chart => chart.id ===chartId)
        chartToUpdate.values = values;
        chartToUpdate.values = [].concat(chartToUpdate.values);//need to concat to an emppty array to trigger ngOnCHanges
        // this.updateChart();
        await this.changeDetection.detectChanges();
        await this.convertData(this.xFieldName, this.yFieldName);
        // this.updateChart();
    }

    async addChart(){

        await this.excelService.bindToChart(this);
        let testData = await this.convertData(this.xFieldName, this.yFieldName);
     
        // this.charts.push(testData);
        console.log('chartList', this.charts)

    }

 
   


    //---------------------------Chart Functions ------------------------------




    async convertData(xFieldName, yFieldName) {
        let newData = this.matrixToObjArry(this.values, true);
        let headerObject = this.getHeaders(this.values);
        let dataSet;

        this.data = this.changeUserFieldNamesToReqd(
            newData,
            headerObject.usersXFieldName,
            headerObject.usersYFieldName,
            headerObject.usersColorFieldName
        );
        this.datasetExtent = d3.extent(this.data, function (d: any) {
            return d.yField;
        });
        dataSet = this.data;
        console.log('dataset', this.data);
        return dataSet;
    }



    drawAxis() {
        this.xAxis.call(d3.axisBottom(this.x).tickSizeOuter(0));

        this.xAxis.style('font-size', 15);

        this.yAxis
            .call(d3.axisLeft(this.y))
            .call((g) => g.select('.domain').remove());

        this.yAxis.style('font-size', 15);
    }



    changeUserFieldNamesToReqd(
        objectArray,
        usersXFieldName,
        usersYFieldName,
        usersColorFieldName
    ) {
        //function to convert the user's column names to the column names required by the various charting functions
        //this should be used in time so that you can allow the user to select which column they want to use for x values, which they want to use for y values etc. without requiring them to
        //use a certain layout or requiring certain names etc...

        for (let index = 0; index < objectArray.length; index++) {
            const element = objectArray[index];
            element.xField = objectArray[index][usersXFieldName];
            element.yField = +objectArray[index][usersYFieldName];

            if (objectArray[index][usersColorFieldName]) {
                element.colorField = objectArray[index][usersColorFieldName];
            } else {
                element.colorField = this.defaultColor;
            }
        }
        console.log(objectArray);
        return objectArray;
    }

    getHeaders(arrayData) {
        let headerRow = arrayData[0];
        console.log(headerRow[2]);
        let colorFieldCol;

        if (headerRow[2]) {
            colorFieldCol = headerRow[2];
        } else {
            colorFieldCol = false;
        }

        let headerObject = {
            headerRow: headerRow,
            usersXFieldName: headerRow[0],
            usersYFieldName: headerRow[1],
            usersColorFieldName: colorFieldCol,
        };
        console.log('headerObject', headerObject);
        return headerObject;
    }

    getFormula(){
        this.excelService.getCellFormula();
    }

    matrixToObjArry(arrayData, headers: boolean) {
        //convert a matrix (2D, array of arrays), into an array of objects, where each row becomes an object as an array element, and
        //the array of column headers = the objects keys (with the row's values being the key's value)

        var obj = {};
        let array = arrayData[0]; // first array in the data set (element[0]) is considered 'headers'

        let newArray = [];

        if (headers === true) {
            var startInd = 1;
        } else {
            var startInd = 0;
        }

        for (let j = startInd; j < arrayData.length; j++) {
            for (let index = 0; index < array.length; index++) {
                obj[array[index]] = arrayData[j][index];
            }
            newArray.push({ ...obj }); // Use ... spread operator to push a shallow clone!
        }

        return newArray;
    }
}
