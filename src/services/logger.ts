import { classLogger } from '../classes/logger/logger.ts';
import { CLI_ARGS } from '../constants/constants.ts';

/* The code is creating a new instance of the `classLogger` class and assigning it to the `logger`
constant. The `classLogger` constructor takes an object as an argument with two properties:
`displayDebug` and `displayDate`. */
export const logger = new classLogger({
	displayDebug: 'debug' in CLI_ARGS,
	displayDate: 'debug' in CLI_ARGS,
});
