import { logger } from '../../global/logger.ts';

export default class classDependencyChecker {
	public static commandsToCheck: Parameters<typeof this.getFeed>[0] = [
		{ cmd: 'unzip', args: ['-v'] },
		{ cmd: 'docker', args: ['-v'] },
		{ cmd: 'docker', args: ['compose', 'version'], name: 'docker compose' },
	];

	/**
	 * The `getFeed` function checks if the commands "docker" and "docker compose" exist and returns a
	 * feed object with a general flag indicating if all commands exist.
	 * @returns The function `getFeed()` returns an object `feed` which contains a `general` property and
	 * a `commands` property. The `general` property is a boolean value indicating whether all the
	 * commands in the `commands` property exist. The `commands` property is an object containing
	 * information about specific commands. Each command has a `check` property which is a boolean value
	 * indicating whether the command exists
	 */
	static getFeed(extraCommands?: { cmd: string; args: string[]; name?: string }[]) {
		const feed = {
			general: true,
			commands: {} as { [key: string]: { check: boolean; name: string } },
		};

		[...(extraCommands || []), ...(this.commandsToCheck || [])].forEach((item) => {
			feed.commands[item?.cmd] = {
				check: this.commandExist(item.cmd, item.args),
				name: item?.name || item.cmd,
			};
		});

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
	static check(extraCommands?: Parameters<typeof this.getFeed>[0]) {
		const feed = this.getFeed(extraCommands);

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
