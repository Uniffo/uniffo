import { parseCliArgs } from './utils/cli_args/parser.ts';
import { Logger } from './utils/logger/logger.ts';

export const logger = new Logger();

logger.info(JSON.stringify(Deno.args));

const args = parseCliArgs(Deno.args);

logger.info(`args: ${JSON.stringify(args)}`);
