import { parseCliArgs } from './utils/cli_args/parser.ts';
import { Logger } from './utils/logger/logger.ts';
import { pwd } from './utils/workdir/pwd.ts';
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';

const args = parseCliArgs(Deno.args);
const debugMode = !!Deno.env.get('DEBUG') || 'debug' in args;

export const logger = new Logger({
	debug: debugMode,
	displayDate: debugMode,
});

const projectWorkingDir = await pwd();
const isProjectInitialized = projectWorkingDir;

logger.debug(`args: ${JSON.stringify(args)}`);
