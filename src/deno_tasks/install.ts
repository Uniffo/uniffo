import { classCliVersionManager } from '../classes/cli_version_manager/cli_version_manager.ts';
import { classDatabase } from '../classes/database/database.ts';
import classDependencyChecker from '../classes/dependency_checker/dependency_checker.ts';
import { classGitHubApiClient } from '../classes/github/gh_api_client.ts';
import { CLI_DIR } from '../constants/index.ts';
import { logger } from '../services/logger.ts';
import { generateUniqueBasename } from '../utils/file/generate_unique_basename.ts';

await (async function installer() {
	const tmpDir = `${CLI_DIR.tmp}/${await generateUniqueBasename({ basePath: CLI_DIR.tmp })}`;
	const database = new classDatabase({ dirname: `${CLI_DIR.localStorage}` });
	const gitHubApiClient = new classGitHubApiClient({
		github: {
			owner: 'Uniffo',
			repo: 'uniffo',
			apiUrl: 'https://api.github.com',
		},
		database,
	});
	const cliVersionManager = new classCliVersionManager({
		cliDir: CLI_DIR,
		gitHubApiClient,
		tmpDir,
	});

	logger.info('Initialize installer');
	await cliVersionManager.init();

	logger.info('Install latest version of wpd');
	const latest = await cliVersionManager.useLatest();

	const shell = Deno.env.get('SHELL');

	logger.info(`Add uniffo path to shell profile "${shell}"`);

	let profile = '';
	switch (shell) {
		case '/bin/zsh':
			profile = '.zshrc';
			break;

		case '/bin/bash':
			profile = '.bashrc';
			break;

		default:
			logger.error(
				`Not supported shell "${shell}"! Please add manually uniffo path "${uvm.getDirInfo().main}" to your shell profile (${shell})`,
			);
			break;
	}

	if (profile) {
		const profileFilename = `${Deno.env.get('HOME')}/${profile}`;
		const profileContent = Deno.readTextFileSync(profileFilename);
		const beginUniffoContent = '# UNIFFO - BEGIN';
		const endUniffoContent = '# UNIFFO - END';
		const newContent: string[] = [];
		let uniffoContentBoolean = false;
		const splitedProfileContent = profileContent.split('\n');

		splitedProfileContent.forEach((line, index) => {
			const isLastLine = index == splitedProfileContent.length - 1;

			if (line.includes(beginUniffoContent)) {
				uniffoContentBoolean = true;
			}

			if (uniffoContentBoolean == false && !(isLastLine && line === '')) {
				newContent.push(`${line}`);
			}

			if (line.includes(endUniffoContent)) {
				uniffoContentBoolean = false;
			}
		});

		const addUninffoToPATH: string[] = [];

		addUninffoToPATH.push(`${beginUniffoContent}`);
		addUninffoToPATH.push(`PATH="\${PATH}:${uvm.getDirInfo().main}"`);
		addUninffoToPATH.push(`${endUniffoContent}`);

		newContent.push(...addUninffoToPATH);

		logger.info(
			`Add: \n${addUninffoToPATH.join('\n')}\n To shell profile file "${profileFilename}"`,
		);
		Deno.writeTextFileSync(profileFilename, `${newContent.join('\n')}\n`);
	}

	logger.success(
		`Uniffo ${latest} successfully installed. Please restart terminal and try to execute "uniffo"`,
	);

	classDependencyChecker.check();
})();
