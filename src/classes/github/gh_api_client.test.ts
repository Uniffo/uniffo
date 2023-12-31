import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { classGitHubApiClient } from './gh_api_client.ts';
import { classStore } from '../store/store.ts';
import { cwd } from '../../utils/workdir/cwd.ts';

Deno.test('classGitHubApiClient', async function testClassGitHubApiClient() {
	const testDir = `${cwd()}/test_classUvm`;
	const testData = {
		dir: {
			test: `${testDir}`,
		},
	};

	const store = new classStore(testData.dir.test);

	await store.init();

	const ghApi = new classGitHubApiClient({
		github: {
			owner: 'Uniffo',
			repo: 'uniffo',
			apiUrl: 'https://api.github.com',
		},
		store: store,
	});

	const releases = await ghApi.fetchReleases();
	const releaseTagName = releases[0].tag_name;
	const release = await ghApi.fetchReleaseByTagName(releaseTagName);

	assertEquals(Array.isArray(releases), true, 'ghApi.fetchReleases() return array');
	assertEquals(releaseTagName.length > 0, true, 'release tag name');
	assertEquals(
		typeof release,
		'object',
		'ghApi.fetchReleaseByTagName(releaseTagName) return object',
	);
});
