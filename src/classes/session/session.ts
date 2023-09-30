import { UNIFFO_DIR } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';
import { store } from '../../services/store.ts';
import { generateUniqueBasename } from '../../utils/file/generate_unique_basename.ts';

export class classSession {
	async init() {
		await store.init('uniffo');
		await this.mkTmpDir();
	}

	async destroy() {
		await this.rmTmpDir();
		await store.destroySession();
		this.closeOpenedResources();
	}

	private mkTmpDir = async () => {
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

		await store.setSessionValue('tmpDir', sessionTmpDir);
	};

	private rmTmpDir = async () => {
		const tmpDir = await this.getTmpDir();
		logger.debug(`Var tmpDir: "${tmpDir}"`);

		if (!tmpDir) {
			logger.debug(`Session tmp dir already removed "${tmpDir}"`);
			return;
		}

		logger.debug(`Removing session tmp dir "${tmpDir}"`);
		await Deno.remove(tmpDir, { recursive: true });
	};

	public getTmpDir = async () => {
		return await store.getSessionValue<string | undefined>('tmpDir');
	};

	private closeOpenedResources = () => {
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
	};
}
