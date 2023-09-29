import { UNIFFO_DIR } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';
import { getOsAlias } from '../../utils/os/get_os_alias.ts';
import { pathExist } from '../../utils/path/exist.ts';
import { classGitHubApiClient } from '../github/gh_api_client.ts';
import { downloadFile } from '../../utils/download/download_file.ts';
import extract from 'npm:extract-zip';
import { session } from '../../services/session.ts';

export class classUvm {
	private gitHubApi;

	constructor() {
		this.gitHubApi = new classGitHubApiClient({
			owner: 'Uniffo',
			repo: 'uniffo',
			apiUrl: 'https://api.github.com',
		});
	}

	public async init() {
		logger.debug('Initialize Unifo Version Manager');

		if (!await pathExist(UNIFFO_DIR.main)) {
			await Deno.mkdir(UNIFFO_DIR.main);
		}

		if (!await pathExist(`${UNIFFO_DIR.main}/uniffo`)) {
			await this.useLatest();
		}
	}

	public async useLatest() {
		logger.debug('Use latest uniffo version');

		const versions = await this.getVersionsList();
		logger.debug(`Var versions: ${JSON.stringify(versions)}`);

		if (!versions.length) {
			throw 'No available uniffo version!';
		}

		const latest = versions[0];

		logger.info(`Use uniffo "${latest.tagName}" version`);

		await this.downloadVersion(latest.tagName);

		// TODO: activate version
	}

	public async getVersionsList() {
		logger.debug('Fetch uniffo versions list');

		const releases = await this.gitHubApi.fetchReleases();

		logger.debug(`Var releases: ${JSON.stringify(releases)}`);
		return releases?.map((item) => {
			const publishedDate = item.published_at
				? new Date(item.published_at).getTime()
				: undefined;

			return {
				tagName: item.tag_name,
				publishedDate,
			};
		}).sort((a, b) => {
			if (!a.publishedDate || !b.publishedDate) {
				return 0;
			}

			return b.publishedDate - a.publishedDate;
		});
	}

	public async downloadVersion(tagName: string) {
		logger.debug(`Download uniffo "${tagName}" version`);

		const release = await this.gitHubApi.fetchReleaseByTagName(tagName);
		logger.debug(`Var release: ${JSON.stringify(release)}`);

		const osAlias = getOsAlias();
		logger.debug(`Var osAlias: ${osAlias}`);

		if (osAlias === 'Os not recognized') {
			throw osAlias;
		}

		const releaseUrlForCurrentOS = release.assets.find((asset) =>
			asset.name == `${osAlias}.zip`
		)?.browser_download_url;

		if (!releaseUrlForCurrentOS) {
			throw `No download url for uniffo "${tagName}" version!`;
		}

		logger.debug(`Var releaseUrlForCurrentOS: "${JSON.stringify(releaseUrlForCurrentOS)}"`);

		logger.info(`Download uniffo version "${tagName}" from "${releaseUrlForCurrentOS}"`);

		const tmpDir = session.getTmpDir();
		logger.debug(`Var tmpDir: "${tmpDir}"`);

		if (!tmpDir) {
			throw `Invalid session tmp dir "${tmpDir}"!`;
		}

		const downloadDetails = await downloadFile({
			saveToFile: true,
			returnFileContent: false,
			url: releaseUrlForCurrentOS,
			destDir: tmpDir,
		});
		logger.debug(`Var downloadDetails: "${JSON.stringify(downloadDetails)}"`);

		if (!downloadDetails.filename) {
			throw 'Downloaded filename is incorrect!';
		}

		if (!await pathExist(downloadDetails.filename)) {
			throw `Downloaded zip is missing!`;
		}

		const destDir = `${UNIFFO_DIR.versions}/${tagName}`;
		logger.debug(`Var destDir: "${destDir}"`);

		if (!await pathExist(destDir)) {
			await Deno.mkdir(destDir, { recursive: true });
		}

		logger.info(`Extracting into ${destDir}`);
		await extract(downloadDetails.filename, { dir: destDir });

		logger.info(`"Uniffo ${tagName} downloaded"`);
	}
}
