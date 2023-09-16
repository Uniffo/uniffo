import { parseCliArgs } from '../utils/cli_args/parser.ts';
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';
import { Logger } from '../utils/logger/logger.ts';

export const CLI_ARGS = parseCliArgs(Deno.args);
export const LOGGER = new Logger({
	debug: !!Deno.env.get('DEBUG') || 'debug' in CLI_ARGS,
	displayDate: !!Deno.env.get('DEBUG') || 'debug' in CLI_ARGS,
});
export const UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE = ['uniffo', 'data', 'source', '.uvm'];
