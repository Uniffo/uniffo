import { ICliArgs, TParseCliArgs } from './parseCliArgs.d.ts';

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
