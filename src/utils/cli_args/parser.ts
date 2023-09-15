import { ICliArgs, TParseCliArgs } from './parser.d.ts';

/**
 * The function `parseCliArgs` is a TypeScript function that takes an array of command-line arguments
 * and parses them into an object where the argument names are the keys and the argument values are the
 * values.
 * @param denoArgs - An array of strings representing the command-line arguments passed to the Deno
 * script.
 * @returns The function `parseCliArgs` returns an object of type `ICliArgs`, which represents the
 * parsed command-line arguments.
 */
export const parseCliArgs: TParseCliArgs = (denoArgs) => {
	const parsed: ICliArgs = {};

	let previousArgumentName = '';

	denoArgs.forEach((value) => {
		const isShortArgument = /^-(?!-).*/.test(value);
		const isLongArgument = /^--(?!-).*/.test(value);
		const isValueOfArgument = /^(?!-).*/.test(value);

		if (isShortArgument || isLongArgument) {
			const argument = value.substring(isShortArgument ? 1 : 2);

			previousArgumentName = argument;

			parsed[argument] = '';
		} else if (isValueOfArgument && previousArgumentName.length) {
			parsed[previousArgumentName] = value;
		}
	});

	return parsed;
};
