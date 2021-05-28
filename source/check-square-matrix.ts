function indexToEnglishOrdinal(index: number): string {
	return ['first', 'second', 'third'][index] ?? `${index + 1}th`;
}

export function assertNonemptyStringSquareMatrix(arg: any): asserts arg is string[][] {
	if (!Array.isArray(arg)) {
		throw new TypeError(`Expected string[][], got ${typeof arg}`);
	}

	if (arg.length === 0) {
		throw new TypeError('Expected nonempty string[][], got empty array');
	}

	for (const x of arg) {
		if (!Array.isArray(x)) {
			throw new TypeError(`Expected each row to be string[], got ${typeof x}`);
		}

		for (const y of x) {
			if (typeof y !== 'string') {
				throw new TypeError(`Expected each cell to be string, got ${typeof y}`);
			}
		}
	}

	const typedArg = arg as string[][];

	const columnCount = typedArg[0].length;

	for (let i = 1; i < typedArg.length; i++) {
		if (typedArg[i].length !== columnCount) {
			throw new TypeError(`Expected every row to have the same amount of columns (${columnCount}}, but got ${typedArg[i].length} for the ${indexToEnglishOrdinal(i)} row`);
		}
	}
}
