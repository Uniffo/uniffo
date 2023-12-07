import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import {
	UNIFFO_PROJECT_STRUCTURE,
	UNIFFO_PROJECT_STRUCTURE_EMPTY_DIR,
} from '../../constants/constants.ts';
import _ from 'npm:lodash';
import createProjectStructure from './create_project_structure.ts';
import { getError } from '../error/get_error.ts';
import { assert } from 'https://deno.land/std@0.162.0/_util/assert.ts';
import { cwd } from '../workdir/cwd.ts';
import { noError } from '../error/no_error.ts';
import { pathExist } from '../path/exist.ts';

Deno.test('createProjectStructure', async function testCreateProjectStructure() {
	const testStructure = Object.assign(UNIFFO_PROJECT_STRUCTURE, {
		testDir: { emptyTestDir: UNIFFO_PROJECT_STRUCTURE_EMPTY_DIR, testFile: 'test content' },
	});

	assert(
		(await getError<string>(async () => {
			await createProjectStructure('', testStructure);
		})).length > 0,
		'invalid workdir',
	);

	const testDir = `${cwd()}/test_createProjectStructure`;

	assert(
		await noError(async () => {
			await createProjectStructure(testDir, testStructure);
		}),
		'create custom structure',
	);

	assert(await pathExist(`${testDir}/testDir`), 'check selected path 1/3');
	assert(await pathExist(`${testDir}/testDir/emptyTestDir`), 'check selected path 2/3');
	assert(await pathExist(`${testDir}/testDir/testFile`), 'check selected path 3/3');
	assertEquals(
		Deno.readTextFileSync(`${testDir}/testDir/testFile`),
		testStructure.testDir.testFile,
		'check file content',
	);

	Deno.removeSync(testDir, { recursive: true });
});
