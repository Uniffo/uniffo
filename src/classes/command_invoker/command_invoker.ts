import { isArray } from 'https://cdn.skypack.dev/lodash-es@4.17.21';
import { logger } from '../../global/logger.ts';
import { ensureExecutePermissions } from '../../utils/path/ensure_execute_permissions.ts';
import { pathExist } from '../../utils/path_exist/path_exist.ts';
import { classCommand } from '../command/command.ts';
import classDependencyChecker from '../dependency_checker/dependency_checker.ts';
import { lodash as _ } from 'https://deno.land/x/deno_ts_lodash@0.0.1/mod.ts';

export class classCommandInvoker {
	public outsourceTarget?: string[];
	public checkDependencies = true;

	constructor() {
	}

	public setOutsourceTarget(target: string | string[]) {
		this.outsourceTarget = isArray(target) ? target : (target ? [target] : undefined);
		logger.debug('Var outsourceTarget', this.outsourceTarget);
	}

	public setCheckDependencies(bool: boolean) {
		this.checkDependencies = bool;
	}

	public async exec(command: classCommand) {
		logger.debug(`Var command:`, command);

		try {
			const executionCallback = this.getCommandExecutionCallback();

			if (!_.isFunction(executionCallback)) {
				throw 'Command execution callback is not a function!';
			}

			await executionCallback.apply(this, [command]);
		} catch (error) {
			throw error;
		}
	}

	public getCommandExecutionCallback() {
		switch (!!this.outsourceTarget?.length) {
			case true:
				return this.outsourceCommand;

			case false:
				return this.dispatchCommand;

			default:
				break;
		}
	}

	public async outsourceCommand(command: classCommand) {
		logger.debug(`Will execute command!`, command);

		if (!this.outsourceTarget) {
			throw `Invalid outsource target! "${JSON.stringify(this.outsourceTarget)}"`;
		}

		let path;

		for (let i = 0; i < this.outsourceTarget?.length; i++) {
			if (!await pathExist(this.outsourceTarget[i])) {
				continue;
			}

			path = this.outsourceTarget[i];
			break;
		}

		logger.debug(`Outsource path: "${path}"`);

		if (!path) {
			throw `Invalid outsource path: "${path}"`;
		}

		ensureExecutePermissions(path);

		const outsourceCommand = new Deno.Command(path, {
			args: command.args.primitive,
		});

		const process = outsourceCommand.spawn();

		await process.status;
	}

	public async dispatchCommand(command: classCommand) {
		logger.debug(`Will execute command!`, command);

		if (this.checkDependencies) {
			classDependencyChecker.check();
		}

		await command.exec();
	}
}
