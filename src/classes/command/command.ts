import { parseCliArgs } from '../../utils/cli_args/parser.ts';

export abstract class classCommand {
	public args;

	constructor(args: { commandArgs: ReturnType<typeof parseCliArgs> }) {
		this.args = args.commandArgs;
	}

	public getPhrase() {
		return this.args.commandPhrase;
	}

	abstract exec(): Promise<void>;
}
