function assertValidSheetName(name: string): void {
	if (name === '') {
		throw new TypeError('Sheet name cannot be empty.');
	}

	if (name.length > 31) {
		throw new TypeError('Sheet name cannot exceed 31 characters.');
	}

	if (/[':\\/?*[\]]/.test(name)) {
		throw new TypeError('Sheet name cannot include any of the following characters: []\':\\/?*');
	}
}

export function assertValidSheetNames(names: string[]): void {
	for (const name of names) {
		assertValidSheetName(name);
	}

	if (names.length !== [...new Set(names.map(name => name.toLowerCase()))].length) {
		throw new TypeError('Two sheets cannot have the same name (case-insensitive).');
	}
}
