import { logger } from '../../services/logger.ts';
import { getRandomId } from '../../utils/random_id/get_random_id.ts';

/* The `classStore` class is a TypeScript class that provides methods for managing a store with
persistent and session data. */
export class classStore {
	private storeName = '';
	private sessionId: ReturnType<typeof this.generateSessionId> = '';

	/**
	 * The function initializes a session by generating a session ID, ensuring the existence of a store,
	 * and updating the store with the session ID.
	 * @param [name=uniffo] - The name parameter is a string that represents the name of the store. By
	 * default, it is set to "uniffo".
	 * @returns If the `sessionId` is already set, then nothing is returned. Otherwise, if the store
	 * exists and is valid, the session with the generated `sessionId` is added to the store and the store
	 * is updated.
	 */
	public init(name = 'uniffo') {
		this.storeName = name;

		this.ensureStore();

		if (this.sessionId) {
			return;
		}

		this.sessionId = this.generateSessionId();

		const store = this.getStore();

		if (store && this.isValidStore()) {
			store.session[this.sessionId] = { _id: this.sessionId };
			this.updateStore(store);
		}

		this.ensureDateOfCreation();
	}

	/**
	 * The function ensures that a date of creation is set in the store for both the persistent and
	 * session data.
	 */
	private ensureDateOfCreation() {
		const store = this.getStore();
		const key = '_createdAt';
		const date = Date.now();

		if (!store.persistent?.[key]) {
			store.persistent[key] = date;
		}

		if (!store.session[this.sessionId]?.[key]) {
			store.session[this.sessionId] = { ...store.session[this.sessionId], [key]: date };
		}

		this.updateStore(store);
	}

	/**
	 * The function generates a unique session ID of a specified length.
	 * @param [idLength=32] - The `idLength` parameter is the length of the session id that will be
	 * generated. It is an optional parameter with a default value of 32.
	 * @returns the generated session id.
	 */
	private generateSessionId(idLength = 32) {
		if (!idLength) {
			throw 'Session id length can not be 0!';
		}

		const store = this.getStore();
		const sessions = Object.keys(store?.session || {});
		let id = '';

		while (sessions.includes(id) || !id) {
			id = getRandomId(idLength);
		}

		return id;
	}

	/**
	 * The function returns an initial store object with two properties, "persistent" and "session", both
	 * of which are empty objects.
	 * @returns an object with two properties: "persistent" and "session". The "persistent" property is an
	 * empty object with keys of type string and values of type string, number, object, boolean, or
	 * undefined. The "session" property is also an empty object with keys of type string and values of
	 * type undefined or an object with keys of type string and values of type string,
	 */
	private getInitialStore() {
		return {
			persistent: {} as { [key: string]: string | number | object | boolean | undefined },
			session: {} as {
				[id: string]: undefined | {
					[key: string]: string | number | object | boolean | undefined;
				};
			},
		};
	}

	/**
	 * The function sets the initial store by updating it with the initial store data.
	 */
	private setInitialStore() {
		this.updateStore(this.getInitialStore());
	}

	/**
	 * The function encodes a value into a JSON string.
	 * @param {T} value - The `value` parameter is the value that you want to encode into a JSON string.
	 * It can be of any type.
	 * @returns The JSON string representation of the value.
	 */
	private encode<T>(value: T) {
		return JSON.stringify(value);
	}

	/**
	 * The `decode` function takes a string value and returns the parsed JSON object or undefined if the
	 * value is empty.
	 * @param {string} value - The `value` parameter is a string that represents the data you want to
	 * decode.
	 * @returns a value of type `T` or `undefined`.
	 */
	private decode<T>(value: string): T | undefined {
		if (!value) {
			return undefined;
		}

		const parsedStore = JSON.parse(value);

		return parsedStore;
	}

	/**
	 * The function retrieves and decodes a store from local storage, throwing errors if the store is
	 * missing, invalid, or undefined.
	 * @returns the decoded store, which is of type `ReturnType<typeof this.getInitialStore>`.
	 */
	private getStore(): ReturnType<typeof this.getInitialStore> {
		const store = localStorage.getItem(this.storeName);

		if (!store) {
			throw 'There is no store!';
		}

		if (!this.isValidStore()) {
			throw 'Store is invalid!';
		}

		const decoded = this.decode<ReturnType<typeof this.getInitialStore>>(store);

		if (!decoded) {
			throw 'Store is undefined!';
		}

		return decoded;
	}

	/**
	 * The function updates the store by encoding it and storing it in the local storage.
	 * @param {T} store - The `store` parameter is a generic type `T` which represents the data that needs
	 * to be stored. It can be any type of data such as objects, arrays, or primitive values.
	 */
	private updateStore<T>(store: T) {
		const encodedStore = this.encode(store);

		localStorage.setItem(this.storeName, encodedStore);
	}

