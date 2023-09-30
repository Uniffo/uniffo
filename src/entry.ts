import { uniffo } from './commands/uniffo/uniffo.ts';
import { CLI_ARGS } from './constants/constants.ts';
import { logger } from './services/logger.ts';
import { session } from './services/session.ts';
import { uvm } from './services/uvm.ts';
import { pathExist } from './utils/path/exist.ts';

await (async function cliEntry() {
	logger.debug(`Var cliArgs: ${JSON.stringify(CLI_ARGS)}`);

	try {
		await session.init();

		await uvm.init();

		if (uvm.shouldDispatchCmd()) {
			logger.debug(`Will dispatch uniffo command.`);

			const dispatchTarget = uvm.getDispatchTarget();
			logger.debug(`Var dispatchTarget: ${dispatchTarget}`);

			if (!await pathExist(dispatchTarget)) {
				throw `Uniffo dispatch target doesn't exist "${dispatchTarget}"!`;
			}

			const command = new Deno.Command(dispatchTarget, { args: Deno.args });

			return command.spawn();
		}

		uniffo(CLI_ARGS);
	} catch (error) {
		logger.error(`${error}`);
	}

	await session.destroy();
})();
