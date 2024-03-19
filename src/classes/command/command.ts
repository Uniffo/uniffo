import { TCommandArgs } from './command.d.ts';
import { logger } from '../../global/logger.ts';
import { getCurrentCliVersion } from '../../utils/get_current_cli_version/get_current_cli_version.ts';
import { emojify } from '../../utils/emojify/emojify.ts';

export abstract class classCommand {
	public args;
	public documentation;
	public stopExecution = false;

	constructor(args: TCommandArgs) {
		logger.debug();

		this.args = args.commandArgs;
		this.documentation = args.documentation;
	}

	public getPhrase() {
		logger.debug();

		return this.args.commandPhrase;
	}

	public getDocs() {
		logger.debug();

		return this.documentation;
	}

	public getDocumentationMessage() {
		logger.debug();

		return `${this.getIntroForDocumentation()}\n${this.getDocs() || '<empty>'}`;
	}

	public displayDocumentation() {
		logger.debug();

		logger.log(this.getDocumentationMessage());
	}

	public getIntroForDocumentation() {
		logger.debug();

		let intro = emojify(':duck: Here are my documents :books:\n');
		intro += ' _ _ _ _____ ____  \n';
		intro += '| | | |  _  |    \\ \n';
		intro += '| | | |   __|  |  |\n';
		intro += '|_____|__|  |____/ \n';
		intro += '					 \n';
		intro += `WPDucker version ${getCurrentCliVersion()}\n\n`;
		intro += `Documentation:\n`;

		return intro;
	}

	public preExec() {
		logger.debug();

		if (this.userNeedDocs()) {
			this.displayDocumentation();
			this.stopExecution = true;
			logger.debug('Var stopExecution:', this.stopExecution);
		}
	}

	public userNeedDocs() {
		logger.debug();

		const userNeedDocs = this.args.hasBoolean(['h', 'help'], 'OR');
		logger.debug('Var userNeedDocs:', userNeedDocs);

		return userNeedDocs;
	}

	public async _exec() {
		logger.debug();

		this.preExec();

		if (this.stopExecution) {
			return;
		}

		await this.exec();
	}

	abstract exec(): Promise<void> | void;
}
