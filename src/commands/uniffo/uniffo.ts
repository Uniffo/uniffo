import { LOGGER } from '../../constants/constants.ts';
import { IUniffoArgs } from './uniffo.d.ts';

export const uniffo = (args: IUniffoArgs) => {
	LOGGER.info(`args: ${JSON.stringify(args)}`);
	LOGGER.debug('Hello, I am uniffo :)');
};
