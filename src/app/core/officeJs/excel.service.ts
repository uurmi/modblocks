import {Border, CellFormat, CustomSettableCellFormat} from "./cellFormats.types";
import {Range} from "./range"
import {AngularFireList} from "@angular/fire/database";
import {ApplicationRef, Injectable} from "@angular/core";
import {FirebaseService} from "../firebase/firebase.service";
import {CollectionItem} from "../firebase/collectionItem";
import {AuthService} from "../firebase/auth.service";
import {User} from "../firebase/user";
import {v4 as uuidv4} from 'uuid';
import {BehaviorSubject, Observable} from "rxjs";

const INIT_DATA = [[]];
const BASE_URL = 'https://www.google.com';
@Injectable({
    providedIn: 'root'
})




// TODO: Add alerts and loading feature
export class ExcelService {
    collectionItemRef: AngularFireList<CollectionItem> = null;
    private collectionItemPath = '/collectionItem';
    usersRef: AngularFireList<User> = null;
    private userPath = '/user';
    public eventResul;

    public DataStore = new BehaviorSubject(null);
    public data$: Observable<any> = this.DataStore.asObservable();

    constructor(
        private dbService: FirebaseService,
        private authService: AuthService,
        private ref: ApplicationRef
    ) {
        this.collectionItemRef = dbService.getAll(this.collectionItemPath);
        this.usersRef = dbService.getAll(this.userPath);
        this.registerInitialSelectionBindingEvent();

        // console.log(this)
    }



    // Function to save a collection item to the database
    saveCollectionItem(formValue) {
        switch (formValue.type) {
            case 'range': {
                this.saveRange(formValue.name)
                break
            }
            case 'format': {
                this.saveCellFormat(formValue.name)
                break
            }
        }
    }

    // Function to load the selected range properties and save them to the database
    saveRange(name: string) {
        return Excel.run(async (context) => {

            const selectedRange = context.workbook.getSelectedRange()
                .load("cellCount, columnCount, columnHidden, format/borders/*, formulasLocal, formulasR1C1, numberFormat, rowCount, rowHidden, savedAsArray, values")
            await context.sync();
            let cellFormats: CellFormat[] = [];
            let range: Range = {
                name: name,
                cellCount: selectedRange.cellCount,
                cellFormats: cellFormats,
                columnCount: selectedRange.columnCount,
                columnHidden: selectedRange.columnHidden,
                formulasLocal: selectedRange.formulasLocal,
                formulasR1C1: selectedRange.formulasR1C1,
                numberFormat: selectedRange.numberFormat,
                rowCount: selectedRange.rowCount,
                rowHidden: selectedRange.rowHidden,
                savedAsArray: selectedRange.savedAsArray,
                values: selectedRange.values
            }
            let collectionItem: CollectionItem = {
                item: range,
                type: "Range",
                users: {}
            }
            collectionItem.users[this.authService.user] = true
            return this.readRangeFormats(range.cellFormats, () => {
                this.dbService.create(this.collectionItemRef, collectionItem)
                    .then(res => {
                        this.dbService.getOne(this.userPath, this.authService.user).subscribe(
                            (user: User) => {
                                let data = {
                                    collectionItems: user.collectionItems ? user.collectionItems : {}
                                }
                                data.collectionItems[res.key] = true
                                this.dbService.update(this.usersRef, user.id, data)
                            }
                        )
                    })
            });
        });
    }

    // Function to save a single cell's format to the database
    async saveCellFormat(name) {
        await Excel.run(async (context) => {
            const selectedCell = context.workbook.getActiveCell().load("format/*, format/borders/*, format/fill, format/font");
            await context.sync()
            const collectionItem: CollectionItem = {
                item: this.readCellFormat(selectedCell, name),
                type: "Format",
                users: {}
            }
            collectionItem.users[this.authService.user] = true
            this.dbService.create(this.collectionItemRef, await collectionItem)
                .then(res => {
                    this.dbService.getOne(this.userPath, this.authService.user).subscribe(
                        (user: User) => {
                            let data = {
                                collectionItems: user.collectionItems ? user.collectionItems : {}
                            }
                            data.collectionItems[res.key] = true
                            this.dbService.update(this.usersRef, user.id, data)
                        }
                    )
                })
        })
    }

