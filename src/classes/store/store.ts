import { UNIFFO_DIR } from '../../constants/constants.ts';
import { logger } from '../../services/logger.ts';
import { getRandomId } from '../../utils/random_id/get_random_id.ts';
import { classDocumentStorage } from '../document_storage/document_storage.ts';

/* The `classStore` class is a TypeScript class that provides methods for managing a store with session
and persistent data in local storage. */
export class classStore {
	private storeName = '';
	private sessionId = '';
	private localStorage;
	constructor(dirname = `${UNIFFO_DIR.localStorage}`) {
		this.localStorage = new classDocumentStorage(dirname);
	}

	/**
	 * The `init` function initializes the session by setting up the local storage, generating a session
	 * ID, and updating the store with the session ID.
	 * @param [name=uniffo] - The name parameter is a string that represents the name of the store. By
	 * default, it is set to 'uniffo'.
	 * @returns The code is returning the session ID.
	 */
	public async init(name = 'uniffo') {
		await this.localStorage.init();

		this.storeName = name;

		await this.ensureStore();

		if (this.sessionId) {
			return;
		}

		this.sessionId = await this.generateSessionId();

		const store = await this.getStore();

		if (store && await this.isValidStore()) {
			store.session[this.sessionId] = { _id: this.sessionId };
			await this.updateStore(store);
		}

		await this.ensureDateOfCreation();
	}

	/**
	 * The function `ensureDateOfCreation` updates the store with the current date if the `_createdAt` key
	 * does not exist in the persistent or session storage.
	 */
	private async ensureDateOfCreation() {
		const store = await this.getStore();
		const key = '_createdAt';
		const date = Date.now();

		if (!store.persistent?.[key]) {
			store.persistent[key] = date;
		}

		if (!store.session[this.sessionId]?.[key]) {
			store.session[this.sessionId] = { ...store.session[this.sessionId], [key]: date };
		}

		await this.updateStore(store);
	}

