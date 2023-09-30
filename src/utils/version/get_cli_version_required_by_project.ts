import { UNIFFO_PVFB } from '../../constants/constants.ts';
import { pathExist } from '../path/exist.ts';
import { pwd } from '../workdir/pwd.ts';

export const getCliVersionRequiredByProject = async () => {
	const projectWorkDir = await pwd();

	if (!projectWorkDir) {
		return false;
	}

	const projectUniffoVersionFilename = `${projectWorkDir}/${UNIFFO_PVFB}`;

	if (!await pathExist(projectUniffoVersionFilename)) {
		throw `Missing file "${projectUniffoVersionFilename}"!`;
	}

	const version = await Deno.readTextFile(projectUniffoVersionFilename);

	return version;
};
