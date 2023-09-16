import { uniffo } from './commands/uniffo/uniffo.ts';
import { CLI_ARGS, LOGGER } from './constants/constants.ts';
import { pwd } from './utils/workdir/pwd.ts';

await (async function cliEntry() {
	LOGGER.debug(`Var cliArgs: ${JSON.stringify(CLI_ARGS)}`);

	const projectWorkingDir = await pwd();

	const isProjectInitialized = !!projectWorkingDir;

	if (isProjectInitialized) {
		// TODO(#2): uvm
	}

	uniffo(CLI_ARGS);
})();
