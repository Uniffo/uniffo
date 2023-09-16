import { LOGGER } from '../../constants/constants.ts';
import { IUniffoArgs } from './uniffo.d.ts';

export const uniffo = (args: IUniffoArgs) => {
	LOGGER.debug(`Var args: ${JSON.stringify(args)}`);
	LOGGER.info('Hello, I am uniffo :)');
};
