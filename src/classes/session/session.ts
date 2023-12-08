import { UNIFFO_DIR } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';
import { generateUniqueBasename } from '../../utils/file/generate_unique_basename.ts';
import { classStore } from '../store/store.ts';

/* The `classSession` class provides methods for initializing and destroying a session, creating and
removing temporary directories, and closing opened resources. */
export class classSession {
	private store;

	constructor(args: { store: classStore }) {
		this.store = args.store;
	}

	/**
	 * The `init` function initializes a store and creates a temporary directory.
	 */
	async init() {
		await this.store.init('uniffo');
		await this.mkTmpDir();
	}

	/**
	 * The `destroy` function performs cleanup tasks such as removing temporary directories, destroying a
	 * session, and closing opened resources.
	 */
	async destroy() {
		await this.rmTmpDir();
		await this.store.destroySession();
		this.closeOpenedResources();
	}

	/**
	 * The function `mkTmpDir` creates a temporary directory for the session if it doesn't already exist.
	 * @returns nothing.
	 */
	private async mkTmpDir() {
		const tmpDir = await this.getTmpDir();
		logger.debug(`Var tmpDir: "${tmpDir}"`);

		if (tmpDir) {
			logger.debug(`Session tmp dir already exist "${tmpDir}"`);
			return;
		}

		const dirBasename = await generateUniqueBasename({
			basePath: UNIFFO_DIR.tmp,
		});
		logger.debug(`Var dirBasename: "${dirBasename}"`);

		const sessionTmpDir = `${UNIFFO_DIR.tmp}/${dirBasename}`;
		logger.debug(`Var sessionTmpDir: "${sessionTmpDir}"`);

		logger.debug(`Creating session tmp dir "${sessionTmpDir}"`);
		await Deno.mkdir(sessionTmpDir, { recursive: true });

		await this.store.setSessionValue('tmpDir', sessionTmpDir);
	}

	/**
	 * The function `rmTmpDir` removes a temporary directory and logs the process.
	 * @returns nothing (undefined) if the `tmpDir` variable is falsy (null, undefined, false, 0, empty
	 * string, NaN). Otherwise, it is removing the session temporary directory using `Deno.remove()` and
	 * returning a promise.
	 */
	private async rmTmpDir() {
		const tmpDir = await this.getTmpDir();
		logger.debug(`Var tmpDir: "${tmpDir}"`);

		if (!tmpDir) {
			logger.debug(`Session tmp dir already removed "${tmpDir}"`);
			return;
		}

		logger.debug(`Removing session tmp dir "${tmpDir}"`);
		await Deno.remove(tmpDir, { recursive: true });
	}

	/**
	 * The function `getTmpDir` retrieves the value of the 'tmpDir' session variable from the this.store.
	 * @returns a promise that resolves to a string or undefined value.
	 */
	public async getTmpDir() {
		return await this.store.getSessionValue<string | undefined>('tmpDir');
	}

	/**
	 * The function `closeOpenedResources` closes all opened resources except for standard input, output,
	 * and error.
	 * @returns The function does not explicitly return anything.
	 */
	private closeOpenedResources() {
		const resources = Deno.resources();
		logger.debug(`Var resources: "${JSON.stringify(resources)}"`);

		if (typeof resources !== 'object') {
			return;
		}

		const keys = Object.keys(resources);
		logger.debug(`Var keys: "${JSON.stringify(keys)}"`);

		const ignore = ['stdin', 'stdout', 'stderr'];
		logger.debug(`Var ignore: "${JSON.stringify(ignore)}"`);

		for (let i = 0; i < keys.length; i++) {
			const rid = parseInt(keys[i]);
			logger.debug(`Var rid: "${rid}"`);

			if (keys[i] !== `${rid}`) {
				logger.debug(`Skip - rid is not equal original value, "${keys[i]}" != "${rid}"`);
				continue;
			}

			const resourceName = resources[rid];
			logger.debug(`Var resourceName: "${resourceName}"`);

			if (typeof resourceName !== 'string') {
				logger.debug(`Skip - resource name is not string type`);
				continue;
			}

			if (ignore.includes(resourceName)) {
				logger.debug(`Skip - resource name in ignore list`);
				continue;
			}

			logger.debug(`Closing resource named "${resourceName}" with rid "${rid}"`);
			Deno.close(rid);
		}
	}
}
