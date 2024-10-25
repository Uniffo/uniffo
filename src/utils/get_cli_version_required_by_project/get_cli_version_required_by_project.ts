// Copyright 2023-2024 Maciej Koralewski. All rights reserved. EULA license.

import { version } from '../../classes/cli_version_manager/cli_version_manager.d.ts';
import { CLI_PVFB } from '../../constants/CLI_PVFB.ts';
import { pwd } from '../pwd/pwd.ts';
import { logger } from '../../global/logger.ts';

/**
 * The function `getCliVersionRequiredByProject` reads the contents of a file named `CLI_PVFB` in
 * the current working directory and returns its contents as a string.
 * @returns The function `getCliVersionRequiredByProject` returns the version number read from the file
 * specified by `projectUniffoVersionFilename`.
 */
export async function getCliVersionRequiredByProject() {
	logger.debugFn(arguments);

	const projectWorkDir = await pwd();
	logger.debugVar('projectWorkDir', projectWorkDir);

	if (!projectWorkDir) {
		return false;
	}

	const projectUniffoVersionFilename = `${projectWorkDir}/${CLI_PVFB}`;
	logger.debugVar('projectUniffoVersionFilename', projectUniffoVersionFilename);

	const version = (await Deno.readTextFile(projectUniffoVersionFilename)).trim() as version;
	logger.debugVar('version', version);

	return version;
}
