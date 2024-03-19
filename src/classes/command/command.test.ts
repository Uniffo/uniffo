import { classCommand } from './command.ts';
import { TCommandArgs } from './command.d.ts';
import { parseCliArgs } from '../../utils/parser/parser.ts';
import { assert } from 'https://deno.land/std@0.162.0/_util/assert.ts';
import { noError } from '../../utils/no_error/no_error.ts';

Deno.test('classCommand', async function testClassCommand() {
	class myCommand extends classCommand {
		constructor(args: TCommandArgs) {
			super(args);
		}
		public exec() {}
	}

	const args = parseCliArgs();
	const testCommandPhrase = 'My test command phrase';
	const testCommandDocs = 'My test command documentation';
	const command = new myCommand({
		commandArgs: { ...args, commandPhrase: testCommandPhrase },
		documentation: testCommandDocs,
	});

	assert(command instanceof classCommand === true, 'Command is instanceof classCommand');
	assert(command.getPhrase() === testCommandPhrase, 'Command phrase');
	assert(command.getDocs() === testCommandDocs, 'Command docs');
	assert(await noError(() => command.displayDocumentation()), 'Command display docs');
	assert(await noError(() => command._exec()), 'Command display docs');
});
