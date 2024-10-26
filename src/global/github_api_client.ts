import { classGitHubApiClient } from '../classes/github/gh_api_client.ts';
import { database } from './database.ts';

export const gitHubApiClient = new classGitHubApiClient({ database });
