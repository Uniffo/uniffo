import { TCommandArgs } from './command.d.ts';

export abstract class classCommand {
	public args;

	constructor(args: TCommandArgs) {
		this.args = args.commandArgs;
	}

	public getPhrase() {
		return this.args.commandPhrase;
	}

	abstract exec(): Promise<void> | void;
}
