import { createAppState } from '../../utils/appState/appState.ts';
import { createAppLogger } from '../../utils/logger/logger.ts';

export const appState = createAppState();
export const logger = createAppLogger();

export const uniffo = () => {
	logger.debug('Hello, I am uniffo :)');
};
