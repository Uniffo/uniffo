import { parseCliArgs } from '../utils/cli_args/parser.ts';
import { cwd } from '../utils/workdir/cwd.ts';

export const CLI_ARGS = parseCliArgs(Deno.args);
export const PRECOMPILED_DIR = `${cwd()}/src/pre-compiled`;
/* The `UNIFFO_CVFB` => Uniffo CLI Version File Basename */
export const UNIFFO_CVFB = 'VERSION';
/* The `UNIFFO_PVFB` => Uniffo Project Version File Basename */
export const UNIFFO_PVFB = '.uvm';
export const UNIFFO_PROJECT_TOP_LEVEL_STRUCTURE = ['uniffo', 'data', 'source', UNIFFO_PVFB];
export const UNIFFO_DIR = {
	main: `${Deno.env.get('HOME')}/.uniffo`,
	tmp: `${Deno.env.get('HOME')}/.uniffo/tmp`,
	versions: `${Deno.env.get('HOME')}/.uniffo/versions`,
};
