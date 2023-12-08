import { UNIFFO_PROJECT_STRUCTURE } from '../../constants/constants.ts';
import { pathExist } from '../path/exist.ts';
import { cwd } from './cwd.ts';

const iAmInTopLevelOfUniffoProject = async (path: string) => {
	const topLevelKeys = Object.keys(UNIFFO_PROJECT_STRUCTURE);
	for (let i = 0; i < topLevelKeys.length; i++) {
		const partOfPath = topLevelKeys[i];
		const pathToCheck = `${path}/${partOfPath}`;

		if (!await pathExist(`${pathToCheck}`)) {
			return false;
		}
	}

	return true;
};

const findTopLevelOfUniffoProject = async (path: string) => {
	const explodedPath = path.split('/');

	while (explodedPath.length) {
		const reconstructedPath = explodedPath.join('/');

		if (await iAmInTopLevelOfUniffoProject(reconstructedPath)) {
			return path;
		}

		explodedPath.pop();
	}

	return false;
};

/**
 * The function `pwd` returns the top level directory of the Uniffo project.
 * @returns The `pwd` function is returning the result of the `findTopLevelOfUniffoProject` function
 * called with the current working directory (`cwd()`) as its argument.
 */
export const pwd = async () => {
	return await findTopLevelOfUniffoProject(cwd());
};
