import { classCliVersionManager } from '../classes/cli_version_manager/cli_version_manager.ts';
import { CLI_DIR } from '../constants/CLI_DIR.ts';
import { gitHubApiClient } from './github_api_client.ts';
import { tmpDir } from './tmp_dir.ts';

export const cliVersionManager = new classCliVersionManager({
    cliDir: CLI_DIR,
    gitHubApiClient,
    tmpDir,
});
