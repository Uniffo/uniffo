import { parseCliArgs } from '../utils/cli_args/parser.ts';
import { getCurrentCliVersion } from '../utils/version/get_current_cli_version.ts';
import { cwd } from '../utils/workdir/cwd.ts';

export const CLI_ARGS = parseCliArgs(Deno.args);
export const PRECOMPILED_DIR = `${cwd()}/src/pre_compiled`;
/* The `UNIFFO_CVFB` => Uniffo CLI Version File Basename */
export const UNIFFO_CVFB = 'VERSION';
/* The `UNIFFO_PVFB` => Uniffo Project Version File Basename */
export const UNIFFO_PVFB = '.uvm';
export const UNIFFO_PROJECT_STRUCTURE_EMPTY_DIR = {};
export const UNIFFO_PROJECT_STRUCTURE = {
	uniffo: UNIFFO_PROJECT_STRUCTURE_EMPTY_DIR,
	data: UNIFFO_PROJECT_STRUCTURE_EMPTY_DIR,
	source: UNIFFO_PROJECT_STRUCTURE_EMPTY_DIR,
	[`${UNIFFO_PVFB}`]: await getCurrentCliVersion(),
};
export const UNIFFO_DIR = {
	main: `${Deno.env.get('HOME')}/.uniffo`,
	tmp: `${Deno.env.get('HOME')}/.uniffo/tmp`,
	versions: `${Deno.env.get('HOME')}/.uniffo/versions`,
	localStorage: `${Deno.env.get('HOME')}/.uniffo/localStorage`,
};
