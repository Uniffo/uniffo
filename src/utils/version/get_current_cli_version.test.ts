import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { PRECOMPILED_DIR } from '../../constants/constants.ts';
import { pathExist } from '../path/exist.ts';
import { getCurrentCliVersion } from './get_current_cli_version.ts';
import { getError } from '../error/get_error.ts';

Deno.test('getCurrentCliVersion', async function testGetCurrentCliVersion() {
	assertEquals(typeof await getCurrentCliVersion() === 'string', true, 'version');

	if (await pathExist(PRECOMPILED_DIR)) {
		await Deno.rename(PRECOMPILED_DIR, `${PRECOMPILED_DIR}_old`);
	}

	assertEquals(
		(await getError<string>(async () => {
			await getCurrentCliVersion();
		})).length > 0,
		true,
		'no version',
	);

	if (await pathExist(`${PRECOMPILED_DIR}_old`)) {
		await Deno.rename(`${PRECOMPILED_DIR}_old`, PRECOMPILED_DIR);
	}
});
