import { COMMANDS } from '../../constants/commands.ts';

/**
 * The `parseCliArgs` function parses command-line arguments in Deno and categorizes them into boolean
 * flags, key-value pairs, and regular arguments.
 * @param denoArgs - The `denoArgs` parameter is of type `typeof Deno.args`, which represents the
 * command-line arguments passed to a Deno script.
 * @returns The function `parseCliArgs` returns an object with the following properties:
 */
export const parseCliArgs = (denoArgs = Deno.args) => {
	const parsed = {
		command: '',
		boolean: [] as string[],
		keyValue: [] as [string, string][],
		args: [] as string[],
		hasBoolean: (search: string[], condition: 'OR' | 'AND' = 'AND') => {
			let result = false;
			const foundedBools = [] as string[];

			search.forEach((bool) => {
				if (!parsed.boolean.includes(bool)) {
					return;
				}

				foundedBools.push(bool);
			});

			for (let i = 0; i < search.length; i++) {
				if (condition === 'AND') {
					if (!foundedBools.includes(search[i])) {
						result = false;
						break;
					} else if (result === false) {
						result = true;
						continue;
					}
				} else if (
					condition === 'OR' && result === false && foundedBools.includes(search[i])
				) {
					result = true;
					break;
				}
			}

			return result;
		},
		getKV: (searchKey: string[] | '*' = '*') => {
			if (searchKey === '*') {
				return [...parsed.keyValue];
			}

			const result = parsed.keyValue.filter((row) => searchKey.includes(row[0]));

			return result;
		},
	};

	denoArgs.forEach((value) => {
		const isBoolean = /^(--|-)([A-z0-9-]+)/.test(value) && !/=+/.test(value);
		const isKeyValue = /^(--|-)([A-z0-9-]+)(=.*)/.test(value);

		if (isBoolean) {
			const bool = value.replace(/^(--|-)/, '');

			if (!parsed.boolean.includes(bool)) {
				parsed.boolean.push(bool);
			}
		} else if (isKeyValue) {
			const kv = [
				value.slice(0, value.indexOf('=')).replace(/^(--|-)/, ''),
				value.slice(value.indexOf('=') + 1),
			] as [string, string];

			parsed.keyValue.push(kv);
		} else {
			parsed.args.push(value);
		}
	});

	Object.keys(COMMANDS).forEach((k) => {
		const cmd = (COMMANDS as { [k: string]: string })[k];
		const argCmd = [] as string[];
		parsed.args.forEach((arg) => {
			argCmd.push(arg);

			if (
				cmd.startsWith(argCmd.join(' ')) &&
				argCmd.length >= parsed.command.split(' ').length
			) {
				parsed.command = argCmd.join(' ');
			}
		});
	});

	parsed.args = parsed.args.filter((v, i) => v !== parsed.command.split(' ')[i]);

	return { ...parsed };
};
