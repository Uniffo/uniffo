import { UNIFFO_DIR } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';
import { getOsAlias } from '../../utils/os/get_os_alias.ts';
import { pathExist } from '../../utils/path/exist.ts';
import { classGitHubApiClient } from '../github/gh_api_client.ts';
import { downloadFile } from '../../utils/download/download_file.ts';
import extract from 'npm:extract-zip';
import { session } from '../../services/session.ts';
import { getCurrentCliVersion } from '../../utils/version/get_current_cli_version.ts';
import { getCliVersionRequiredByProject } from '../../utils/version/get_cli_version_required_by_project.ts';
import { classSession } from '../session/session.ts';

/* The `classUvm` class is a TypeScript class that represents the Unifo Version Manager, which is
responsible for managing the versions of the "uniffo" software by downloading and extracting
specific versions from GitHub releases. */
export class classUvm {
	private gitHubApi;
	private dispatch;
	private dispatchTarget;
	private uniffoDir;
	private session;

	/**
	 * The constructor initializes a GitHub API client with specific owner, repo, and API URL, and sets
	 * the dispatch and dispatchTarget properties to false and an empty string respectively.
	 */
	constructor(
		args: {
			uniffoDir?: typeof UNIFFO_DIR;
			gitHubApiClient: classGitHubApiClient;
			session: classSession;
		},
	) {
		this.gitHubApi = args.gitHubApiClient;
		this.session = args.session;
		this.dispatch = false;
		this.dispatchTarget = '';
		this.uniffoDir = args?.uniffoDir || UNIFFO_DIR;
	}

	/**
	 * The `init` function initializes the Unifo Version Manager by checking the current CLI version and
	 * the required CLI version for the project, and then ensuring that the required version is installed
	 * if it is different from the current version.
	 * @returns The code is returning nothing.
	 */
	public async init() {
		logger.debug('Initialize Unifo Version Manager');

		if (!await pathExist(this.uniffoDir.main)) {
			await Deno.mkdir(this.uniffoDir.main, { recursive: true });
		}

		const currentCliVersion = await getCurrentCliVersion();
		logger.debug(`Var currentCliVersion: "${currentCliVersion}"`);

		const cliVersionRequiredByProject = await getCliVersionRequiredByProject();
		logger.debug(`Var cliVersionRequiredByProject: "${cliVersionRequiredByProject}"`);

		if (!cliVersionRequiredByProject || currentCliVersion === cliVersionRequiredByProject) {
			logger.debug(`No need to change uniffo version`);
			return;
		}

		this.dispatch = true;
		this.dispatchTarget = this.getUniffoDetails(cliVersionRequiredByProject).filename;

		await this.ensureVersion(cliVersionRequiredByProject);
	}

	/**
	 * The function `getUniffoDetails` returns an object containing the directory name and filename based
	 * on a given tag name.
	 * @param {string} tagName - The `tagName` parameter is a string that represents the name of a tag.
	 * @returns An object with the properties `dirname` and `filename`.
	 */
	private getUniffoDetails(tagName: string) {
		const dirname = `${this.uniffoDir.versions}/${tagName}`;
		logger.debug(`Var dirname: "${dirname}"`);

		const filename = `${dirname}/uniffo`;
		logger.debug(`Var filename: "${filename}"`);

		return {
			dirname,
			filename,
		};
	}

	/**
	 * The function shouldDispatchCmd returns the value of the dispatch variable and logs it to the debug
	 * logger.
	 * @returns The value of the variable `shouldDispatch`.
	 */
	public shouldDispatchCmd() {
		const shouldDispatch = this.dispatch;
		logger.debug(`Var shouldDispatch: "${shouldDispatch}"`);

		return shouldDispatch;
	}

	/**
	 * The function returns the dispatch target and logs the value of the variable "dispatchTarget".
	 * @returns The method is returning the value of the variable `dispatchTarget`.
	 */
	public getDispatchTarget() {
		const dispatchTarget = this.dispatchTarget;
		logger.debug(`Var dispatchTarget: "${dispatchTarget}"`);

		return dispatchTarget;
	}

	/**
	 * The function `ensureVersion` checks if a specific version of a file exists and if not, it downloads
	 * it.
	 * @param {string} tagName - The `tagName` parameter is a string that represents the version tag name
	 * of a particular software or package.
	 * @returns nothing (undefined).
	 */
	public async ensureVersion(tagName: string) {
		const filename = this.getUniffoDetails(tagName).filename;
		logger.debug(`Var filename: "${filename}"`);

		if (await pathExist(filename)) {
			logger.debug(`Uniffo version "${tagName}" already exist "${filename}"`);
			return;
		}

		await this.downloadVersion(tagName);
	}

	/**
	 * The function "useLatest" logs the latest version of "uniffo" and downloads it if available.
	 */
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
	}

	/**
	 * The function `getVersionsList` fetches a list of releases from a GitHub API, transforms the data,
	 * and sorts the releases by their published date in descending order.
	 * @returns a list of versions with their corresponding tag names and published dates. The list is
	 * sorted in descending order based on the published dates.
	 */
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

	/**
	 * The `downloadVersion` function downloads a specific version of a software called "uniffo" from a
	 * GitHub release, extracts it, and saves it to a destination directory.
	 * @param {string} tagName - The `tagName` parameter is a string that represents the version of the
	 * "uniffo" software that you want to download.
	 */
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
			throw `Not found download url for uniffo "${tagName}" version!`;
		}

		logger.debug(`Var releaseUrlForCurrentOS: "${JSON.stringify(releaseUrlForCurrentOS)}"`);

		logger.info(`Download uniffo version "${tagName}" from "${releaseUrlForCurrentOS}"`);

		const tmpDir = await this.session.getTmpDir();
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

		const destDir = this.getUniffoDetails(tagName).dirname;
		logger.debug(`Var destDir: "${destDir}"`);

		if (!await pathExist(destDir)) {
			await Deno.mkdir(destDir, { recursive: true });
		}

		logger.info(`Extracting into ${destDir}`);
		await extract(downloadDetails.filename, { dir: destDir });

		logger.info(`"Uniffo ${tagName} downloaded"`);
	}
}
