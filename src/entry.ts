import { parseCliArgs } from './utils/cli_args/parse_cli_args.ts';
import { createAppLogger } from './utils/logger/logger.ts';

export const logger = createAppLogger();

logger.info(JSON.stringify(Deno.args));

const args = parseCliArgs(Deno.args);

logger.info(`args: ${JSON.stringify(args)}`);
