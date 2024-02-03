import { classCommand } from '../command/command.ts';

export class classCommandsRepository {
	private commands: [string, classCommand][] = [];

	public add(command: classCommand) {
		if (this.has(command)) {
			return;
		}

		this.commands.push([command.getPhrase(), command]);
	}

	public get(phrase: string) {
		const found = this.commands.find((record) => record[0] === phrase)?.[1];

		return found;
	}

	public has(command: classCommand) {
		const phrase = command.getPhrase();
		const found = this.get(phrase);

		return found instanceof classCommand;
	}
}
