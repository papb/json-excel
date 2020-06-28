# @papb/json-excel [![Build Status](https://travis-ci.com/papb/json-excel.svg?branch=master)](https://travis-ci.com/papb/json-excel)

> Create a pretty Excel table from JSON data with a very simple API


## Highlights

* Pretty output
* Intelligently auto-fits cell sizes by default
* Checks for [Excel limitations](https://support.microsoft.com/en-ie/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3) automatically (such as maximum cell length) and throws helpful errors if any limit is exceeded
* Get the *Format as Table* Excel styling, with filterable headers, by simply enabling an option
* Written in TypeScript (you get autocomplete suggestions in your IDE!)


## Install

```
$ npm install @papb/json-excel
```


## Usage

```js
const jsonToExcel = require('@papb/json-excel');

(async () => {
	await jsonToExcel([
		{
			sheetName: 'Hello World',
			data: [
				['Foo', 'Bar', 'Baz'],
				['A large string here but with\none line break', 'Hi', 'Test'],
				[
					'\'starting single quote\nis rendered normally',
					'Lots\nof\nline\nbreaks',
					'Auto-fits cells with a little extra margin'
				],
				['Nice!', '', 'Quick and to the point!']
			],
			formatAsTable: true
		}
	], 'example.xlsx', { overwrite: true });
})();
```

Output is an excel file called `example.xlsx` with a single sheet (called `Hello World`) and the following content:

![](readme-example.png)


## API

<!-- Ensure this part is consistent with ./types.ts and ./defaults.ts -->

### jsonToExcel(jsonSheets, destinationPath, options?)

Async function that creates a xlsx file with the provided data.

#### jsonSheets

Type: `object[]`

An array of objects, each representing one sheet, with:

* `sheetName` (`string`, required): The name of the Worksheet (shown in the sheet tab in the bottom in Excel).
* `data` (`string[][]`, required): The data to be populated in the Worksheet.
* `formatAsTable` (`boolean`, optional, default `false`): Whether or not to enable the *"Format as Table"* styling, like in the above example. This will enable striped rows and filter arrows on all headers.
* `tableTheme` (`string`, optional, default `'TableStyleMedium9'`): Which theme to use when formatting as table. This option is ignored if `formatAsTable` is `false`. The default value corresponds to the one from the screenshot above (medium blue). The list of supported themes is shown right in your IDE via autocomplete suggestions to this option. The autocomplete works even if you are not using TypeScript!
* `autoTrimWhitespace` (`boolean`, optional, default `true`): Whether or not to automatically remove leading and trailing whitespace from each cell. Having this enabled is great to make the cell content alignment be consistent with what is visible.
* `autoFitCellSizes` (`boolean`, optional, default `true`): Whether or not to automatically calculate best widths for every column and best heights for every row.
* `autoFitCellSizesOptions` (`object`, optional): Extra options for configuring the behavior of the auto-fitting of cell sizes:
	* `minHeight` (`number`, optional, default `15`): The minimum height (in *"excel points"*) for every row.
	* `maxHeight` (`number`, optional, default `408`): The maximum height (in *"excel points"*) for every row. Cannot be greater than 408 (this is an Excel limitation).
	* `minWidth` (`number`, optional, default `6`): The minimum width (in *"excel points"*) for every column.
	* `maxWidth` (`number`, optional, default `170`): The maximum width (in *"excel points"*) for every column. Cannot be greater than 254 (this is an Excel limitation).
	* `horizontalPadding` (`number`, optional, default `3`): Extra horizontal padding (in *"excel points"*) for every column. This amount will be added to the auto-calculated minimal width in which the contents fit.
	* `verticalPadding` (`number`, optional, default `2`): Extra vertical padding (in *"excel points"*) for every cell. This amount will be added to the auto-calculated minimal height in which the contents fit.

#### destinationPath

Type: `string`

The path (absolute, or relative to `process.cwd()`) in which the new xlsx file should be created. In windows, both `/` and `\` are accepted as path separators.

#### options

Type: `object`

##### overwrite

Type: `boolean`
Default: `false`

Whether or not to overwrite the destination file if it already exists.


## Tip: usage with `object[]` instead of `string[][]`

If, instead of directly tabular data, you have a list of objects such as...

```js
const data = [
	{ name: 'Grape', size: 'small' },
	{ name: 'Watermelon', size: 'big' },
	{ name: 'Apple', size: 'medium' }
];
```

...you can use `jsonToExcel` by simply converting that to a `string[][]` first, with a simple loop. Example:

```js
const headers = ['Name', 'Size'];
const dataAs2DArray = data.map(fruit => [fruit.name, fruit.size]);

jsonToExcel([{
	sheetName: 'Fruits',
	data: [
		headers,
		...dataAs2DArray
	],
	formatAsTable: true
}], 'fruits.xlsx');
```


## License

MIT © [Pedro Augusto de Paula Barbosa](https://github.com/papb)
