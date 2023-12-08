import { logger } from './services/logger.ts';
import { pathExist } from './utils/path/exist.ts';
import { cwd } from './utils/workdir/cwd.ts';

const versionFilename = `${cwd()}/VERSION`;
const precompiledDir = `${cwd()}/src/pre_compiled`;

if (!await pathExist(versionFilename)) {
	await Deno.writeTextFile(versionFilename, `0.0.0`);
}

if (await pathExist(versionFilename)) {
	const version = await Deno.readTextFile(versionFilename);
	logger.debug(`Var version: "${version}"`);

	const moduleContent = `export default "${version}";`;
	logger.debug(`Var moduleContent: "${moduleContent}"`);

	const moduleFilename = `${precompiledDir}/__cli_version.ts`;
	logger.debug(`Var moduleFilename: "${moduleFilename}"`);

	if (!await pathExist(precompiledDir)) {
		logger.debug(`Create assets dir "${precompiledDir}"`);
		await Deno.mkdir(precompiledDir, { recursive: true });
	}

	logger.debug(`Write module "${moduleFilename}"`);
	Deno.writeTextFile(moduleFilename, moduleContent);
}
