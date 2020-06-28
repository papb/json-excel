export function assertDimensionsAcceptable(rows: number, columns: number): void {
	// https://support.microsoft.com/en-ie/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3

	const MAX_ROWS = 1048576;
	const MAX_COLUMNS = 16384;

	if (rows > MAX_ROWS) {
		throw new TypeError(`Expected at most ${MAX_ROWS} rows, got ${rows}`);
	}

	if (columns > MAX_COLUMNS) {
		throw new TypeError(`Expected at most ${MAX_COLUMNS} columns, got ${columns}`);
	}
}