    // Function to load the selected range into the selected area (picking the top left cell)
    async loadSavedRange(range) {
        await Excel.run(async (context) => {
            context.runtime.enableEvents = false;

            const selectedCell = context.workbook.getActiveCell()
            selectedCell.load("columnIndex, rowIndex")
            await context.sync()
            const selectedRange = context.workbook.worksheets.getActiveWorksheet()
                .getRangeByIndexes(
                    selectedCell.rowIndex,
                    selectedCell.columnIndex,
                    range.rowCount,
                    range.columnCount
                ).load("address");
            await context.sync()
            selectedRange.columnHidden = range.columnHidden;
            selectedRange.formulasLocal = range.formulasLocal;
            selectedRange.formulasR1C1 = range.formulasR1C1;
            selectedRange.numberFormat = range.numberFormat;
            selectedRange.rowHidden = range.rowHidden;
            selectedRange.values = range.values;
            console.log('here')
            this.applyRangeFormats(range.cellFormats, null, selectedRange.address)
            context.runtime.enableEvents = true;
        });
    }

    // Function to read and save the range format (for each cell)
    readRangeFormats(cellFormats: CellFormat[], callBackFunction) {
        Excel.run((context) => {
            let cells = [];
            //First get the size of the range for use in the loop below
            let myRange = context.workbook.getSelectedRange().load(["rowCount", "columnCount"]);

            return context.sync()
                .then(() => {
                    //Loop though every cell and queue a load on the context
                    for (let r = 0; r < myRange.rowCount; ++r)
                        for (let c = 0; c < myRange.columnCount; ++c)
                            cells.push(myRange.getCell(r, c).load("format/*, format/borders/*, format/fill, format/font"));
                })
                .then(context.sync)
                .then(async () => {
                    for (let i = 0; i < cells.length; i++) {
                        cellFormats[i] = await this.readCellFormat(cells[i])
                    }
                })
        })
            .then(() => {
                callBackFunction()
            })
            .catch(function (error) {
                console.log("Error: " + error);
                if (error instanceof OfficeExtension.Error) {
                    console.log("Debug info: " + JSON.stringify(error.debugInfo));
                }
            });
    }

    // Function to read a single cell's format
    readCellFormat(cell, name?) {
        let tempBorders: Border[] = [];
        let tempSettableCellFormat: CustomSettableCellFormat = {
            borders: tempBorders,
            format: {
                fill: {
                    color: cell.format.fill.color,
                    pattern: cell.format.fill.pattern,
                    patternColor: cell.format.fill.patternColor,
                    patternTintAndShade: cell.format.fill.patternTintAndShade,
                    tintAndShade: cell.format.fill.tintAndShade
                },
                font: {
                    bold: cell.format.font.bold,
                    color: cell.format.font.color,
                    italic: cell.format.font.italic,
                    name: cell.format.font.name,
                    size: cell.format.font.size,
                    strikethrough: cell.format.font.strikethrough,
                    subscript: cell.format.font.subscript,
                    superscript: cell.format.font.superscript,
                    tintAndShade: cell.format.font.tintAndShade,
                    underline: cell.format.font.underline
                }
            }
        };
        for (let i = 0; i < 8; i++) {
            let tempBorder: Border = {
                color: cell.format.borders.items[i].color,
                sideIndex: cell.format.borders.items[i].sideIndex,
                style: cell.format.borders.items[i].style,
                tintAndShade: cell.format.borders.items[i].tintAndShade ? cell.format.borders.items[i].tintAndShade : 'null',
                weight: cell.format.borders.items[i].weight
            };
            tempSettableCellFormat.borders.push(tempBorder);
        }
        const cellFormat: CellFormat = {
            name: name ? name : null,
            format: {
                autoIndent: cell.format.autoIndent,
                columnWidth: cell.format.columnWidth,
                horizontalAlignment: cell.format.horizontalAlignment,
                indentLevel: cell.format.indentLevel,
                readingOrder: cell.format.readingOrder,
                rowHeight: cell.format.rowHeight,
                shrinkToFit: cell.format.shrinkToFit,
                textOrientation: cell.format.textOrientation,
                useStandardHeight: cell.format.useStandardHeight,
                useStandardWidth: cell.format.useStandardWidth,
                verticalAlignment: cell.format.verticalAlignment,
                wrapText: cell.format.wrapText
            },
            settableCellFormat: tempSettableCellFormat
        };
        return cellFormat
    }

    // Function to apply formatting to a single cell
    applyCellFormat(cell, cellFormat) {
        cell.format.set(cellFormat.format)
        cell.setCellProperties([
            [{
                format: cellFormat.settableCellFormat.format
            }]
        ]);
        this.applyBorders(cell, cellFormat.settableCellFormat.borders)
    }

