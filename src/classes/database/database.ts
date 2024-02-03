import { logger } from '../../services/logger.ts';
import { getRandomId } from '../../utils/random_id/get_random_id.ts';
import { classDocumentStorage } from '../document_storage/document_storage.ts';

/* The `classDatabase` class is a TypeScript class that provides methods for managing a database with session
and persistent data in local storage. */
export class classDatabase {
	private databaseName = '';
	private sessionId = '';
	private localStorage;
	constructor(args: { dirname: string }) {
		this.localStorage = new classDocumentStorage(args.dirname);
	}

	/**
	 * The `init` function initializes the session by setting up the local storage, generating a session
	 * ID, and updating the database with the session ID.
	 * @param [name=uniffo] - The name parameter is a string that represents the name of the database. By
	 * default, it is set to 'uniffo'.
	 * @returns The code is returning the session ID.
	 */
	public async init(name: string) {
		await this.localStorage.init();

		this.databaseName = name;

		await this.ensureDatabase();

		if (this.sessionId) {
			return;
		}

		this.sessionId = await this.generateSessionId();

		const database = await this.getDatabase();

		if (database && await this.isValidDatabase()) {
			database.session[this.sessionId] = { _id: this.sessionId };
			await this.updateDatabase(database);
		}

		await this.ensureDateOfCreation();
	}

	/**
	 * The function `ensureDateOfCreation` updates the database with the current date if the `_createdAt` key
	 * does not exist in the persistent or session storage.
	 */
	private async ensureDateOfCreation() {
		const database = await this.getDatabase();
		const key = '_createdAt';
		const date = Date.now();

		if (!database.persistent?.[key]) {
			database.persistent[key] = date;
		}

		if (!database.session[this.sessionId]?.[key]) {
			database.session[this.sessionId] = { ...database.session[this.sessionId], [key]: date };
		}

		await this.updateDatabase(database);
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

		const database = await this.getDatabase();
		const sessions = Object.keys(database?.session || {});
		let id = '';

		while (sessions.includes(id) || !id) {
			id = getRandomId(idLength);
		}

		return id;
	}

