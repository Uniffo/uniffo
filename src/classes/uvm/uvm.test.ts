import { UNIFFO_PVFB } from '../../constants/constants.ts';
import createProjectStructure from '../../utils/project_structure/create_project_structure.ts';
import { cwd } from '../../utils/workdir/cwd.ts';
import { classUvm } from './uvm.ts';
import { classSession } from '../session/session.ts';
import { classStore } from '../store/store.ts';
import { classGitHubApiClient } from '../github/gh_api_client.ts';
import { getError } from '../../utils/error/get_error.ts';
import { assert } from 'https://deno.land/std@0.162.0/_util/assert.ts';
import { pathExist } from '../../utils/path/exist.ts';

Deno.test('classUvm', async function testClassUvm() {
	const testDir = `${cwd()}/test_classUvm`;
	const testData = {
		dir: {
			test: `${testDir}`,
			project: `${testDir}/project`,
			uniffo: {
				main: `${testDir}/.uniffo`,
				tmp: `${testDir}/.uniffo/tmp`,
				versions: `${testDir}/.uniffo/versions`,
				localStorage: `${testDir}/.uniffo/localStorage`,
			},
		},
	};

	await createProjectStructure(`${testData.dir.project}`);

	const store = new classStore(testData.dir.test);

	await store.init();

	const session = new classSession({
		store,
	});

	await session.init();

	const gitHubApiClient = new classGitHubApiClient({
		github: {
			owner: 'Uniffo',
			repo: 'uniffo',
			apiUrl: 'https://api.github.com',
		},
		store,
	});

	const uvm = new classUvm({
		uniffoDir: testData.dir.uniffo,
		session,
		gitHubApiClient,
	});

	await uvm.init();

	const _cwd = cwd();

	Deno.chdir(testData.dir.project);

	await uvm.init();

	Deno.writeTextFileSync(`${testData.dir.project}/${UNIFFO_PVFB}`, `999.999.999`);

	assert(
		(await getError<string>(async () => {
			await uvm.init();
		})).length > 0,
		'try to get unavailable version',
	);

	assert(
		uvm.getDispatchTarget().includes(testData.dir.uniffo.versions),
		'get dispatch path',
	);

	assert(
		(await getError<string>(async () => {
			await uvm.downloadVersion(`0.1.0`);
		})) === undefined,
		'download version',
	);

	assert(await pathExist(`${testData.dir.uniffo.versions}/0.1.0/uniffo`), 'verify download');

	assert(await uvm.ensureVersion('0.1.0') === undefined, 'ensure version');

	assert(
		(await getError<string>(async () => {
			await uvm.useLatest();
		})) === undefined,
		'use latest version',
	);

	assert(Array.isArray(await uvm.getVersionsList()), 'versions list');

	assert(uvm.getDirInfo(), '');

	Deno.chdir(_cwd);

	await session.destroy();

	await Deno.remove(testDir, { recursive: true });
});
