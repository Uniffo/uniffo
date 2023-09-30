import { PRECOMPILED_DIR } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';
import { pathExist } from '../path/exist.ts';

/**
 * The function `getCurrentCliVersion` checks if a specific module exists and if so, imports it and
 * returns the default value as a string, otherwise it returns false.
 * @returns The function `getCurrentCliVersion` returns either the version string if it is found, or
 * `false` if the version is not found.
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

	logger.debug(`Version not found!`);
	return false;
};

export default 'test';
