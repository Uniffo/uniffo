import { logger } from '../../services/logger.ts';
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

			if (this.uniffoVersionManager.shouldDispatchCmd()) {
				logger.debug(`Will dispatch uniffo command.`);

				const dispatchTarget = await this.getDispatchTarget();

				await this.ensureUniffoPermissions(dispatchTarget);
				await this.dispatchCommand(dispatchTarget, args);
			} else {
				// TODO(#2): execute command
			}

			await this.session.destroy();
		} catch (error) {
			await this.session.destroy();
			throw error;
		}
	}

	/**
	 * The function `ensureUniffoPermissions` checks if a file at a given path has execute permissions and
	 * upgrades the permissions if necessary.
	 * @param {string} path - The `path` parameter is a string that represents the file path of the
	 * dispatch target.
	 */
	private async ensureUniffoPermissions(path: string) {
		const dispatchTargetMode = (await Deno.stat(path)).mode;
		const executePermission = 0o111;

		if (dispatchTargetMode !== null && !(dispatchTargetMode & executePermission)) {
			logger.debug(
				`Dispatch target is not executable! Upgrading permissions.`,
			);

			Deno.chmod(path, dispatchTargetMode | executePermission);
		}
	}

	/**
	 * The function dispatches a command with the given path and arguments and waits for the process to
	 * complete.
	 * @param {string} path - A string representing the path to the command or executable file that you
	 * want to run.
	 * @param args - The `args` parameter is an array of strings representing the command line arguments
	 * to be passed to the command being executed.
	 */
	private async dispatchCommand(path: string, args: typeof Deno.args) {
		logger.debug(`Dispatch "${path} ${args.join(' ')}"`);

		const command = new Deno.Command(path, {
			args,
		});

		const process = command.spawn();

		await process.status;
	}

	/**
	 * The function `getDispatchTarget` retrieves the dispatch target from the `uniffoVersionManager` and
	 * checks if it exists, throwing an error if it doesn't.
	 * @returns the value of the variable `dispatchTarget`.
	 */
	private async getDispatchTarget() {
		const dispatchTarget = this.uniffoVersionManager.getDispatchTarget();
		logger.debug(`Var dispatchTarget: ${dispatchTarget}`);

		if (!await pathExist(dispatchTarget)) {
			throw `Uniffo dispatch target doesn't exist "${dispatchTarget}"!`;
		}

		return dispatchTarget;
	}
}
