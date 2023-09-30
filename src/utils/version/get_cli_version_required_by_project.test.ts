import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { generateUniqueBasename } from '../file/generate_unique_basename.ts';
import { cwd } from '../workdir/cwd.ts';
import { getCliVersionRequiredByProject } from './get_cli_version_required_by_project.ts';
import { UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE, UNIFFO_PVFB } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';

Deno.test('getCliVersionRequiredByProject', async function testGetCliVersionRequiredByProject() {
	const testDirBasename = await generateUniqueBasename({
		basePath: cwd(),
		prefix: 'test_',
	});
	const testDir = `${cwd()}/${testDirBasename}`;

	await Deno.mkdir(testDir, { recursive: true });

	Deno.chdir(testDir);

	assertEquals(await getCliVersionRequiredByProject(), false, 'no project version');

	const testVersion = '99.99.99';

	for (let i = 0; i < UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE.length; i++) {
		const partOfPath = UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE[i];
		const isFile = partOfPath.includes('.');
		const pathToCreate = `${testDir}/${partOfPath}`;

		logger.debug(`Creating '${pathToCreate}'`);

		if (isFile) {
			if (partOfPath == UNIFFO_PVFB) {
				await Deno.writeTextFile(pathToCreate, testVersion);
			} else {
				await Deno.writeTextFile(pathToCreate, '');
			}
		} else {
			Deno.mkdirSync(pathToCreate);
		}
	}

	assertEquals(await getCliVersionRequiredByProject(), testVersion, 'project version');

	await Deno.remove(testDir, { recursive: true });
});
