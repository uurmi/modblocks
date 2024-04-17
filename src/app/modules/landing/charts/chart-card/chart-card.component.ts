import { ChangeDetectorRef, ViewEncapsulation, Component, IterableDiffer, IterableDiffers, IterableChanges, 
  OnInit, Input, ViewChild, AfterViewInit, OnChanges, DoCheck } from '@angular/core';
import html2canvas from 'html2canvas';
import {ExcelService} from '../../../../core/officeJs/excel.service';
import * as d3 from 'd3';
import { ToolsModule } from '../../tools/tools.module';




@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit, OnChanges, AfterViewInit, DoCheck {

  
  @Input() chart = {values: [], id: ''};
  @ViewChild('username') input;
  @ViewChild('chartWindow') chartWindow;
  private _diff: IterableDiffer<number>;


  constructor(     
    private excelService: ExcelService,
    private changeDetection: ChangeDetectorRef,
    private _iterableDiffers: IterableDiffers
    ) {
      // this.tip = d3tip();
      // this.width = 800 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;

      this.width = 800;
      this.winHeight = 500;
      this.winWidth = 800;
    
   }
   


  ngOnInit(): void {
    console.log('card initialised');
    console.log(this.input);
    this._diff = this._iterableDiffers.find(this.chart.values).create();
  }

  public ngDoCheck(): void {
    const changes: IterableChanges<number> = this._diff.diff(this.chart.values);

    if (changes) {
      this.updateChart();
    }
  }

  ngAfterViewInit() {
    // ElementRef { nativeElement: <input> }
    this.addChart();
    console.log(this.chartWindow);
  }

  ngOnChanges() {
        console.log('changed data called!!')
    // this.updateChart();
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values
    
}

  // values = [[]];
  
  public values = this.chart.values;

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

   public imageSaveSettings = {
     scale: 3,
     backgroundColor: null //null = transparent, default = #ffffff
   }
  public imageScale = 3;
   
   public charts = [];

   public data: any;

   // target the prescribed root node and add an svg element
   private margin = {
       top: 20,
       right: 10,
       bottom: 20,
       left: 20, // add more white space on the left side of the visualization to display the names
   };

   xFieldName = 'name';
   yFieldName = 'points';

   defaultColor = 'orange';
   transitionTime = 1500;




  takeshot() {
    let div =  document.getElementById('ChartDiv');

    // Use the html2canvas
    // function to take a screenshot
    // and append it
    // to the output div
    html2canvas(div, this.imageSaveSettings).then(

        function (canvas) {


            // canvas.toBlob(function(blob)){
            //   navigator.clipboard.writ
            // }

          
            var a = document.createElement('a');
            // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
            a.href = canvas.toDataURL("image/png");


            
            
            a.download = 'somefilename.png';
            a.click();


           
        })
}





// html2canvas(svg).then(function(canvas) {

//   canvas.toBlob(function(blob) {
//     navigator.clipboard
//       .write([
//             new ClipboardItem(

//                   Object.defineProperty({}, blob.type, {
//                     value: blob,
//                     enumerable: true
//                   })

//             )
      
//       ])
//       .then(function() {
//       console.log("Copied to clipboard");
//       domNode.classList.remove("on");
//     });
//   });
// });


    //---------------------------Chart Functions ------------------------------
    async addChart() {

      await this.convertData();




      // await this.excelService.bindToChart(this);
      // let testData = await this.convertData(this.xFieldName, this.yFieldName);
      this.initSvg();
      this.initAxis();
      this.drawAxis();
      this.drawBars();
      console.log('Chart values',this.chart.values);
  }

  setYScale() {
    console.log('setYScale initialised')
      this.y = d3
          .scaleLinear()
          .domain([0,this.datasetExtent[1]])
          .nice()
          .range([this.height - this.margin.bottom, this.margin.top]);
  }

  setXScale() {
      this.x = d3
          .scaleBand()
          .domain(this.data.map((d) => d.xField))
          .range([this.margin.left, this.width - this.margin.right])
          .padding(0.1);
  }

  async updateChart() {
    await this.convertData();
    
      if (this.g) {
          this.setXScale();
          this.setYScale();

          console.log(this.datasetExtent);

          this.xAxis
              .transition(this.transitionTime)
              .call(d3.axisBottom(this.x).tickSizeOuter(0));
          this.yAxis
              .transition(this.transitionTime)
              .call(d3.axisLeft(this.y));

          this.drawBars();
      }
  }
  
  
  
    initSvg() {


      this.svg = d3.select(this.chartWindow.nativeElement)
              .append('svg')
          .attr('id', 'svgWindow')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', '0 0 800 500');

          console.log('component svg:', this.svg)
      this.g = this.svg
          .append('g')
          .attr(
              'transform',
              'translate(' + this.margin.left + ',' + this.margin.top + ')'
          );

  } 



  async convertData() {


    let newData = this.matrixToObjArry(this.chart.values, true);
    let headerObject = this.getHeaders(this.chart.values); 
    //get headers automatically selects column 1 as the 'users xfieldname'
    //column 2 as the user's YFieldName and 3 as their color fieldname
    //TODO rather than this 'getheaders function' defaulting the x, y, and color fields, set up functionality to let the user select these 

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

initAxis() {
    this.setYScale();
    this.setXScale();

    this.xAxis = this.g
        .append('g')
        .attr(
            'transform',
            `translate(0,${this.height - this.margin.bottom})`
        );

    this.yAxis = this.g
        .append('g')
        .attr('transform', `translate(${this.margin.left},0)`);
}

drawAxis() {
    this.xAxis.call(d3.axisBottom(this.x).tickSizeOuter(0));

    this.xAxis.style('font-size', 15);

    this.yAxis
        .call(d3.axisLeft(this.y))
        .call((g) => g.select('.domain').remove());

    this.yAxis.style('font-size', 15);
}

drawBars() {
 



   let bars=  this.g
        .selectAll('.bars')
        .data(this.data)

        .join(
            (enter) => enter.append('rect').classed('bars', true)
                            ,
            
            (update) => update.classed('bars', true),
            (exit) => exit.remove()
        )
        .on("mouseover", function(){
          d3.select(this).attr("opacity", .7);
  
        })
        .on('mouseout',function(d, i){
         d3.select(this).attr("opacity", 1)       
        //  d3.select(this).attr("fill", i.colorField)
        })
        

        .attr('x', (d) => this.x(d.xField))
        .attr('width', this.x.bandwidth())
        
        .transition()
        .duration(this.transitionTime)
        .attr('fill', (d) => d.colorField) //Set fill color based on text field!
        .attr('y', (d) => (d.yField < 0 ? this.y(0) : this.y(d.yField)))
        .attr('height', (d) => Math.abs(this.y(0) - this.y(d.yField)));

       let  highlight_color = "#ffd700";

       

    




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
    // console.log(headerRow[2]);
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
    // console.log('headerObject', headerObject);
    return headerObject;
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
