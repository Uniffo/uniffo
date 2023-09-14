import { logger } from '../../entry.ts';
import { IUniffoArgs } from './uniffo.d.ts';

export const uniffo = (args: IUniffoArgs) => {
	logger.info(`args: ${JSON.stringify(args)}`);
	logger.debug('Hello, I am uniffo :)');
};
