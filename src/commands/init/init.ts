import { TCommandArgs, TCommandMeta } from '../../classes/command/command.d.ts';
import { classCommand } from '../../classes/command/command.ts';
import { logger } from '../../global/logger.ts';
import { cwd } from '../../utils/cwd/cwd.ts';

const phrase = 'init';
class classCommandInit extends classCommand {
	constructor(args: TCommandArgs) {
		logger.debug();

		super(args);
	}
	public exec() {
		logger.debug();
	}
}

const meta: TCommandMeta = {
	phrase,
	class: classCommandInit,
};

export default meta;
