import { classCliVersionManager } from './classes/cli_version_manager/cli_version_manager.ts';
import { classCommandInvoker } from './classes/command_invoker/command_invoker.ts';
import { classCommandsRepository } from './classes/command_repository/command_repository.ts';
import { classDatabase } from './classes/database/database.ts';
import { classCommandInvokerFacade } from './classes/facades/command_invoker_facade/command_invoker_facade.ts';
import { classGitHubApiClient } from './classes/github/gh_api_client.ts';
import { CLI_DIR } from './constants/index.ts';
import { parseCliArgs } from './utils/cli_args/parser.ts';
import { generateUniqueBasename } from './utils/file/generate_unique_basename.ts';

const tmpDir = `${CLI_DIR.tmp}/${await generateUniqueBasename({ basePath: CLI_DIR.tmp })}`;
const commandArguments = parseCliArgs(Deno.args);
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
const commandsRepository = new classCommandsRepository();
const commandInvoker = new classCommandInvoker();
const commandInvokerFacade = new classCommandInvokerFacade({
	tmpDir,
	commandArguments,
	database,
	cliVersionManager,
	commandsRepository,
	commandInvoker,
});

await commandInvokerFacade.exec();
