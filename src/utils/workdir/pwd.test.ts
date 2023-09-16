import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { LOGGER, UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE } from '../../constants/constants.ts';
import { pathExist } from '../path/exist.ts';
import { cwd } from './cwd.ts';
import { pwd } from './pwd.ts';

Deno.test('pwd', async () => {
	const getRandomDig = () => Math.floor(Math.random() * (9 - 1)) + 1;
	const getTestDirPath = async () => {
		let path =
			`${cwd()}/test_pwd_${getRandomDig()}${getRandomDig()}${getRandomDig()}${getRandomDig()}`;

		while (await pathExist(path)) {
			path =
				`${cwd()}/test_pwd_${getRandomDig()}${getRandomDig()}${getRandomDig()}${getRandomDig()}`;
		}

		return path;
	};

	const testingDirPath = await getTestDirPath();
	const parentDirPath = cwd();

	LOGGER.debug(`Var testingDirPath: '${testingDirPath}'`);

	LOGGER.debug(`Creating environment for test`);

	LOGGER.debug(`Creating '${testingDirPath}'`);
	Deno.mkdirSync(testingDirPath);

	for (let i = 0; i < UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE.length; i++) {
		const partOfPath = UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE[i];
		const isFile = partOfPath.includes('.');
		const pathToCreate = `${testingDirPath}/${partOfPath}`;

		LOGGER.debug(`Creating '${pathToCreate}'`);

		if (isFile) {
			Deno.writeFileSync(pathToCreate, new TextEncoder().encode(''));
		} else {
			Deno.mkdirSync(pathToCreate);
		}
	}

	LOGGER.debug(`Change directory to '${testingDirPath}'`);

	Deno.chdir(testingDirPath);

	LOGGER.debug(`Testing pwd in project'`);

	assertEquals(await pwd(), testingDirPath, 'Pwd in project');

	LOGGER.debug(`Change directory to '${parentDirPath}'`);

	Deno.chdir(parentDirPath);

	LOGGER.debug(`Testing pwd out of project'`);

	assertEquals(await pwd(), false, 'Pwd out of project');

	LOGGER.debug(`Removing '${testingDirPath}'`);

	Deno.removeSync(testingDirPath, { recursive: true });
});
