import { logger } from '../../global/logger.ts';
import { recursiveReaddir } from 'https://deno.land/x/recursive_readdir@v2.0.0/mod.ts';
import { extname } from 'https://deno.land/std@0.220.0/path/mod.ts';

const generateEmptyCommandsMetaFile = async (commandsMetaFile: string) => {
	logger.debug('Generate empty commands meta file', commandsMetaFile);

	await Deno.writeTextFile(commandsMetaFile, 'export const COMMANDS_META = [];\n');
};

const generateCommandsMetaFile = async (commandsRootDir: string, commandsMetaFile: string) => {
	const imports = [];
	const commands = [];

	for (
		const file of (await recursiveReaddir(commandsRootDir)).filter(
			(file: string) => extname(file) === '.ts',
		)
	) {
		logger.debug(`Var file:`, file);

		const importResult = (await import(file))?.default;

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

	logger.debug(`Write commands meta to file`, commandsMetaFile);

	await Deno.writeTextFile(commandsMetaFile, moduleContent);
};

export const generateCommandsMeta = async (commandsRootDir: string, commandsMetaFile: string) => {
	await generateEmptyCommandsMetaFile(commandsMetaFile);
	await generateCommandsMetaFile(commandsRootDir, commandsMetaFile);
};
