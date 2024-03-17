import { TCommandArgs } from './command.d.ts';
import { logger } from '../../global/logger.ts';
import { getCurrentCliVersion } from '../../utils/get_current_cli_version/get_current_cli_version.ts';

export abstract class classCommand {
	public args;
	public documentation;

	constructor(args: TCommandArgs) {
		this.args = args.commandArgs;
		this.documentation = args.documentation;
	}

	public getPhrase() {
		return this.args.commandPhrase;
	}

	public getDocs() {
		return this.documentation;
	}

	public displayDocumentation() {
		logger.log(`${this.getIntroForDocumentation()}\n${this.getDocs() || '<empty>'}`);
	}

	public getIntroForDocumentation() {
		let intro = '\n';
		intro += ' _ _ _ _____ ____  \n';
		intro += '| | | |  _  |    \\ \n';
		intro += '| | | |   __|  |  |\n';
		intro += '|_____|__|  |____/ \n';
		intro += '					 \n';
		intro += `WPDucker version ${getCurrentCliVersion()}\n\n`;
		intro += `Documentation:\n`;

		return intro;
	}

	abstract exec(): Promise<void> | void;
}
