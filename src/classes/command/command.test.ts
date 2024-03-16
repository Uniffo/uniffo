import { classCommand } from './command.ts';
import { TCommandArgs } from './command.d.ts';
import { parseCliArgs } from '../../utils/parser/parser.ts';
import { assert } from 'https://deno.land/std@0.162.0/_util/assert.ts';

Deno.test('classCommand', function testClassCommand() {
	class myCommand extends classCommand {
		constructor(args: TCommandArgs) {
			super(args);
		}
		public exec() {}
	}

	const args = parseCliArgs();
	const testCommandPhrase = 'My test command phrase';
	const command = new myCommand({ commandArgs: { ...args, commandPhrase: testCommandPhrase } });

	assert(command instanceof classCommand === true, 'Command is instanceof classCommand');
	assert(command.getPhrase() === testCommandPhrase, 'Command phrase');
});
