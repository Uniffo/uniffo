import { logger } from './services/logger.ts';
import { session } from './services/session.ts';
import { uvm } from './services/uvm.ts';

await (async function installer() {
	logger.info('Initialize installer');
	await session.init();
	await uvm.init();

	logger.info('Install latest version of uniffo');
	const latest = await uvm.useLatest();

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
				`Not supported shell "${shell}"! Please add manually uniffo path "${uvm.getUniffoDir().main}" to your shell profile (${shell})`,
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
		addUninffoToPATH.push(`PATH="\${PATH}:${uvm.getUniffoDir().main}"`);
		addUninffoToPATH.push(`${endUniffoContent}`);

		newContent.push(...addUninffoToPATH);

		logger.info(
			`Add: \n${addUninffoToPATH.join('\n')}\n To shell profile file "${profileFilename}"`,
		);
		Deno.writeTextFileSync(profileFilename, `${newContent.join('\n')}\n`);
	}

	logger.success(`Uniffo ${latest} successfully installed`);

	logger.info('Checking required dependencies');

	if (!shell) {
		logger.error(
			`Can not verify required dependencies because "SHELL" environment variable "${shell}"!`,
		);
		return;
	}

	const checkDockerCmd = new TextDecoder().decode(
		new Deno.Command(shell, { args: ['command', '-v', 'docker'] }).outputSync().stdout,
	);

	if (!checkDockerCmd) {
		logger.error('"docker" is required!');
	}
})();
