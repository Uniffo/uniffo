import { parseCliArgs } from '../../utils/cli_args/parser.ts';
import { classCommand } from './command.ts';

export type TCommandArgs = { commandArgs: ReturnType<typeof parseCliArgs> };

export type TCommandMeta = {
	phrase: string;
	documentation?: string;
	class: new (args: TCommandArgs) => classCommand;
};
