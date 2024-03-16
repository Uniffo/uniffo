import { getCurrentCliVersion } from '../utils/get_current_cli_version/get_current_cli_version.ts';
import { cwd } from '../utils/cwd/cwd.ts';

export const PRECOMPILED_DIR = `${cwd()}/src/pre_compiled`;
/* The `CLI_CVFB` => Uniffo CLI Version File Basename */
export const CLI_CVFB = 'VERSION';
/* The `CLI_PVFB` => Uniffo Project Version File Basename */
export const CLI_PVFB = '.wpdvm';
export const CLI_PROJECT_STRUCTURE_EMPTY_DIR = {};
export const CLI_PROJECT_STRUCTURE = {
	wpd: CLI_PROJECT_STRUCTURE_EMPTY_DIR,
	data: CLI_PROJECT_STRUCTURE_EMPTY_DIR,
	source: CLI_PROJECT_STRUCTURE_EMPTY_DIR,
	[`${CLI_PVFB}`]: getCurrentCliVersion(),
};
export const CLI_DIR = {
	main: `${Deno.env.get('HOME')}/.wpd`,
	tmp: `${Deno.env.get('HOME')}/.wpd/tmp`,
	versions: `${Deno.env.get('HOME')}/.wpd/versions`,
	localStorage: `${Deno.env.get('HOME')}/.wpd/localStorage`,
};
