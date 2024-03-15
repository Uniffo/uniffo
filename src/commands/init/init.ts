import { TCommandArgs, TCommandMeta } from '../../classes/command/command.d.ts';
import { classCommand } from '../../classes/command/command.ts';
import { logger } from '../../services/logger.ts';

const phrase = 'init';
class classCommandInit extends classCommand {
	constructor(args: TCommandArgs) {
		super(args);
	}
	public exec() {
		logger.log('My init fn');
	}
}

const meta: TCommandMeta = {
	phrase,
	class: classCommandInit,
};

export default meta;
