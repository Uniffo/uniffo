import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { cwd } from '../workdir/cwd.ts';
import { generateUniqueBasename } from './generate_unique_basename.ts';

Deno.test('generateUniqueBasename', async function testGenerateUniqueBasename() {
	const basename = await generateUniqueBasename({ basePath: cwd(), extension: 'txt' });

	assertEquals(!!basename, true, 'basename');
});
