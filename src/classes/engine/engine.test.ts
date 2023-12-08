import { assert } from 'https://deno.land/std@0.162.0/_util/assert.ts';
import { cwd } from '../../utils/workdir/cwd.ts';
import { classGitHubApiClient } from '../github/gh_api_client.ts';
import { classSession } from '../session/session.ts';
import { classStore } from '../store/store.ts';
import { classUvm } from '../uvm/uvm.ts';
import { classEngine } from './engine.ts';
import { noError } from '../../utils/error/no_error.ts';

Deno.test('classEnging', async function testClassEngine() {
	const testDir = `${cwd()}/test_classEngine`;
	const testData = {
		dir: {
			store: `${testDir}/store`,
			project: `${testDir}/project`,
			uniffo: {
				main: `${testDir}/.uniffo`,
				tmp: `${testDir}/.uniffo/tmp`,
				versions: `${testDir}/.uniffo/versions`,
				localStorage: `${testDir}/.uniffo/localStorage`,
			},
		},
	};
	const store = new classStore(testData.dir.store);
	const session = new classSession({
		store,
	});
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
	const engine = new classEngine({ uniffoVersionManager: uvm, session: session });

	assert(
		await noError(async () => {
			await engine.exec(['no-args'], '0.3.0');
		}),
		'dispatch uniffo cmd to another version',
	);

	assert(
		await noError(async () => {
			await engine.exec(['no-args']);
		}),
		'dispatch uniffo cmd to another version',
	);

	Deno.removeSync(testDir, { recursive: true });
});
