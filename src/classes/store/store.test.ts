import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { classStore } from './store.ts';
import { getError } from '../../utils/error/get_error.ts';

Deno.test('classStore', function testClassStore() {
	const store1 = new classStore();
	const store2 = new classStore('customStore');

	const testStore = (store: classStore, name: string) => {
		console.log(`Test for store: "${name}"`);

		const persistentCreatedAt = store.getPersistentValue<number>('_createdAt');
		const sessionCreatedAt = store.getSessionValue<number>('_createdAt');

		assertEquals(persistentCreatedAt > 0, true, 'persistent created at');
		assertEquals(sessionCreatedAt > 0, true, 'session created at');

		const persistentTestKey = 'sample-test-key';
		const persistentTestValue = 123;

		store.setPersistentValue(persistentTestKey, persistentTestValue);

		assertEquals(
			store.getPersistentValue(persistentTestKey) === persistentTestValue,
			true,
			'add persistent value',
		);

		const sessionTestKey = 'key-test-sample';
		const sessionTestValue = 321;

		store.setSessionValue(sessionTestKey, sessionTestValue);

		assertEquals(
			store.getSessionValue(sessionTestKey) === sessionTestValue,
			true,
			'add session value',
		);

		store.removePersistentKey(persistentTestKey);

		assertEquals(
			store.getPersistentValue(persistentTestKey) === undefined,
			true,
			'remove persistent value',
		);

		store.removeSessionKey(sessionTestKey);

		assertEquals(
			store.getSessionValue(sessionTestKey) === undefined,
			true,
			'remove session value',
		);

		assertEquals(store.getSessionValue<string>('_id').length > 0, true, 'session id');

		store.deleteSession();

		assertEquals(store.getSessionValue() == undefined, true, 'delete session');

		store.clearPersistent();

		assertEquals(
			store.getPersistentValue('_createdAt') != persistentCreatedAt,
			true,
			'clear persistent',
		);

		store.deleteAll();

		const noStoreMsg = 'There is no store!';
		const testKey = 'test-key';
		const testValue = 'test-value';

		assertEquals(
			getError(() => store.deleteSession()),
			noStoreMsg,
			'deleted store with deleteSession()',
		);
		assertEquals(
			getError(() => store.clearPersistent()),
			noStoreMsg,
			'deleted store with clearPersistent()',
		);
		assertEquals(
			getError(() => store.getPersistentValue()),
			noStoreMsg,
			'deleted store with getPersistentValue()',
		);
		assertEquals(
			getError(() => store.getSessionValue()),
			noStoreMsg,
			'deleted store with getSessionValue()',
		);
		assertEquals(
			getError(() => store.removePersistentKey(testKey)),
			noStoreMsg,
			'deleted store with removePersistentKey(testKey)',
		);
		assertEquals(
			getError(() => store.removeSessionKey(testKey)),
			noStoreMsg,
			'deleted store with removeSessionKey(testKey)',
		);
		assertEquals(
			getError(() => store.setPersistentValue(testKey, testValue)),
			noStoreMsg,
			'deleted store with setPersistentValue(testKey, testValue)',
		);
		assertEquals(
			getError(() => store.setSessionValue(testKey, testValue)),
			noStoreMsg,
			'deleted store with setSessionValue(testKey, testValue)',
		);
	};

	testStore(store1, 'store1');
	testStore(store2, 'store2');
});
