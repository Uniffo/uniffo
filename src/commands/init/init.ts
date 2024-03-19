import { TCommandArgs, TCommandMeta } from '../../classes/command/command.d.ts';
import { classCommand } from '../../classes/command/command.ts';
import { logger } from '../../global/logger.ts';
import { emojify } from '../../utils/emojify/emojify.ts';

const phrase = 'init';
class classCommandInit extends classCommand {
	constructor(args: TCommandArgs) {
		logger.debug();

		super(args);
	}
	public exec() {
		logger.debug();

		logger.log(emojify("Let's start a new story :smiling_cat_with_heart_eyes:!"));
	}
}

const meta: TCommandMeta = {
	phrase,
	class: classCommandInit,
};

export default meta;
