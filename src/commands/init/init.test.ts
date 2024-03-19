import { parseCliArgs } from '../../utils/parser/parser.ts';
import { assert } from 'https://deno.land/std@0.162.0/_util/assert.ts';
import { noError } from '../../utils/no_error/no_error.ts';
import { COMMANDS_META } from '../../pre_compiled/__commands_meta.ts';
import _commandMeta from './init.ts';

Deno.test('commandInit', async function testCommandInit(t) {
	const commandMeta = COMMANDS_META.find((item) => item.phrase === _commandMeta.phrase);

	if (!commandMeta) {
		throw `Can not find command by phrase "${_commandMeta.phrase}"!`;
	}

	await t.step('Display help', async function testCommandInitHelp() {
		const args: string[] = [_commandMeta.phrase, '-h', '--help', '--debug'];
		const command = new commandMeta.class(
			{
				commandArgs: parseCliArgs(args),
				documentation: commandMeta.documentation,
			},
		);

		assert(await noError(async () => await command._exec()), 'Check command execution');
	});

	await t.step('execution', async function testCommandInitHelp() {
		const args: string[] = [_commandMeta.phrase, '--debug'];
		const command = new commandMeta.class(
			{
				commandArgs: parseCliArgs(args),
				documentation: commandMeta.documentation,
			},
		);
		assert(await noError(async () => await command._exec()), 'Check command execution');
	});
});
