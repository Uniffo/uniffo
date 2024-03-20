import { TCommandArgs } from './command.d.ts';
import { logger } from '../../global/logger.ts';
import { getCurrentCliVersion } from '../../utils/get_current_cli_version/get_current_cli_version.ts';
import { emojify } from '../../utils/emojify/emojify.ts';
import { random } from 'https://cdn.skypack.dev/lodash-es@4.17.21';

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

	public getCliBrandEmoji() {
		return emojify(':duck:');
	}

	public getIntroForDocumentation() {
		logger.debug();

		let intro = `${this.getRandomMessageFrom(this.geDocumentationPhrases())}\n`;
		intro += '					 \n';
		intro += `WPDucker version ${getCurrentCliVersion()}\n\n`;
		intro += `Documentation:\n`;

		return intro;
	}

	public getStartPhrases() {
		return [
			"Alright, let's begin.",
			"Okay, let's kick things off.",
			"Sure, let's get started.",
			"Alrighty, let's dive in.",
			"Okay, let's commence.",
			"Sure thing, let's initiate.",
			"Alright, let's launch into it.",
			"Okay, let's embark on this journey.",
			"Sure, let's fire up the engines.",
			"Alright, let's initiate the process.",
			"Okay, let's roll up our sleeves and start.",
			"Sure, let's set things in motion.",
			"Alright, let's open the door to progress.",
			"Okay, let's inaugurate this endeavor.",
			"Sure, let's take the first step forward.",
			"Alright, let's inaugurate the proceedings.",
			"Okay, let's break the ice and begin.",
			"Sure, let's kickstart our efforts.",
			"Alright, let's ignite the spark of action.",
			"Okay, let's lay the groundwork and commence.",
		];
	}

	public getRandomMessageFrom(feed: string[]) {
		return `${this.getCliBrandEmoji()} ${feed[random(0, feed.length - 1)]}`;
	}

	public displayRandomStartPhrase() {
		logger.log(this.getRandomMessageFrom(this.getStartPhrases()));
	}

	public geDocumentationPhrases() {
		return [
			"Here's my documentation:",
			'Presenting my documentation:',
			'Behold, my documentation:',
			'Witness my documentation:',
			'Take a look at my documentation:',
			'Herein lies my documentation:',
			'Offering up my documentation:',
			'Revealing my documentation:',
			'Unveiling my documentation:',
			'Sharing my documentation:',
			'Displaying my documentation:',
			'Introducing my documentation:',
			'Providing my documentation:',
			'Exposing my documentation:',
			'Handing over my documentation:',
			'Putting forth my documentation:',
			'Delving into my documentation:',
			'Granting access to my documentation:',
			'Disclosing my documentation:',
			'Offering my documentation for review:',
		];
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

		this.displayRandomStartPhrase();
		await this.exec();
	}

	abstract exec(): Promise<void> | void;
}
