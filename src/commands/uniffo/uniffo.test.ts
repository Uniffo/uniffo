import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { uniffo } from './uniffo.ts';
import { IUniffoArgs } from './uniffo.d.ts';
import { LOGGER } from '../../constants/constants.ts';

Deno.test('uniffo', function testUniffo() {
	const args: IUniffoArgs = {};

	uniffo(args);

	const lastLog = LOGGER.getLastLog();

	assertEquals(lastLog?.message, 'Hello, I am uniffo :)');
});
