import { CLI_PVFB } from '../../constants/index.ts';
import { pwd } from '../workdir/pwd.ts';

/**
 * The function `getCliVersionRequiredByProject` reads the contents of a file named `CLI_PVFB` in
 * the current working directory and returns its contents as a string.
 * @returns The function `getCliVersionRequiredByProject` returns the version number read from the file
 * specified by `projectUniffoVersionFilename`.
 */
export const getCliVersionRequiredByProject = async () => {
	const projectWorkDir = await pwd();

	if (!projectWorkDir) {
		return false;
	}

	const projectUniffoVersionFilename = `${projectWorkDir}/${CLI_PVFB}`;
	const version = await Deno.readTextFile(projectUniffoVersionFilename);

	return version;
};
