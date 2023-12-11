import { logger } from '../../services/logger.ts';
import { cliVersion } from '../../pre_compiled/__cli_version.ts';

/**
 * The function `getCurrentCliVersion` is an asynchronous function that retrieves the current CLI
 * version by importing a module and returning the version string.
 * @returns the current CLI version as a string.
 */
export const getCurrentCliVersion = () => {
	const version = cliVersion;
	logger.debug(`Var version: "${version}"`);

	return version;
};