	/**
	 * The function generates a unique session ID of a specified length.
	 * @param [idLength=32] - The idLength parameter is the length of the session id that will be
	 * generated. It is an optional parameter with a default value of 32.
	 * @returns the generated session id.
	 */
	private async generateSessionId(idLength = 32) {
		if (!idLength) {
			throw 'Session id length can not be 0!';
		}

		const store = await this.getStore();
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
	 * The function "setInitialStore" asynchronously updates the store with the initial values.
	 */
	private async setInitialStore() {
		await this.updateStore(this.getInitialStore());
	}

	/**
	 * The function `getStore` retrieves the store from local storage and throws an error if the store is
	 * not found or is invalid.
	 * @returns the value of the `store` variable.
	 */
	private async getStore(): Promise<ReturnType<typeof this.getInitialStore>> {
		const store = await this.localStorage.getItem(this.storeName);

		if (!store) {
			throw 'There is no store!';
		}

		if (!await this.isValidStore()) {
			throw 'Store is invalid!';
		}

		return store;
	}

	/**
	 * The function updates a store in local storage asynchronously.
	 * @param {T} store - The `store` parameter is a generic type `T` representing the data that needs to
	 * be stored in the local storage. It can be any type of data, such as an object, array, or primitive
	 * value.
	 */
	private async updateStore<T>(store: T) {
		await this.localStorage.setItem(this.storeName, store);
	}

	/**
	 * The function checks if a store exists in local storage and has both session and persistent
	 * properties.
	 * @returns a boolean value. It returns true if the store exists and has both a session and persistent
	 * property, otherwise it returns false.
	 */
	private async isValidStore() {
		const store = await this.localStorage.getItem(this.storeName);

		if (!store || !store?.session || !store?.persistent) {
			return false;
		}

		return true;
	}

	/**
	 * The function `ensureStore` checks if the store is valid and sets the initial store if it is not.
	 */
	private async ensureStore() {
		if (!await this.isValidStore()) {
			await this.setInitialStore();
		}
	}

	/**
	 * The function destroys a session by deleting it from the store and calling a method to destroy it in
	 * local storage.
	 */
	public async destroySession() {
		const store = await this.getStore();

		if (await this.isValidStore() && store) {
			delete store.session[this.sessionId];
			await this.updateStore(store);
		}

		await this.localStorage.destroySession();
	}

	/**
	 * The function clears the persistent data in the store and updates the store, while also ensuring the
	 * date of creation.
	 */
	public async clearPersistent() {
		const store = await this.getStore();

		if (await this.isValidStore() && store) {
			store.persistent = {};
			await this.updateStore(store);
		}

		await this.ensureDateOfCreation();
	}

	/**
	 * The function deletes all items from the local storage.
	 */
	public async deleteAll() {
		await this.localStorage.removeItem(this.storeName);
	}

	/**
	 * The function `setSessionValue` sets a value in the session storage and updates the store.
	 * @param {string} key - The key parameter is a string that represents the name of the session value
	 * you want to set. It is used as the property name in the session object.
	 * @param {undefined | string | number | object | boolean} value - The `value` parameter can be of
	 * type `undefined`, `string`, `number`, `object`, or `boolean`.
	 */
	public async setSessionValue(
		key: string,
		value: undefined | string | number | object | boolean,
	) {
		const store = await this.getStore();

		store.session[this.sessionId] = { ...store.session[this.sessionId], [key]: value };

		logger.debug(
			`Set session value "${key}":"${
				typeof value === 'string' && !value.length ? value : JSON.stringify(value)
			}"`,
		);

		await this.updateStore(store);
	}

	/**
	 * The function `setPersistentValue` sets a persistent value in a store and updates the store.
	 * @param {string} key - A string representing the key for the persistent value. This key is used to
	 * identify the value in the store.
	 * @param {undefined | string | number | object | boolean} value - The `value` parameter can be of
	 * type `undefined`, `string`, `number`, `object`, or `boolean`.
	 */
	public async setPersistentValue(
		key: string,
		value: undefined | string | number | object | boolean,
	) {
		const store = await this.getStore();

		store.persistent = { ...store.persistent, [key]: value };

		logger.debug(
			`Set persistent value "${key}":"${
				typeof value === 'string' && !value.length ? value : JSON.stringify(value)
			}"`,
		);

		await this.updateStore(store);
	}

	/**
	 * The function `getSessionValue` retrieves a value from the session store based on a given key, or
	 * returns the entire session if no key is provided.
	 * @param {string} [key] - The `key` parameter is an optional string that represents the specific key
	 * of the session value you want to retrieve. If provided, the function will return the value
	 * associated with that key in the session. If not provided, the function will return the entire
	 * session object.
	 * @returns the value of the session key specified by the `key` parameter, or the entire session
	 * object if `key` is not provided. The return type is specified as `T`, which means it can be any
	 * type.
	 */
	public async getSessionValue<T>(key?: string) {
		const store = await this.getStore();

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
	 * The function `getPersistentValue` retrieves a persistent value from a store and logs the value.
	 * @param {string} [key] - The `key` parameter is an optional string that represents the key of the
	 * persistent value you want to retrieve from the store. If a `key` is provided, the function will
	 * return the value associated with that key in the `store.persistent` object. If no `key` is
	 * provided, the
	 * @returns the value of the `output` variable, which is of type `T`.
	 */
	public async getPersistentValue<T>(key?: string) {
		const store = await this.getStore();

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
	 * key-value pair that needs to be removed from the session.
	 */
	public async removeSessionKey(key: string) {
		const store = await this.getStore();

		delete store.session[this.sessionId]?.[key];

		logger.debug(`Remove session key "${key}"`);

		await this.updateStore(store);
	}

	/**
	 * The function removes a persistent key from a store and updates the store.
	 * @param {string} key - The `key` parameter is a string that represents the key of the persistent
	 * data that needs to be removed from the store.
	 */
	public async removePersistentKey(key: string) {
		const store = await this.getStore();

		delete store.persistent?.[key];

		logger.debug(`Remove persistent key "${key}"`);

		await this.updateStore(store);
	}
}