	/**
	 * The function checks if the store retrieved from local storage is valid by verifying that it has
	 * both session and persistent properties.
	 * @returns The function `isValidStore()` returns a boolean value. It returns `true` if the `store`
	 * object is valid, meaning it exists and has both `session` and `persistent` properties. Otherwise,
	 * it returns `false`.
	 */
	private isValidStore() {
		const store = this.decode<ReturnType<typeof this.getInitialStore>>(
			localStorage.getItem(this.storeName) || '',
		);

		if (!store || !store?.session || !store?.persistent) {
			return false;
		}

		return true;
	}

	/**
	 * The function ensures that the store is valid and sets the initial store if it is not.
	 */
	private ensureStore() {
		if (!this.isValidStore()) {
			this.setInitialStore();
		}
	}

	/**
	 * The deleteSession function deletes a session from the store if it is valid and exists.
	 */
	public deleteSession() {
		const store = this.getStore();

		if (this.isValidStore() && store) {
			delete store.session[this.sessionId];
			this.updateStore(store);
		}
	}

	/**
	 * The function clears the persistent data in the store and updates the store object.
	 */
	public clearPersistent() {
		const store = this.getStore();

		if (this.isValidStore() && store) {
			store.persistent = {};
			this.updateStore(store);
		}

		this.ensureDateOfCreation();
	}

	/**
	 * The deleteAll function removes all items from the localStorage with the specified storeName.
	 */
	public deleteAll() {
		localStorage.removeItem(this.storeName);
	}

	/**
	 * The function sets a value in the session storage and updates the store.
	 * @param {string} key - A string representing the key of the session value to be set.
	 * @param {undefined | string | number | object | boolean} value - The `value` parameter can be of
	 * type `undefined`, `string`, `number`, `object`, or `boolean`.
	 */
	public setSessionValue(key: string, value: undefined | string | number | object | boolean) {
		const store = this.getStore();

		store.session[this.sessionId] = { ...store.session[this.sessionId], [key]: value };

		logger.debug(
			`Set session value "${key}":"${
				typeof value === 'string' && !value.length ? value : JSON.stringify(value)
			}"`,
		);

		this.updateStore(store);
	}

	/**
	 * The function sets a persistent value in a store and updates the store.
	 * @param {string} key - A string representing the key for the persistent value.
	 * @param {undefined | string | number | object | boolean} value - The `value` parameter can be of
	 * type `undefined`, `string`, `number`, `object`, or `boolean`.
	 */
	public setPersistentValue(key: string, value: undefined | string | number | object | boolean) {
		const store = this.getStore();

		store.persistent = { ...store.persistent, [key]: value };

		logger.debug(
			`Set persistent value "${key}":"${
				typeof value === 'string' && !value.length ? value : JSON.stringify(value)
			}"`,
		);

		this.updateStore(store);
	}

	/**
	 * The function `getSessionValue` retrieves a value from the session storage based on a given key, or
	 * returns the entire session object if no key is provided.
	 * @param {string} [key] - The `key` parameter is an optional string that represents the specific key
	 * of the value you want to retrieve from the session. If provided, it will return the value
	 * associated with that key. If not provided, it will return the entire session object.
	 * @returns The method is returning the value stored in the session with the specified key, or the
	 * entire session object if no key is provided. The returned value is casted to the generic type `T`.
	 */
	public getSessionValue<T>(key?: string) {
		const store = this.getStore();

		let output;

		if (key) {
			output = store.session[this.sessionId]?.[key];
		} else {
			output = store.session[this.sessionId];
		}

		logger.debug(
			`Get session value "${key}":"${
				typeof output === 'string' && !output.length ? output : JSON.stringify(output)
			}"`,
		);

		return output as T;
	}

	/**
	 * The function `getPersistentValue` retrieves a persistent value from a store, either by a specific
	 * key or all values.
	 * @param {string} [key] - The `key` parameter is an optional string that represents the key of the
	 * persistent value to retrieve from the store. If a `key` is provided, the method will return the
	 * value associated with that key in the `store.persistent` object. If no `key` is provided, the
	 * method will
	 * @returns the value of the persistent store, either the entire store or the value associated with
	 * the specified key. The return type is specified as `T`, which means it can be any type.
	 */
	public getPersistentValue<T>(key?: string) {
		const store = this.getStore();

		let output;

		if (key) {
			output = store.persistent?.[key];
		} else {
			output = store.persistent;
		}

		logger.debug(
			`Get persistent value "${key}":"${
				typeof output === 'string' && !output.length ? output : JSON.stringify(output)
			}"`,
		);

		return output as T;
	}

	/**
	 * The function removes a session key from the store and updates the store.
	 * @param {string} key - The `key` parameter is a string that represents the key of the session
	 * key-value pair that needs to be removed from the session object.
	 */
	public removeSessionKey(key: string) {
		const store = this.getStore();

		delete store.session[this.sessionId]?.[key];

		logger.debug(`Remove session key "${key}"`);

		this.updateStore(store);
	}

	/**
	 * The function removes a persistent key from the store and updates the store.
	 * @param {string} key - The key parameter is a string that represents the key of the persistent data
	 * that needs to be removed from the store.
	 */
	public removePersistentKey(key: string) {
		const store = this.getStore();

		delete store.persistent?.[key];

		logger.debug(`Remove persistent key "${key}"`);

		this.updateStore(store);
	}
}
