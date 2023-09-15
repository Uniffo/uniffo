import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { uniffo } from './uniffo.ts';
import { logger } from '../../entry.ts';
import { IUniffoArgs } from './uniffo.d.ts';

Deno.test('uniffo', () => {
	const args: IUniffoArgs = {};

	uniffo(args);

	const lastLog = logger.getLastLog();

	assertEquals(lastLog?.message, 'Hello, I am uniffo :)');
});
