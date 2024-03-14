import { TCommandArgs } from '../../classes/command/command.d.ts';
import { classCommand } from '../../classes/command/command.ts';

const phrase = 'init';
class classCommandInit extends classCommand {
	constructor(args: TCommandArgs) {
		super(args);
	}
	public exec() {}
}

export default {
	phrase,
	class: classCommandInit,
};
