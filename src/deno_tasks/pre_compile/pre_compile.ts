import { cwd } from '../../utils/workdir/cwd.ts';
import { generateVersion } from './generate_version.ts';
import { generateCommandsMeta } from './generate_commands_meta.ts';
import { recreate_pre_compiled_dir } from './recreate_pre_compiled_dir.ts';

const PRECOMPILED_DIR = `${cwd()}/src/pre_compiled`;

await (async function () {
	await recreate_pre_compiled_dir(PRECOMPILED_DIR);
	await generateVersion(`${cwd()}/VERSION`, `${PRECOMPILED_DIR}/__cli_version.ts`);
	await generateCommandsMeta(`${cwd()}/src/commands`, `${PRECOMPILED_DIR}/__commands_meta.ts`);
})();
