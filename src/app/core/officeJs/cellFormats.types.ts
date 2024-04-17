export class CustomSettableCellFormat {
    borders: Border[]
    format: {
        fill: {
            color: string,
            pattern: string,
            patternColor: string,
            patternTintAndShade: number,
            tintAndShade: number
        },
        font: {
            bold: boolean,
            color: string,
            italic: boolean,
            name: string,
            size: number,
            strikethrough: boolean,
            subscript: boolean,
            superscript: boolean,
            tintAndShade: number | string,
            underline: string
        }
    }
}

export class Border {
    color: string
    sideIndex: string
    style: string
    tintAndShade: number | string
    weight: number
}

export class CellFormat {
    id?: any
    format: {
        autoIndent: boolean
        columnWidth: number
        horizontalAlignment: string
        indentLevel: number
        readingOrder: string
        rowHeight: number
        shrinkToFit: boolean
        textOrientation: number
        useStandardHeight: boolean
        useStandardWidth: boolean
        verticalAlignment: string
        wrapText: boolean
    }
    name?: string
    settableCellFormat: any
}
