import { parseCliArgs } from './utils/cli_args/parser.ts';
import { createAppLogger } from './utils/logger/logger.ts';

export const logger = createAppLogger();

logger.info(JSON.stringify(Deno.args));

const args = parseCliArgs(Deno.args);

logger.info(`args: ${JSON.stringify(args)}`);
