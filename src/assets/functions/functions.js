/* eslint-disable no-unused-vars */

/* global console setInterval, clearInterval */

/**
 * Add two numbers
 * @customfunction
 * @param {number} first First number
 * @param {number} second Second number
 * @returns {number} The sum of the two numbers.
 */
function add(first, second) {
    return first + second;
}


/**
 * Returns the second highest value in a matrixed range of values.
 * @customfunction
 * @param {number[][]} values Multiple ranges of values.
 */
 function secondHighest(values) {
    let highest = values[0][0],
      secondHighest = values[0][0];
    for (var i = 0; i < values.length; i++) {
      for (var j = 0; j < values[i].length; j++) {
          console.log(values[i][j]);
        if (values[i][j] >= highest) {
          secondHighest = highest;
          highest = values[i][j];
        } else if (values[i][j] >= secondHighest) {
          secondHighest = values[i][j];
        }
      }
    }
    return secondHighest;
  }



  /**
 * Returns the second highest value in a matrixed range of values.
 * @customfunction
 * @param {number[][]} values Multiple ranges of values.
 * @param {CustomFunctions.Invocation} invocation Invocation object.
 * @requiresParameterAddresses 
 */
 async function sumDisplayed(values, invocation) {
      // Retrieve the context object. 
    var context = new Excel.RequestContext();

    let rangeString = invocation.parameterAddresses[0].split("!"); //split range address into range[0] = sheet and range[1] = range
    let sheetName = rangeString[0];
    let rangeAddress = rangeString[1];  


    let sheet =  context.workbook.worksheets.getItem(sheetName);
    let range = sheet.getRange(rangeAddress);
    range.load("text");
    // range.load("*, format/*, format/borders/*, format/fill/*, format/font/*");
    await context.sync();


    let displayedValSum = 0;



let arrayToAdd=range.text;

 console.log(range.toJSON());


    for (var i = 0; i < arrayToAdd.length; i++) {
      for (var j = 0; j < arrayToAdd[i].length; j++) {
        console.log(arrayToAdd[i][j]);
        displayedValSum= displayedValSum + +arrayToAdd[i][j];

      }
    }
    // return secondHighest;
    return displayedValSum;
  }

  

 /**
 * Returns the second highest value in a matrixed range of values.
 * @customfunction
 * @param {any[][]} colorCell Multiple ranges of values.
 * @param {number[][]} targetRange Multiple ranges of values.
 * @param {CustomFunctions.Invocation} invocation Invocation object.
 * @requiresParameterAddresses 
 */
 async function sumByColor(colorCell, targetRange, invocation) {
  // Retrieve the context object. 
          var context = new Excel.RequestContext();         

          let colorRangeString = invocation.parameterAddresses[0].split("!"); //split range address into range[0] = sheet and range[1] = range
          let colorSheetName = colorRangeString[0];
          let colorRangeAddress = colorRangeString[1];  
        
          let targetRangeString = invocation.parameterAddresses[1].split("!"); //split range address into range[0] = sheet and range[1] = range
          let targetSheetName = targetRangeString[0];
          let targetRangeAddress = targetRangeString[1];  

          let colorSheet =  context.workbook.worksheets.getItem(colorSheetName);
          let colorRange = colorSheet.getRange(colorRangeAddress);

          colorRange.load("format/fill/color");
  
          let targetSheet =  context.workbook.worksheets.getItem(targetSheetName);

          let searchRange = targetSheet.getRange(targetRangeAddress);
          searchRange.track();
          searchRange.load("*, format/*, format/fill/*"); 

        
          let displayedValSum = 0;

          await context.sync();

          cells = [];

          for (var i = 0; i < searchRange.rowCount; i++) {
            for (var j = 0; j < searchRange.columnCount; j++) {
              let thiscell = searchRange.getCell(i,j);
              thiscell.load('values, formulas, format/fill/color');
              cells.push(thiscell);             
                
            }
          }

          await context.sync();

          let colorMatch = colorRange.format.fill.color;

          for (let i = 0; i < cells.length; i++) {
            if(cells[i].format.fill.color==colorMatch){
              displayedValSum = displayedValSum + cells[i].values[0][0];
            }          
          }
   
          return displayedValSum;  
}



  CustomFunctions.associate("SECONDHIGHEST", secondHighest);
  CustomFunctions.associate("SUMDISPLAYED", sumDisplayed);
  CustomFunctions.associate("SUMBYCOLOR", sumByColor);

