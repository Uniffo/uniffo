import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { classGitHubApiClient } from './gh_api_client.ts';
import { session } from '../../services/session.ts';
import { classStore } from '../store/store.ts';

Deno.test('classGitHubApiClient', async function testClassGitHubApiClient() {
	await session.init();

	const ghApi = new classGitHubApiClient({
		github: {
			owner: 'Uniffo',
			repo: 'uniffo',
			apiUrl: 'https://api.github.com',
		},
		store: new classStore(),
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

	await session.destroy();
});
