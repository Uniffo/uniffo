import { PRECOMPILED_DIR, UNIFFO_CVFB } from './constants/constants.ts';
import { logger } from './services/logger.ts';
import { pathExist } from './utils/path/exist.ts';
import { cwd } from './utils/workdir/cwd.ts';

const versionFilename = `${cwd()}/${UNIFFO_CVFB}`;

if (!await pathExist(versionFilename)) {
	await Deno.writeTextFile(versionFilename, `0.0.0`);
}

if (await pathExist(versionFilename)) {
	const version = await Deno.readTextFile(versionFilename);
	logger.debug(`Var version: "${version}"`);

	const moduleContent = `export default "${version}";`;
	logger.debug(`Var moduleContent: "${moduleContent}"`);

	const moduleFilename = `${PRECOMPILED_DIR}/__cli_version.ts`;
	logger.debug(`Var moduleFilename: "${moduleFilename}"`);

	if (!await pathExist(PRECOMPILED_DIR)) {
		logger.debug(`Create assets dir "${PRECOMPILED_DIR}"`);
		await Deno.mkdir(PRECOMPILED_DIR, { recursive: true });
	}

	logger.debug(`Write module "${moduleFilename}"`);
	Deno.writeTextFile(moduleFilename, moduleContent);
}
