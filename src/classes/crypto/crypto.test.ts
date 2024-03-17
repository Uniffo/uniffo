import { assert } from 'https://deno.land/std@0.162.0/_util/assert.ts';
import { logger } from '../../global/logger.ts';
import { classCrypto } from './crypto.ts';

Deno.test('crypto', function testCrypto() {
	const str = 'Super power Cryptography!';

	logger.debug('Var str: ', str);

	const encoded = classCrypto.encode(str);

	logger.debug('Var encoded: ', encoded);

	const decoded = classCrypto.decode(encoded);

	logger.debug('Var decoded: ', decoded);

	assert(str !== encoded, 'encoded result');
	assert(str === decoded, 'decoded result');
});
