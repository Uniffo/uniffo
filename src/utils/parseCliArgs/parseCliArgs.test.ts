import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { parseCliArgs } from './parseCliArgs.ts';

Deno.test('parseCliArgs', () => {
	const args = ['should be skiped', '-h', '--help', '--my-argument', 'my value :D', '-r'];

	const parsedArgs = parseCliArgs(args);

	assertEquals(
		Object.keys(parsedArgs).length,
		args.length - 2,
		`compare lengths '${Object.keys(parsedArgs).length}' =? '${args.length - 2}'`,
	);
	assertEquals(
		parsedArgs?.['h'],
		'',
		`compare values of key '${'h'}' -> '${parsedArgs?.['h']}' =? '${''}'`,
	);
	assertEquals(
		parsedArgs?.['help'],
		'',
		`compare values of key '${'help'}' -> '${parsedArgs?.['help']}' =? '${''}'`,
	);
	assertEquals(
		parsedArgs?.['my-argument'],
		args[4],
		`compare values of key '${'my-argument'}' -> '${parsedArgs?.['my-argument']}' =? '${
			args[4]
		}'`,
	);
	assertEquals(
		parsedArgs?.['r'],
		'',
		`compare values of key '${'r'}' -> '${parsedArgs?.['r']}' =? '${''}'`,
	);
	assertEquals(
		parsedArgs?.['random'],
		undefined,
		`compare values of key 'random' -> '${parsedArgs?.['random']}' =? '${undefined}'`,
	);
});
