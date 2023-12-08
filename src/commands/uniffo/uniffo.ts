import { logger } from '../../services/logger.ts';
import { IUniffoArgs } from './uniffo.d.ts';

export const uniffo = (args: IUniffoArgs) => {
	logger.debug(`Var args: ${JSON.stringify(args)}`);
	logger.log('Hello, I am uniffo :)');
};
