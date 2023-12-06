import { UNIFFO_PROJECT_STRUCTURE } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';
import { pathExist } from '../path/exist.ts';
import { loopOnProjectStructure } from './loop_on_project_structure.ts';

/**
 * The function creates a project structure by creating directories and files in the specified work
 * directory.
 * @param {string} workdir - The `workdir` parameter is a string that represents the directory where
 * the project structure will be created.
 */
const createProjectStructure = async (workdir: string) => {
	if (!workdir) {
		throw `Invalid workdir "${workdir}"`;
	}

	if (!await pathExist(workdir)) {
		logger.debug(`Creating workdir: '${workdir}'`);
		await Deno.mkdir(workdir, { recursive: true });
	}

	loopOnProjectStructure(UNIFFO_PROJECT_STRUCTURE, function structureCreator({ path, value }) {
		const isFile = typeof value === 'string';

		if (isFile) {
			logger.debug(`Creating file: "${path}" with content: "${value}"`);
			Deno.writeFileSync(path, new TextEncoder().encode(value));
		} else {
			logger.debug(`Creating dir: "${path}"`);
			Deno.mkdirSync(path, { recursive: true });
		}
	}, workdir);
};

export default createProjectStructure;
