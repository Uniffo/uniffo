import { COMMANDS } from '../../constants/commands.ts';
import { logger } from '../../services/logger.ts';
import { parseCliArgs } from '../../utils/cli_args/parser.ts';
import { ensureExecutePermissions } from '../../utils/path/ensureExecutePermissions.ts';
import { pathExist } from '../../utils/path/exist.ts';
import { version } from '../../utils/types/version.d.ts';
import { classSession } from '../session/session.ts';
import { classUvm } from '../uvm/uvm.ts';

export class classEngine {
	private uniffoVersionManager;
	private session;

	constructor(args: { uniffoVersionManager: classUvm; session: classSession }) {
		this.uniffoVersionManager = args.uniffoVersionManager;
		this.session = args.session;
	}

	/**
	 * The function `exec` is an asynchronous function that takes in arguments and a preferred Uniffo
	 * version, initializes a session, initializes the Uniffo version manager, and then either dispatches
	 * a Uniffo command or executes a command based on certain conditions.
	 * @param args - An array of command line arguments passed to the `exec` function.
	 * @param {version} [prefferedUniffoVersion] - The `prefferedUniffoVersion` parameter is an optional
	 * argument that specifies the preferred version of Uniffo to use. If provided, the `init` method of
	 * the `uniffoVersionManager` is called with this version to initialize the Uniffo version manager.
	 */
	public async exec(args: typeof Deno.args, prefferedUniffoVersion?: version) {
		logger.debug(`Args: "${JSON.stringify(args)}"`);

		try {
			await this.session.init();

			await this.uniffoVersionManager.init(prefferedUniffoVersion);

			if (this.uniffoVersionManager.shouldOutsourceCmd()) {
				logger.debug(`Will outsource uniffo command`);

				const dispatchTarget = await this.getOutsourceTarget();

				await this.outsourceCommand(dispatchTarget, args);
			} else {
				await this.dispatchCommand(args);
			}

			await this.session.destroy();
		} catch (error) {
			await this.session.destroy();
			throw error;
		}
	}

	/**
	 * The function `outsourceCommand` dispatches a command with the given path and arguments and waits
	 * for it to complete.
	 * @param {string} path - A string representing the path to the executable or script that you want to
	 * run.
	 * @param args - The `args` parameter is an array of strings representing the command line arguments
	 * to be passed to the command being executed.
	 */
	private async outsourceCommand(path: string, args: typeof Deno.args) {
		ensureExecutePermissions(path);

		logger.debug(`Outsource "${path} ${args.join(' ')}"`);

		const command = new Deno.Command(path, {
			args,
		});

		const process = command.spawn();

		await process.status;
	}

	/**
	 * The function `getOutsourceTarget` retrieves the dispatch target from the `uniffoVersionManager` and
	 * checks if it exists, throwing an error if it doesn't.
	 * @returns the value of the variable `dispatchTarget`.
	 */
	private async getOutsourceTarget() {
		const dispatchTarget = this.uniffoVersionManager.getDispatchTarget();
		logger.debug(`Var dispatchTarget: ${dispatchTarget}`);

		if (!await pathExist(dispatchTarget)) {
			throw `Uniffo dispatch target doesn't exist "${dispatchTarget}"!`;
		}

		return dispatchTarget;
	}

	private dispatchCommand(args: typeof Deno.args) {
		const parsedArgs = parseCliArgs(args);

		logger.debug(`Dispatch command: ${JSON.stringify(parsedArgs)}`);

		const commandsKeys = Object.keys(COMMANDS) as Array<keyof typeof COMMANDS>;

		for (let i = 0; i < commandsKeys.length; i++) {
			const command = COMMANDS[commandsKeys[i]];

			if (command.phrase === parsedArgs.commandPhrase) {
				return command.fn(parsedArgs);
			}
		}

		throw `Command not found: "${parsedArgs.commandPhrase}"!`;
	}
}