    // Function to apply formatting to each cell in a range
    applyRangeFormats(cellFormats?: CellFormat[], cellFormat?: CellFormat, address?) {
        Excel.run((context) => {
            let cells = [];
            let myRange = address ? context.workbook.worksheets.getActiveWorksheet()
                    .getRange(address).load(["rowCount", "columnCount"])
                : context.workbook.getSelectedRange()
                    .load(["rowCount", "columnCount"]);
            return context.sync()
                .then(() => {

                    //Loop though every cell
                    for (let r = 0; r < myRange.rowCount; ++r)
                        for (let c = 0; c < myRange.columnCount; ++c)
                            cells.push(myRange.getCell(r, c));


                })
                .then(() => {

                    if (!!cellFormat) {
                        for (let i = 0; i < cells.length; i++)
                            this.applyCellFormat(cells[i], cellFormat)
                    } else {
                        for (let i = 0; i < cells.length; i++)
                            this.applyCellFormat(cells[i], cellFormats[i])
                    }

                    return context.sync()
                })

        })
            .then(function () {
                return ("Pasted !");
            })
            .catch(function (error) {
                console.log("Error: " + error);
                if (error instanceof OfficeExtension.Error) {
                    console.log("Debug info: " + JSON.stringify(error.debugInfo));
                }
            });
    }

    // Function to apply formatting to borders in a single cell
    applyBorders(cell: any, borders: Border[]) {
        for (let i = 0; i < borders.length; i++) {
            cell.format.borders.getItemAt(i).color = borders[i].color
            cell.format.borders.getItemAt(i).weight = borders[i].weight
            cell.format.borders.getItemAt(i).tintAndShade = (borders[i].tintAndShade !== 'null') ? borders[i].tintAndShade : null
            cell.format.borders.getItemAt(i).style = (borders[i].style !== 'None') ? borders[i].style : 'None'
        }
    }

    // Function to load the selected format into the selected area

    /**
     *
     * @param format
     */
    async loadSavedFormat(format) {
        this.applyRangeFormats(null, format)
    }
//-----------------------------------------------------------------------------------------------------------------------
    /**
     * SELECTION CHANGE EVENT UPDATE OBSERVABLE
     *
     * This function creates a binding & event listener for the active cell/selection
     * When the selection changes, the onSelectionChange function is called
     *
     * WORKING!!!
     */

    async registerInitialSelectionBindingEvent() {


        await Excel.run(async (context) => {
            this.eventResul = context.workbook.worksheets.onSelectionChanged.add(
                async (event: Excel.WorksheetSelectionChangedEventArgs) => {
                    // this.logMe({ address: event.address });
                    // this.logMe(event);
                    this.getWorkshtSelChangeEventRange(event);
                    this.ref.tick();
                }
            );

            await context.sync();
        });


    }

    async getWorkshtSelChangeEventRange(event){
        let range = await Excel.run(async (context) => {
            return context.sync().then(function () {
                return context.workbook.worksheets.getItem(event.worksheetId).getRange(event.address).load('*, values');

            })

        });

    //   this.DataStore.next(range.address);
      this.DataStore.next(range);
      this.ref.tick(); //THIS IS WHAT MADE IT REFRESH!!! WOKRING WORKING
      console.log(range);
      console.log(range.values);


    }

    //------ SELECTION CHANGE EVENT---------------------
    //--------------------------------------------------


    changeDataStore(activeRange){
        this.DataStore.next(activeRange);

    }

    logDataStore() {
        console.log('log datastore from service run')
        // console.log(this.DataStore.getValue());
        // this.DataStore.next('test')
        console.log(this.DataStore.getValue())
        // console.log(this.eventResul.context);
    }


    logMe(logThis) {
        console.log(logThis)
    }


    bindToChart(that) {
        return Excel.run(async (context) => {
            const selectedRange = context.workbook.getSelectedRange().load("values, address")

            await context.sync()
            let bindId = uuidv4();
            console.log('uuid', bindId);

            let valueObject = {
                id: bindId,
                values: selectedRange.values
            }

            // that.updateValues(selectedRange.values)
            that.addValue(valueObject)// calls the function 'update values in - chart.component.ts
            const myBinding = context.workbook.bindings.add(selectedRange, "Range", bindId)

            myBinding.onDataChanged.add(async (eventArgs) => {
                myBinding.load("type, id");
                await context.sync()
                    .then(async () => {
                        switch (myBinding.type) {
                            case "Range": {
                                let valueChanges = myBinding.getRange().load("values, valueTypes")
                                await context.sync()
                                let valueObject = {
                                        id: myBinding.id,
                                    values: valueChanges.values
                                }
                                console.log(valueObject, " Values changed")
                                that.updateValues(valueChanges.values, myBinding.id)

                            }
                        }
                    })
            })
            console.log("Binding created", myBinding)
        })
    }

