import { createAppLogger } from './utils/logger/logger.ts';
import { parseCliArgs } from './utils/parseCliArgs/parseCliArgs.ts';

export const logger = createAppLogger();

logger.info(JSON.stringify(Deno.args));

const args = parseCliArgs(Deno.args);

logger.info(`args: ${JSON.stringify(args)}`);