	/**
	 * The function returns an initial database object with two properties, "persistent" and "session", both
	 * of which are empty objects.
	 * @returns an object with two properties: "persistent" and "session". The "persistent" property is an
	 * empty object with keys of type string and values of type string, number, object, boolean, or
	 * undefined. The "session" property is also an empty object with keys of type string and values of
	 * type undefined or an object with keys of type string and values of type string,
	 */
	private getInitialDatabase() {
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
	 * The function "setInitialDatabase" asynchronously updates the database with the initial values.
	 */
	private async setInitialDatabase() {
		await this.updateDatabase(this.getInitialDatabase());
	}

	/**
	 * The function `getDatabase` retrieves the database from local storage and throws an error if the database is
	 * not found or is invalid.
	 * @returns the value of the `database` variable.
	 */
	private async getDatabase(): Promise<ReturnType<typeof this.getInitialDatabase>> {
		const database = await this.localStorage.getItem(this.databaseName);

		if (!database) {
			throw 'There is no database!';
		}

		if (!await this.isValidDatabase()) {
			throw 'Database is invalid!';
		}

		return database;
	}

	/**
	 * The function updates a database in local storage asynchronously.
	 * @param {T} database - The `database` parameter is a generic type `T` representing the data that needs to
	 * be databased in the local storage. It can be any type of data, such as an object, array, or primitive
	 * value.
	 */
	private async updateDatabase<T>(database: T) {
		await this.localStorage.setItem(this.databaseName, database);
	}

	/**
	 * The function checks if a database exists in local storage and has both session and persistent
	 * properties.
	 * @returns a boolean value. It returns true if the database exists and has both a session and persistent
	 * property, otherwise it returns false.
	 */
	private async isValidDatabase() {
		const database = await this.localStorage.getItem(this.databaseName);

		if (!database || !database?.session || !database?.persistent) {
			return false;
		}

		return true;
	}

	/**
	 * The function `ensureDatabase` checks if the database is valid and sets the initial database if it is not.
	 */
	private async ensureDatabase() {
		if (!await this.isValidDatabase()) {
			await this.setInitialDatabase();
		}
	}

	/**
	 * The function destroys a session by deleting it from the database and calling a method to destroy it in
	 * local storage.
	 */
	public async destroySession() {
		const database = await this.getDatabase();

		if (await this.isValidDatabase() && database) {
			delete database.session[this.sessionId];
			await this.updateDatabase(database);
		}

		await this.localStorage.destroySession();
	}

	/**
	 * The function clears the persistent data in the database and updates the database, while also ensuring the
	 * date of creation.
	 */
	public async clearPersistent() {
		const database = await this.getDatabase();

		if (await this.isValidDatabase() && database) {
			database.persistent = {};
			await this.updateDatabase(database);
		}

		await this.ensureDateOfCreation();
	}

	/**
	 * The function deletes all items from the local storage.
	 */
	public async deleteAll() {
		await this.localStorage.removeItem(this.databaseName);
	}

	/**
	 * The function `setSessionValue` sets a value in the session storage and updates the database.
	 * @param {string} key - The key parameter is a string that represents the name of the session value
	 * you want to set. It is used as the property name in the session object.
	 * @param {undefined | string | number | object | boolean} value - The `value` parameter can be of
	 * type `undefined`, `string`, `number`, `object`, or `boolean`.
	 */
	public async setSessionValue(
		key: string,
		value: undefined | string | number | object | boolean,
	) {
		const database = await this.getDatabase();

		database.session[this.sessionId] = { ...database.session[this.sessionId], [key]: value };

		logger.debug(
			`Set session value "${key}":"${
				typeof value === 'string' && !value.length ? value : JSON.stringify(value)
			}"`,
		);

		await this.updateDatabase(database);
	}

	/**
	 * The function `setPersistentValue` sets a persistent value in a database and updates the database.
	 * @param {string} key - A string representing the key for the persistent value. This key is used to
	 * identify the value in the database.
	 * @param {undefined | string | number | object | boolean} value - The `value` parameter can be of
	 * type `undefined`, `string`, `number`, `object`, or `boolean`.
	 */
	public async setPersistentValue(
		key: string,
		value: undefined | string | number | object | boolean,
	) {
		const database = await this.getDatabase();

		database.persistent = { ...database.persistent, [key]: value };

		logger.debug(
			`Set persistent value "${key}":"${
				typeof value === 'string' && !value.length ? value : JSON.stringify(value)
			}"`,
		);

		await this.updateDatabase(database);
	}

	/**
	 * The function `getSessionValue` retrieves a value from the session database based on a given key, or
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
		const database = await this.getDatabase();

		let output;

		if (key) {
			output = database.session[this.sessionId]?.[key];
		} else {
			output = database.session[this.sessionId];
		}

		logger.debug(
			`Get session value "${key}":"${
				typeof output === 'string' && !output.length ? output : JSON.stringify(output)
			}"`,
		);

		return output as T;
	}

	/**
	 * The function `getPersistentValue` retrieves a persistent value from a database and logs the value.
	 * @param {string} [key] - The `key` parameter is an optional string that represents the key of the
	 * persistent value you want to retrieve from the database. If a `key` is provided, the function will
	 * return the value associated with that key in the `database.persistent` object. If no `key` is
	 * provided, the
	 * @returns the value of the `output` variable, which is of type `T`.
	 */
	public async getPersistentValue<T>(key?: string) {
		const database = await this.getDatabase();

		let output;

		if (key) {
			output = database.persistent?.[key];
		} else {
			output = database.persistent;
		}

		logger.debug(
			`Get persistent value "${key}":"${
				typeof output === 'string' && !output.length ? output : JSON.stringify(output)
			}"`,
		);

		return output as T;
	}

	/**
	 * The function removes a session key from the database and updates the database.
	 * @param {string} key - The `key` parameter is a string that represents the key of the session
	 * key-value pair that needs to be removed from the session.
	 */
	public async removeSessionKey(key: string) {
		const database = await this.getDatabase();

		delete database.session[this.sessionId]?.[key];

		logger.debug(`Remove session key "${key}"`);

		await this.updateDatabase(database);
	}

	/**
	 * The function removes a persistent key from a database and updates the database.
	 * @param {string} key - The `key` parameter is a string that represents the key of the persistent
	 * data that needs to be removed from the database.
	 */
	public async removePersistentKey(key: string) {
		const database = await this.getDatabase();

		delete database.persistent?.[key];

		logger.debug(`Remove persistent key "${key}"`);

		await this.updateDatabase(database);
	}
}
