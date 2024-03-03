import { parseCliArgs } from '../../utils/cli_args/parser.ts';
import { assert } from 'https://deno.land/std@0.162.0/_util/assert.ts';
import { TCommandArgs } from '../command/command.d.ts';
import { classCommand } from '../command/command.ts';
import { classCommandsRepository } from './command_repository.ts';

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
	const commandRepo = new classCommandsRepository();

	assert(commandRepo.add(command) === undefined, 'Add command to repository');
	assert(commandRepo.add(command) === undefined, 'Try to add duplicated command to repository');
	assert(commandRepo.has(command) === true, 'Command repo has command');
	assert(commandRepo.get(testCommandPhrase) === command, 'Get command from repo');
});
