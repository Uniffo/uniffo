import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { classStore } from './store.ts';
import { getError } from '../../utils/error/get_error.ts';

Deno.test('classStore', async function testClassStore() {
	const store1 = new classStore();
	const store2 = new classStore();

	await store1.init('customStore1');
	await store2.init('customStore2');

	const testStore = async (store: classStore, name: string) => {
		console.log(`Test for store: "${name}"`);

		const persistentCreatedAt = await store.getPersistentValue<number>('_createdAt');
		const sessionCreatedAt = await store.getSessionValue<number>('_createdAt');

		assertEquals(persistentCreatedAt > 0, true, 'persistent created at');
		assertEquals(sessionCreatedAt > 0, true, 'session created at');

		const persistentTestKey = 'sample-test-key';
		const persistentTestValue = 123;

		await store.setPersistentValue(persistentTestKey, persistentTestValue);

		assertEquals(
			await store.getPersistentValue(persistentTestKey) === persistentTestValue,
			true,
			'add persistent value',
		);

		const sessionTestKey = 'key-test-sample';
		const sessionTestValue = 321;

		await store.setSessionValue(sessionTestKey, sessionTestValue);

		assertEquals(
			await store.getSessionValue(sessionTestKey) === sessionTestValue,
			true,
			'add session value',
		);

		await store.removePersistentKey(persistentTestKey);

		assertEquals(
			await store.getPersistentValue(persistentTestKey) === undefined,
			true,
			'remove persistent value',
		);

		await store.removeSessionKey(sessionTestKey);

		assertEquals(
			await store.getSessionValue(sessionTestKey) === undefined,
			true,
			'remove session value',
		);

		assertEquals((await store.getSessionValue<string>('_id')).length > 0, true, 'session id');

		await store.destroySession();

		assertEquals(await store.getSessionValue() == undefined, true, 'delete session');

		await store.clearPersistent();

		assertEquals(
			await store.getPersistentValue('_createdAt') != persistentCreatedAt,
			true,
			'clear persistent',
		);

		await store.deleteAll();

		const noStoreMsg = 'There is no store!';
		const testKey = 'test-key';
		const testValue = 'test-value';

		assertEquals(
			await getError(async () => await store.destroySession()),
			noStoreMsg,
			'deleted store with destroySession()',
		);
		assertEquals(
			await getError(async () => await store.clearPersistent()),
			noStoreMsg,
			'deleted store with clearPersistent()',
		);
		assertEquals(
			await getError(async () => await store.getPersistentValue()),
			noStoreMsg,
			'deleted store with getPersistentValue()',
		);
		assertEquals(
			await getError(async () => await store.getSessionValue()),
			noStoreMsg,
			'deleted store with getSessionValue()',
		);
		assertEquals(
			await getError(async () => await store.removePersistentKey(testKey)),
			noStoreMsg,
			'deleted store with removePersistentKey(testKey)',
		);
		assertEquals(
			await getError(async () => await store.removeSessionKey(testKey)),
			noStoreMsg,
			'deleted store with removeSessionKey(testKey)',
		);
		assertEquals(
			await getError(async () => await store.setPersistentValue(testKey, testValue)),
			noStoreMsg,
			'deleted store with setPersistentValue(testKey, testValue)',
		);
		assertEquals(
			await getError(async () => await store.setSessionValue(testKey, testValue)),
			noStoreMsg,
			'deleted store with setSessionValue(testKey, testValue)',
		);
	};

	await testStore(store1, 'store1');
	await testStore(store2, 'store2');
});
