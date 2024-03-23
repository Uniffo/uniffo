import { version } from '../../classes/cli_version_manager/cli_version_manager.d.ts';
import { CLI_PVFB } from '../../constants/CLI_PVFB.ts';
import { pwd } from '../pwd/pwd.ts';

/**
 * The function `getCliVersionRequiredByProject` reads the contents of a file named `CLI_PVFB` in
 * the current working directory and returns its contents as a string.
 * @returns The function `getCliVersionRequiredByProject` returns the version number read from the file
 * specified by `projectWpdVersionFilename`.
 */
export const getCliVersionRequiredByProject = async () => {
	const projectWorkDir = await pwd();

	if (!projectWorkDir) {
		return false;
	}

	const projectWpdVersionFilename = `${projectWorkDir}/${CLI_PVFB}`;
	const version = await Deno.readTextFile(projectWpdVersionFilename);

	return version.trim() as version;
};
