import { logger } from '../../services/logger.ts';
import { ensureExecutePermissions } from '../../utils/path/ensureExecutePermissions.ts';
import { pathExist } from '../../utils/path/exist.ts';
import { classCommand } from '../command/command.ts';
import classDependencyChecker from '../dependency_checker/dependency_checker.ts';
import { lodash as _ } from 'https://deno.land/x/deno_ts_lodash@0.0.1/mod.ts';

export class classCommandInvoker {
	private outsourceTarget?: string;
	private checkDependencies = true;

	constructor() {
	}

	public setOutsourceTarget(target: string) {
		this.outsourceTarget = target;
	}

	public setCheckDependencies(bool: boolean) {
		this.checkDependencies = bool;
	}

	public async exec(command: classCommand) {
		logger.debug(`command: "${JSON.stringify(command)}"`);

		try {
			const executionCallback = this.getCommandExecutionCallback();

			if (!_.isFunction(executionCallback)) {
				throw 'Command execution callback is not a function!';
			}

			await executionCallback(command);
		} catch (error) {
			throw error;
		}
	}

	private getCommandExecutionCallback() {
		switch (!!this.outsourceTarget) {
			case true:
				return this.outsourceCommand;

			case false:
				return this.dispatchCommand;

			default:
				break;
		}
	}

	private async outsourceCommand(command: classCommand) {
		logger.debug(`Will outsource command!`);

		const path = this.outsourceTarget;
		logger.debug(`Outsource path: "${path}"`);

		if (!path || !await pathExist(path)) {
			throw `Invalid outsource path: "${path}"`;
		}

		ensureExecutePermissions(path);

		const outsourceCommand = new Deno.Command(path, {
			args: command.args.primitive,
		});

		const process = outsourceCommand.spawn();

		await process.status;
	}

	private async dispatchCommand(command: classCommand) {
		logger.debug(`Will execute command!`);

		if (this.checkDependencies) {
			classDependencyChecker.check();
		}

		await command.exec();
	}
}
