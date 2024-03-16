import { TCommandArgs, TCommandMeta } from '../../classes/command/command.d.ts';
import { classCommand } from '../../classes/command/command.ts';
import { logger } from '../../global/logger.ts';

const phrase = '';
class classCommandDefault extends classCommand {
	constructor(args: TCommandArgs) {
		super(args);
	}
	public exec() {
		logger.log('My default fn');
	}
}

const meta: TCommandMeta = {
	phrase,
	class: classCommandDefault,
};

export default meta;
