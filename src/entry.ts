import { uniffo } from './commands/uniffo/uniffo.ts';
import { CLI_ARGS } from './constants/constants.ts';
import { logger } from './services/logger.ts';
import { store } from './services/store.ts';
import { uvm } from './services/uvm.ts';
import { pwd } from './utils/workdir/pwd.ts';

await (async function cliEntry() {
	logger.debug(`Var cliArgs: ${JSON.stringify(CLI_ARGS)}`);

	await uvm.init();

	const projectWorkingDir = await pwd();
	const isProjectInitialized = !!projectWorkingDir;

	if (isProjectInitialized) {
		// TODO(#2): uvm
	}

	uniffo(CLI_ARGS);

	store.deleteSession();
})();
