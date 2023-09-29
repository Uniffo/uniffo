import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { PRECOMPILED_DIR } from '../../constants/constants.ts';
import { pathExist } from '../path/exist.ts';
import { getCliVersion } from './get_cli_version.ts';

Deno.test('getCliVersion', async function testGetCliVersion() {
	if (await pathExist(PRECOMPILED_DIR)) {
		await Deno.rename(PRECOMPILED_DIR, `${PRECOMPILED_DIR}_old`);
	}

	assertEquals(await getCliVersion(), false, 'no version');

	if (await pathExist(`${PRECOMPILED_DIR}_old`)) {
		await Deno.rename(`${PRECOMPILED_DIR}_old`, PRECOMPILED_DIR);
	}

	assertEquals(typeof await getCliVersion() === 'string', true, 'version');
});
