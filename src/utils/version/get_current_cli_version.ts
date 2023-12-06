import { PRECOMPILED_DIR } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';
import { pathExist } from '../path/exist.ts';

/**
 * The function `getCurrentCliVersion` is an asynchronous function that retrieves the current CLI
 * version by importing a module and returning the version string.
 * @returns the current CLI version as a string.
 */
export const getCurrentCliVersion = async () => {
	const cliVersionModuleFilename = `${PRECOMPILED_DIR}/__cli_version.ts`;
	logger.debug(`Var cliVersionModuleFilename: "${cliVersionModuleFilename}"`);

	if (await pathExist(cliVersionModuleFilename)) {
		const module = await import('../../pre_compiled/__cli_version.ts');
		const version = module.default as string;
		logger.debug(`Var version: "${version}"`);

		return version;
	}

	throw 'Not found current cli version!';
};

export default 'test';
