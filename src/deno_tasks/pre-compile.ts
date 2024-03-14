import { logger } from '../services/logger.ts';
import { pathExist } from '../utils/path/exist.ts';
import { cwd } from '../utils/workdir/cwd.ts';
import { recursiveReaddir } from 'https://deno.land/x/recursive_readdir@v2.0.0/mod.ts';
import { extname } from 'https://deno.land/std@0.220.0/path/mod.ts';
import { TCommandMeta } from '../classes/command/command.d.ts';

await (async function preCompile() {
	const precompiledDir = `${cwd()}/src/pre_compiled`;

	const cliVersion = async () => {
		const versionFilename = `${cwd()}/VERSION`;

		if (!await pathExist(versionFilename)) {
			await Deno.writeTextFile(versionFilename, `0.0.0`);
		}

		if (await pathExist(versionFilename)) {
			const version = await Deno.readTextFile(versionFilename);
			logger.debug(`Var version: "${version}"`);

			const moduleContent = `export const cliVersion = "${version}";`;
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
	};

	const commandsMeta = async () => {
		const commandsRootDir = `${cwd()}/src/commands`;
		logger.debug(`Var commandsRootDir: "${commandsRootDir}"`);

		const imports = [];
		const commands = [];

		for (
			const file of (await recursiveReaddir(commandsRootDir)).filter(
				(file: string) => extname(file) === '.ts',
			)
		) {
			logger.debug(`Var file:`, file);

			const importResult: TCommandMeta = (await import(file))?.default;

			logger.debug(`Var importResult:`, importResult);

			logger.debug(importResult.class.name);

			const commandImportName = `${importResult.class.name}Meta`;

			imports.push(`import ${commandImportName} from '${file}';`);

			commands.push(`${commandImportName}`);
		}

		logger.debug(`Var imports:`, imports);
		logger.debug(`Var commands:`, commands);

		const moduleContent = `${imports.join('\n')}\nexport const COMMANDS_META = [\n    ${
			commands.join(',\n    ')
		},\n];\n`;

		logger.debug(`Var moduleContent:\n`, moduleContent);

		const moduleFilename = `${precompiledDir}/__commands_meta.ts`;

		logger.debug(`Var moduleContent:\n`, moduleFilename);

		Deno.writeTextFile(moduleFilename, moduleContent);
	};

	await cliVersion();
	await commandsMeta();
})();
