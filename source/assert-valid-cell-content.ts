export function assertValidCellContent(string: string): void {
	// https://support.microsoft.com/en-ie/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3

	const MAX_CHARS = 32767;
	const MAX_LINEFEEDS = 253;

	if (string.length > MAX_CHARS) {
		throw new TypeError(`Expected at most ${MAX_CHARS} characters, got ${string.length}`);
	}

	const amountOfLinefeeds = string.split('\n').length - 1;

	if (amountOfLinefeeds > MAX_LINEFEEDS) {
		throw new TypeError(`Expected at most ${MAX_LINEFEEDS} linefeeds (\`\\n\`), got ${amountOfLinefeeds}`);
	}
}
