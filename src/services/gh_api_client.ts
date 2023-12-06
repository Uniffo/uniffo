import { classGitHubApiClient } from '../classes/github/gh_api_client.ts';
import { store } from './store.ts';

export const gitHubApiClient = new classGitHubApiClient({
	github: {
		owner: 'Uniffo',
		repo: 'uniffo',
		apiUrl: 'https://api.github.com',
	},
	store,
});
