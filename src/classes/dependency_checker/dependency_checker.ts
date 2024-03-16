import { logger } from '../../services/logger.ts';

export default class classDependencyChecker {
	/**
	 * The `getFeed` function checks if the commands "docker" and "docker compose" exist and returns a
	 * feed object with a general flag indicating if all commands exist.
	 * @returns The function `getFeed()` returns an object `feed` which contains a `general` property and
	 * a `commands` property. The `general` property is a boolean value indicating whether all the
	 * commands in the `commands` property exist. The `commands` property is an object containing
	 * information about specific commands. Each command has a `check` property which is a boolean value
	 * indicating whether the command exists
	 */
	static getFeed() {
		const feed = {
			general: true,
			commands: {
				unzip: {
					check: this.commandExist('unzip', ['-v']),
					name: 'unzip',
				},
				docker: {
					check: this.commandExist('docker', ['-v']),
					name: 'docker',
				},
				dockerComposer: {
					check: this.commandExist('docker', ['compose', 'version']),
					name: 'docker compose',
				},
			},
		};

		const commandsKeys = Object.keys(feed.commands) as Array<keyof typeof feed.commands>;

		for (let i = 0; i < commandsKeys.length; i++) {
			const cmdKey = commandsKeys[i];

			if (!feed.commands[cmdKey].check) {
				feed.general = false;
				break;
			}
		}

		return feed;
	}

	/**
	 * The `check` function checks if there are any missing dependencies in the `feed` object and throws
	 * an error if there are any.
	 * @returns If the condition `if (feed.general)` is true, then nothing is returned. Otherwise, an
	 * error is thrown with the message "Missing dependencies" followed by the names of the commands with
	 * missing dependencies joined by commas.
	 */
	static check() {
		const feed = this.getFeed();

		if (feed.general) {
			return;
		}

		const commandsKeys = Object.keys(feed.commands) as Array<keyof typeof feed.commands>;
		const missingDependencies = [] as Array<
			typeof feed.commands[keyof typeof feed.commands]['name']
		>;

		for (let i = 0; i < commandsKeys.length; i++) {
			const cmdKey = commandsKeys[i];
			const cmd = feed.commands[cmdKey];

			if (cmd.check) {
				continue;
			}

			missingDependencies.push(cmd.name);
		}

		throw `Missing dependencies "${missingDependencies.join('", "')}"!`;
	}

	/**
	 * The function checks if a given command exists in the current shell environment.
	 * @param {string} cmd - The `cmd` parameter is a string representing the command that you want to
	 * check for existence.
	 * @returns a boolean value. It returns `true` if the specified command exists, and `false` otherwise.
	 */
	private static commandExist(cmd: string, args: string[]) {
		logger.debug(`cmd: "${cmd}"`);
		logger.debug(`args: "${args.join('", "')}"`);

		let executionResult = '';

		try {
			executionResult = new TextDecoder().decode(
				(new Deno.Command(cmd, { args })).outputSync().stdout,
			);
		} catch ({ message }) {
			logger.debug(`execution result:`, message);
			return false;
		}

		logger.debug(`execution result:`, executionResult);

		if (!executionResult) {
			return false;
		}

		return true;
	}
}
