import {CellFormat} from "../officeJs/cellFormats.types";
import {Range} from "../officeJs/range";

export class CollectionItem {
    item: CellFormat | Range
    type: string
    users: {}
}
