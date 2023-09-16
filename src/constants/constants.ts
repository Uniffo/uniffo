import { parseCliArgs } from '../utils/cli_args/parser.ts';
import { Logger } from '../utils/logger/logger.ts';

export const CLI_ARGS = parseCliArgs(Deno.args);
export const LOGGER = new Logger({
	debug: 'debug' in CLI_ARGS,
	displayDate: 'debug' in CLI_ARGS,
});
export const UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE = ['uniffo', 'data', 'source', '.uvm'];
