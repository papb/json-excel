/* Ensure this file is consistent with ./defaults.ts and ./readme.md */

import type { TableStyleProperties, Workbook } from 'exceljs';

export type JsonSheet = {
	/**
	The name of the Worksheet (shown in the sheet tab in the bottom in Excel).
	*/
	sheetName: string;

	/**
	The data to be populated in the Worksheet.
	*/
	data: string[][];

	/**
	Whether or not to enable the "Format as Table" styling.

	This will enable striped rows and filter arrows on all headers.

	@default false
	*/
	formatAsTable?: boolean;

	/**
	Which theme to use when formatting as table.

	This option is ignored if `formatAsTable` is `false`.

	@default 'TableStyleMedium9' (medium blue)
	*/
	tableTheme?: TableStyleProperties['theme'];

	/**
	Whether or not to automatically remove leading and trailing whitespace from each cell.

	Having this enabled is great to make the cell content alignment be consistent with what is visible.

	@default true
	*/
	autoTrimWhitespace?: boolean;

	/**
	Whether or not to automatically calculate best widths for every column and best heights for every row.

	@default true
	*/
	autoFitCellSizes?: boolean;

	/**
	Options for auto-fitting cell sizes.
	*/
	autoFitCellSizesOptions?: AutoFitCellSizesOptions;
};

export type AutoFitCellSizesOptions = {
	/**
	The minimum height (in 'excel points') for every row.

	@default 15
	*/
	minHeight?: number;

	/**
	The maximum height (in 'excel points') for every row.

	Cannot be greater than 408 (this is an Excel limitation).

	@default 408
	*/
	maxHeight?: number;

	/**
	The minimum width (in 'excel points') for every column.

	@default 6
	*/
	minWidth?: number;

	/**
	The maximum width (in 'excel points') for every column.

	Cannot be greater than 254 (this is an Excel limitation).

	@default 170
	*/
	maxWidth?: number;

	/**
	Extra horizontal padding (in 'excel points') for every column.

	This amount will be added to the auto-calculated minimal width in which the contents fit.

	@default 3
	*/
	horizontalPadding?: number;

	/**
	Extra vertical padding (in 'excel points') for every cell.

	This amount will be added to the auto-calculated minimal height in which the contents fit.

	@default 2
	*/
	verticalPadding?: number;
};

export type JsonToExcelOptions = {
	/**
	Whether or not to allow overwriting the destination xlsx file.

	@default false
	*/
	overwrite?: boolean;

	/**
	Whether or not to automatically convert CRLF in strings given in sheets `data` to LF.

	@default true
	*/
	normalizeLinefeeds?: boolean;

	/**
	Excel has a strange limitation on the amount of lines a cell can display. After a certain number of lines, Excel will stop rendering them, but they will still be there (if copied and pasted in a text editor, for example). This option specifies how `@papb/json-excel` will protect you from this.

	The exact amount of lines before this display glitch happens depends on the Excel version. In the latest version (2020), lines from the 1639th onwards will not be rendered. Until 2017, this happens from the 255th line onwards (as reported [here](https://answers.microsoft.com/en-us/msoffice/forum/all/excel-does-not-display-the-line-feed-character/95201f69-670b-414f-91fc-3a3b1690ff96)). The exact limit for versions between 2017 and 2020 is not known.

	This way:

	- If you choose `'legacy'`: the maximum amount of linefeeds allowed will be `253`. An error will be thrown if any cell has `254` or more linefeeds.
	- If you choose `'>=2020'`: the maximum amount of linefeeds allowed will be `1637`. An error will be thrown if any cell has `1638` or more linefeeds.
	- If you choose `'off'`: this limit will not be checked. Recall that lines beyond the limit are not lost - they are simply not rendered by Excel, but copying and pasting into a text editor will retrieve all data, without loss.

	@default 'legacy'
	*/
	linefeedLimitChecking?: 'legacy' | '>=2020' | 'off';

	/**
	A custom operation to be performed on the resulting ExcelJS workbook, right before generating the output file.

	You can use this hook to make arbitrary custom changes in the generated workbook.

	If you return a Promise from this hook, it will be awaited.

	@example
	```
	await jsonToExcel(
		sheets,
		'example.xlsx',
		{
			overwrite: true,
			beforeSave(workbook) {
				workbook.creator = 'Someone';
				workbook.lastModifiedBy = 'Someone Else';
				workbook.getWorksheet(1).getCell('C3').font = {
					bold: true
				};
			}
		}
	);
	```
	*/
	beforeSave?: (workbook: Workbook) => void | Promise<void>;
};

export type ExpandedAutoFitCellSizesOptions = Required<AutoFitCellSizesOptions>;

export type ExpandedJsonSheet = Required<JsonSheet> & {
	autoFitCellSizesOptions: ExpandedAutoFitCellSizesOptions;
};

export type ExpandedJsonToExcelOptions = Required<JsonToExcelOptions>;
