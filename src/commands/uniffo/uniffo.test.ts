import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { logger, uniffo } from './uniffo.ts';

Deno.test('uniffo', () => {
	uniffo();

	const lastLog = logger.storage.getLastLog();

	assertEquals(lastLog.message, 'Hello, I am uniffo :)');
});
