import { parseCliArgs } from '../../utils/cli_args/parser.ts';

export type TCommandArgs = { commandArgs: ReturnType<typeof parseCliArgs> }