export function getMax(numbers: number[]): number {
	// We do not use Math.max(...numbers) because JavaScript
	// functions have an argument limit of about 30k, we don't
	// want it to crash for large arrays

	let max = -Infinity;

	for (const number of numbers) {
		max = Math.max(max, number);
	}

	return max;
}

export function getSum(numbers: number[]): number {
	// eslint-disable-next-line unicorn/no-reduce
	return numbers.reduce((a, b) => a + b, 0);
}

export function clamp(value: number, min: number, max: number): number {
	return value < min ? min : (value > max ? max : value);
}
