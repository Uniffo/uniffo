import { classLogger } from '../classes/logger/logger.ts';
import { CLI_ARGS } from '../constants/constants.ts';

export const logger = new classLogger({
	displayDebug: 'debug' in CLI_ARGS,
	displayDate: 'debug' in CLI_ARGS,
});
