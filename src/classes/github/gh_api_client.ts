import { logger } from '../../services/logger.ts';
import { classStore } from '../store/store.ts';
import { IReleaseByTagName } from './release_by_tag_name.d.ts';
import { IReleases } from './releases_list.d.ts';

/* The `classGitHubApiClient` is a TypeScript class that provides methods for fetching releases from a
GitHub repository, caching the responses, and retrieving cached data. */
export class classGitHubApiClient {
	private github;
	private store;

	/**
	 * The constructor function initializes the GitHub API client with the provided owner, repo, and
	 * apiUrl.
	 * @param args - An object containing the following properties:
	 */
	constructor(
		args: { github: { owner: string; repo: string; apiUrl: string }; store: classStore },
	) {
		this.github = args.github;
		this.store = args.store;
	}

	/**
	 * The function returns an object containing data and expiration time for caching purposes.
	 * @param {string} data - The `data` parameter is a string that represents the data that you want to
	 * store in the cache object.
	 * @param {number} expiration - The expiration parameter is a number that represents the duration in
	 * milliseconds for which the cache object should be considered valid. After this duration has passed,
	 * the cache object should be considered expired and should not be used.
	 * @returns An object with properties "data" and "expiration" is being returned.
	 */
	private getCacheObject(data: string, expiration: number) {
		return {
			data,
			expiration,
		};
	}

	/**
	 * The addCache function adds a value to the cache with an optional expiration time.
	 * @param {string} id - The `id` parameter is a string that represents the unique identifier for the
	 * cache entry. It is used to store and retrieve the cache data.
	 * @param {string} data - The `data` parameter is a string that represents the value to be stored in
	 * the cache.
	 * @param {number} [expiration] - The `expiration` parameter is an optional parameter that specifies
	 * the expiration time for the cache entry. It is a number representing the number of milliseconds
	 * since the Unix epoch. If not provided, the default expiration time is set to 5 minutes (1000
	 * milliseconds * 60 seconds * 5 minutes).
	 */
	private async addCache(id: string, data: string, expiration?: number) {
		const _expiration = Date.now() + (1000 * 60 * 5);

		const value = this.getCacheObject(data, expiration || _expiration);

		logger.debug(`Add cache "${id}" as "${JSON.stringify(value)}"`);

		await this.store.setPersistentValue(id, value);
	}

	/**
	 * The function `getCache` retrieves a cached value from a store and checks if it has expired.
	 * @param {string} id - The `id` parameter is a string that represents the unique identifier for the
	 * cache. It is used to retrieve the cache object from the this.store.
	 * @returns the `data` property of the `cache` object.
	 */
	private async getCache(id: string) {
		const cache = await this.store.getPersistentValue<ReturnType<typeof this.getCacheObject>>(
			id,
		);

		logger.debug(`Get cache "${id}" as "${JSON.stringify(cache)}"`);

		if (Date.now() > (cache?.expiration || 0)) {
			await this.store.removePersistentKey(id);
			return undefined;
		}

		return cache.data;
	}

	/**
	 * The function fetches releases from a GitHub repository, checks if the response is cached, and
	 * returns the releases either from the cache or by making a request to the GitHub API.
	 * @returns a Promise that resolves to an array of IReleases objects.
	 */
	public async fetchReleases() {
		const cacheId = `${this.github.owner}-${this.github.repo}-fetchReleases`;
		const cache = await this.getCache(cacheId);
		logger.debug(`Var cacheId: ${cacheId}`);
		logger.debug(`Var cache: ${cache}`);

		if (cache) {
			logger.debug(`Return cached response`);
			return JSON.parse(cache) as IReleases[];
		}

		const url =
			`${this.github.apiUrl}/repos/${this.github.owner}/${this.github.repo}/releases?per_page=20&page=1`;
		const headers = {};

		logger.debug(`Var url: ${url}`);
		logger.debug(`Var headers: ${JSON.stringify(headers)}`);

		const req = await fetch(url, {
			method: 'GET',
			headers,
		});

		if (req.status == 404) {
			throw 'Not found uniffo releases!';
		}

		const jsonResponse: Promise<IReleases[]> = req.json();

		await this.addCache(cacheId, JSON.stringify(await jsonResponse));

		return jsonResponse;
	}

	/**
	 * The function fetches a release from a GitHub repository based on a given tag name, and caches the
	 * response for future use.
	 * @param {string} tagName - The `tagName` parameter is a string that represents the name of the tag
	 * for which you want to fetch the release.
	 * @returns a Promise that resolves to an object of type IReleaseByTagName.
	 */
	public async fetchReleaseByTagName(tagName: string) {
		const cacheId = `${this.github.owner}-${this.github.repo}-fetchReleaseByTagName-${tagName}`;
		const cache = await this.getCache(cacheId);
		logger.debug(`Var cacheId: ${cacheId}`);
		logger.debug(`Var cache: ${cache}`);

		if (cache) {
			logger.debug(`Return cached response`);
			return JSON.parse(cache) as IReleaseByTagName;
		}

		const url =
			`${this.github.apiUrl}/repos/${this.github.owner}/${this.github.repo}/releases/tags/${tagName}`;
		const headers = {};

		logger.debug(`Var url: ${url}`);
		logger.debug(`Var headers: ${JSON.stringify(headers)}`);

		const req = await fetch(url, {
			method: 'GET',
			headers,
		});

		if (req.status == 404) {
			throw `Not found uniffo release by tag name "${tagName}"!`;
		}

		const jsonResponse: Promise<IReleaseByTagName> = req.json();

		await this.addCache(cacheId, JSON.stringify(await jsonResponse));

		return jsonResponse;
	}
}
