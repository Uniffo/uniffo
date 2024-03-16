import { logger } from '../../../services/logger.ts';
import { parseCliArgs } from '../../../utils/cli_args/parser.ts';
import { pathExist } from '../../../utils/path/exist.ts';
import { version } from '../../../utils/types/version.d.ts';
import { classCliVersionManager } from '../../cli_version_manager/cli_version_manager.ts';
import { TCommandMeta } from '../../command/command.d.ts';
import { classCommandInvoker } from '../../command_invoker/command_invoker.ts';
import { classCommandsRepository } from '../../command_repository/command_repository.ts';
import { classDatabase } from '../../database/database.ts';

/* The `classCommandInvokerFacade` class provides methods for initializing and destroying a session, creating and
removing temporary directories, and closing opened resources. */
export class classCommandInvokerFacade {
	public database;
	public commandInvoker;
	public cliVersionManager;
	private prefferedCliVersion?: version;
	private commandArguments;
	private commandsRepository;
	private checkDependenciesBeforeExecution = true;
	private tmpDir;

	constructor(
		args: {
			tmpDir: string;
			commandArguments: ReturnType<typeof parseCliArgs>;
			database: classDatabase;
			cliVersionManager: classCliVersionManager;
			commandsRepository: classCommandsRepository;
			commandInvoker: classCommandInvoker;
		},
	) {
		this.tmpDir = args.tmpDir;
		this.commandArguments = args.commandArguments;
		this.database = args.database;
		this.cliVersionManager = args.cliVersionManager;
		this.commandsRepository = args.commandsRepository;
		this.commandInvoker = args.commandInvoker;
	}

	public setPrefferedCliVersion(version?: version) {
		this.prefferedCliVersion = version;
	}

	public addCommand(commandMeta: TCommandMeta) {
		this.commandsRepository.add(commandMeta);
	}

	public setCheckDependenciesBeforeExecution(bool: boolean) {
		this.checkDependenciesBeforeExecution = bool;
	}

	/**
	 * The `init` function initializes a store and creates a temporary directory.
	 */
	async init() {
		await this.database.init('wpd');
		await this.mkTmpDir();
		await this.cliVersionManager.init(this.prefferedCliVersion);
	}

	/**
	 * The `destroy` function performs cleanup tasks such as removing temporary directories, destroying a
	 * session, and closing opened resources.
	 */
	async destroy() {
		await this.rmTmpDir();
		await this.database.destroySession();
	}

	/**
	 * The function `mkTmpDir` creates a temporary directory for the session if it doesn't already exist.
	 * @returns nothing.
	 */
	private async mkTmpDir() {
		if (!this.tmpDir) {
			throw `Invalid tmp directory "${this.tmpDir}"!`;
		}

		if (!await pathExist(this.tmpDir)) {
			await Deno.mkdir(this.tmpDir, { recursive: true });
		}

		if (await this.database.getSessionValue<string | undefined>('tmpDir') !== this.tmpDir) {
			await this.database.setSessionValue('tmpDir', this.tmpDir);
		}
	}

	/**
	 * The function `rmTmpDir` removes a temporary directory and logs the process.
	 * @returns nothing (undefined) if the `tmpDir` variable is falsy (null, undefined, false, 0, empty
	 * string, NaN). Otherwise, it is removing the session temporary directory using `Deno.remove()` and
	 * returning a promise.
	 */
	private async rmTmpDir() {
		await this.database.removeSessionKey('tmpDir');

		if (await pathExist(this.tmpDir)) {
			await Deno.remove(this.tmpDir, { recursive: true });
		}
	}

	public getCommandObject() {
		const commandClass = this.commandsRepository.get(this.commandArguments.commandPhrase);

		if (!commandClass) {
			throw `Command "${this.commandArguments.primitive.join(' ')}" not found!`;
		}

		const command = new commandClass({ commandArgs: this.commandArguments });

		return command;
	}

	public async exec() {
		logger.debug(`Var commandArguments:`, this.commandArguments);

		try {
			await this.init();

			this.commandInvoker.setCheckDependencies(true);
			this.commandInvoker.setOutsourceTarget(await this.getOutsourceTarget());
			this.commandInvoker.setCheckDependencies(this.checkDependenciesBeforeExecution);

			await this.commandInvoker.exec(this.getCommandObject());

			await this.destroy();
		} catch (error) {
			await this.destroy();
			logger.error(error);
		}
	}

	private async getOutsourceTarget() {
		const dispatchTarget = this.cliVersionManager.getDispatchTarget();
		logger.debug(`Var dispatchTarget: ${dispatchTarget}`);

		if (!!dispatchTarget && !await pathExist(dispatchTarget)) {
			throw `Uniffo dispatch target doesn't exist "${dispatchTarget}"!`;
		}

		return dispatchTarget;
	}
}
