/* Ensure this file is consistent with ./defaults.ts and ./readme.md */

import type { TableStyleProperties } from 'exceljs';

export type JsonSheet = {
	/*
	The name of the Worksheet (shown in the sheet tab in the bottom in Excel).
	*/
	sheetName: string;

	/*
	The data to be populated in the Worksheet.
	*/
	data: string[][];

	/*
	Whether or not to enable the "Format as Table" styling.

	This will enable striped rows and filter arrows on all headers.

	@default false
	*/
	formatAsTable?: boolean;

	/*
	Which theme to use when formatting as table.

	This option is ignored if `formatAsTable` is `false`.

	@default 'TableStyleMedium9' (medium blue)
	*/
	tableTheme?: TableStyleProperties['theme'];

	/*
	Whether or not to automatically remove leading and trailing whitespace from each cell.

	Having this enabled is great to make the cell content alignment be consistent with what is visible.

	@default true
	*/
	autoTrimWhitespace?: boolean;

	/*
	Whether or not to automatically calculate best widths for every column and best heights for every row.

	@default true
	*/
	autoFitCellSizes?: boolean;

	/*
	Options for auto-fitting cell sizes.
	*/
	autoFitCellSizesOptions?: AutoFitCellSizesOptions;
};

export type AutoFitCellSizesOptions = {
	/*
	The minimum height (in 'excel points') for every row.

	@default 15
	*/
	minHeight?: number;

	/*
	The maximum height (in 'excel points') for every row.

	Cannot be greater than 408 (this is an Excel limitation).

	@default 408
	*/
	maxHeight?: number;

	/*
	The minimum width (in 'excel points') for every column.

	@default 6
	*/
	minWidth?: number;

	/*
	The maximum width (in 'excel points') for every column.

	Cannot be greater than 254 (this is an Excel limitation).

	@default 170
	*/
	maxWidth?: number;

	/*
	Extra horizontal padding (in 'excel points') for every column.

	This amount will be added to the auto-calculated minimal width in which the contents fit.

	@default 3
	*/
	horizontalPadding?: number;

	/*
	Extra vertical padding (in 'excel points') for every cell.

	This amount will be added to the auto-calculated minimal height in which the contents fit.

	@default 2
	*/
	verticalPadding?: number;
};

export type JsonToExcelOptions = {
	/*
	Whether or not to allow overwriting the destination xlsx file.

	@default false
	*/
	overwrite?: boolean;
};

export type ExpandedAutoFitCellSizesOptions = Required<AutoFitCellSizesOptions>;

export type ExpandedJsonSheet = Required<JsonSheet> & {
	autoFitCellSizesOptions: ExpandedAutoFitCellSizesOptions;
};

export type ExpandedJsonToExcelOptions = Required<JsonToExcelOptions>;
