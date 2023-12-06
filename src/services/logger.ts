import { classLogger } from '../classes/logger/logger.ts';
import { parseCliArgs } from '../utils/cli_args/parser.ts';

const _CLI_ARGS = parseCliArgs(Deno.args);

/* The code is creating a new instance of the `classLogger` class and assigning it to the `logger`
constant. The `classLogger` constructor takes an object as an argument with two properties:
`displayDebug` and `displayDate`. */
export const logger = new classLogger({
	displayDebug: 'debug' in _CLI_ARGS,
	displayDate: 'debug' in _CLI_ARGS,
});