    // Function to load the selected format into the selected area
    async getCellProps() {
        await Excel.run(async (context) => {
            let cell = context.workbook.getActiveCell(); //get the selected cell

            //properties aren't immediately accessible by the API. First they most be 'loaded', then we must use context.sync() to make the loaded property accessible:

            cell.load("*, format/*, format/borders/*, format/fill, format/font"); //loads most of the properties(doesn't load all for some reason)
            await context.sync();

            console.log("Loaded props: ", cell);
        });
    }

      // Function to load the selected format into the selected area
      async getCellFormula() {
        await Excel.run(async (context) => {
            let cell = context.workbook.getActiveCell(); //get the selected cell

            //properties aren't immediately accessible by the API. First they most be 'loaded', then we must use context.sync() to make the loaded property accessible:

            cell.load("formulas, cellCount, address, values"); //loads most of the properties(doesn't load all for some reason)
            await context.sync();

            console.log("Loaded props: ", cell);
        });
    }

    async getFormulaString() {
       return await Excel.run(async (context) => {
            let cell = context.workbook.getActiveCell(); //get the selected cell

            //properties aren't immediately accessible by the API. First they most be 'loaded', then we must use context.sync() to make the loaded property accessible:

            cell.load("formulas"); //loads most of the properties(doesn't load all for some reason)
            await context.sync();


           console.log("Formula: ", cell.formulas[0][0]);
            return cell.formulas[0][0];
        });

    }

    //function to load the values of a certain range. Returns an array
    async getRangeValues() {
        return await Excel.run(async (context) => {
            let cell = context.workbook.getActiveCell(); //get the selected cell
            let tempArray = [];

            //properties aren't immediately accessible by the API. First they most be 'loaded', then we must use context.sync() to make the loaded property accessible:

            cell.load("values, valueTypes"); //loads most of the properties(doesn't load all for some reason)
            await context.sync();

            for (let index = 0; index < cell.values.length; index++) {
                let value = cell.values[index];
                let type = cell.valueTypes[index];
                tempArray.push({
                    value: value,
                    type: type
                })
            }
            return tempArray;


        });

    }


    // Function to load the selected format into the selected area
    async getExtendedRange() {
        await Excel.run(async (context) => {
            let cell = context.workbook.getActiveCell(); //get the selected cell
            let surroundingRange = cell.getSurroundingRegion();
            let firstRow = surroundingRange.getRow(0);
            //properties aren't immediately accessible by the API. First they most be 'loaded', then we must use context.sync() to make the loaded property accessible:

            surroundingRange.load("*, format/borders/*, format/fill, format/font"); //loads most of the properties(doesn't load all for some reason)
            await context.sync();
            await this.loadRangeProps(firstRow);
            console.log({
                'Surrounding Range': surroundingRange,
                'First Row': firstRow

            });
        });
    }

    async loadRangeProps(activeRange) {
        await Excel.run(async (context) => {
            activeRange.load("*, format/borders/*, format/fill, format/font"); //loads most of the properties(doesn't load all for some reason)
            await context.sync();
        });
    }

    // Function to load the selected format into the selected area
    async loopRange() {
        await Excel.run(async (context) => {
            let cell = context.workbook.getActiveCell(); //get the selected cell

            //properties aren't immediately accessible by the API. First they most be 'loaded', then we must use context.sync() to make the loaded property accessible:

            cell.load("*, format/borders/*, format/fill, format/font"); //loads most of the properties(doesn't load all for some reason)
            await context.sync();

            console.log("Loaded props: ", cell);
        });
    }


    // Function to save a single cell's format to the database
    async bindRangeOnPrompt(name) {
        await Office.context.document.bindings.addFromPromptAsync(
            Office.BindingType.Matrix,
            {id: "myBinding"},
            this.callbackFunction
        );

    }

    callbackFunction() {

        console.log('Test');

    }

    async listWorksheets() {
        await Excel.run(async (context) => {
            const sheets = context.workbook.worksheets;
            sheets.load('items/*')

            await context.sync();

            if (sheets.items.length > 1) {
                console.log(`There are ${sheets.items.length} worksheets in the workbook:`);
            } else {
                console.log(`There is one worksheet in the workbook:`);
            }
            for (let i in sheets.items) {
                console.log(sheets.items[i].name);
                console.log(sheets.items[i]);
            }
        });
      }

}
