import { IUniffoArgs } from '../../commands/uniffo/uniffo.d.ts';

interface ICliArgs extends IUniffoArgs {
	[key: string]: string | undefined;
}
export type TParseCliArgs = (denoArgs: string[]) => ICliArgs;
