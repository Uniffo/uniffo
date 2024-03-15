import { TCommandMeta } from '../command/command.d.ts';
import { classCommand } from '../command/command.ts';

export class classCommandsRepository {
	private commands: TCommandMeta[] = [];

	public add(commandMeta: TCommandMeta) {
		if (this.has(commandMeta.phrase)) {
			return;
		}

		this.commands.push(commandMeta);
	}

	public get(phrase: string) {
		const found = this.commands.find((record) => record.phrase === phrase)?.class;

		return found;
	}

	public has(commandPhrase: TCommandMeta['phrase']) {
		const found = this.get(commandPhrase);

		return found?.prototype instanceof classCommand;
	}
}
