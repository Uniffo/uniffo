import { TCommandArgs, TCommandMeta } from '../../classes/command/command.d.ts';
import { classCommand } from '../../classes/command/command.ts';
import { commandDefaultDocs } from './index.docs.ts';

const phrase = '';
class classCommandDefault extends classCommand {
	constructor(args: TCommandArgs) {
		super(args);
	}
	public exec() {
		this.displayDocumentation();
	}
}

const meta: TCommandMeta = {
	phrase,
	documentation: commandDefaultDocs,
	class: classCommandDefault,
};

export default meta;
