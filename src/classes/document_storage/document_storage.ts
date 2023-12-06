import { logger } from '../../services/logger.ts';
import { generateUniqueBasename } from '../../utils/file/generate_unique_basename.ts';
import { pathExist } from '../../utils/path/exist.ts';

/* The `classDocumentStorage` is a TypeScript class that provides methods for creating, managing, and
manipulating a document storage system. */
export class classDocumentStorage {
	private dirname;
	private basename = 'uniffo_ds.txt';
	private basenameLocked = 'uniffo_ds.lock.txt';
	private sessionId = '';
	private destroyed = true;

	/**
	 * The constructor function initializes the value of the "dirname" property.
	 * @param {string} dirname - A string representing the name of the directory.
	 */
	constructor(dirname: string) {
		this.dirname = dirname;
	}

	/**
	 * The `init` function initializes the object by checking if a document exists, creating one if it
	 * doesn't, and then registering the client.
	 */
	public async init() {
		this.destroyed = false;

		if (!await this.documentExist()) {
			await this.createDocument();
		}

		await this.registerClient();
	}

	/**
	 * The function "destroySession" destroys the current session by unregistering the client, resetting
	 * the session ID, and setting the "destroyed" flag to true.
	 */
	public async destroySession() {
		await this.unregisterClient();

		this.sessionId = '';
		this.destroyed = true;
	}

	/**
	 * The function prevents accessing a destroyed document storage session and throws an error if the
	 * session is not initialized.
	 */
	private preventDestroyedSession() {
		if (this.destroyed) {
			throw 'Document storage session is destroyed! First initialize session!';
		}
	}

	/**
	 * The function creates a new document by removing any existing document with the same name, creating
	 * the necessary directory if it doesn't exist, and then writing an empty text file.
	 * @returns The `createDocument()` function is returning a promise that resolves to the result of
	 * `Deno.writeTextFile(this.getDocumentDetails().filename, '')`.
	 */
	private async createDocument() {
		if (await this.documentExist()) {
			await Deno.remove(this.getDocumentDetails().filename);
		}

		if (!await pathExist(this.getDocumentDetails().dirname)) {
			await Deno.mkdir(this.getDocumentDetails().dirname, { recursive: true });
		}

		return Deno.writeTextFile(this.getDocumentDetails().filename, '');
	}

	/**
	 * The function checks if a document exists by retrieving its filename and using the pathExist
	 * function.
	 * @returns the result of the `pathExist(filename)` function call.
	 */
	private documentExist() {
		const filename = this.getDocumentDetails().filename;
		logger.debug(`Var filename: "${filename}"`);

		return pathExist(filename);
	}

	/**
	 * The function returns an object containing various details about a document, such as the directory
	 * name, base name, locked base name, and file name.
	 * @returns an object with the following properties:
	 */
	private getDocumentDetails() {
		return {
			dirname: this.dirname,
			basename: this.basename,
			basenameLocked: this.basenameLocked,
			filename: `${this.dirname}/${this.basename}`,
			filenameLocked: `${this.dirname}/${this.basenameLocked}`,
		};
	}

	/**
	 * The function encodes data into a JSON string format.
	 * @param {T} data - The `data` parameter is a generic type `T` which represents any type of data that
	 * can be passed to the `encodeData` function.
	 * @returns the JSON string representation of the input data.
	 */
	private encodeData<T>(data: T) {
		if (data == '') {
			return '';
		}

		return JSON.stringify(data);
	}

	/**
	 * The function decodes a string of data into a JavaScript object using JSON parsing.
	 * @param {string} data - The `data` parameter is a string that represents encoded data.
	 * @returns the decoded data as an object with string keys and any values.
	 */
	private decodeData(data: string) {
		if (data == '') {
			return '';
		}

		// deno-lint-ignore no-explicit-any
		return JSON.parse(data) as { [key: string]: any };
	}

	/**
	 * The function `registerClient` generates a unique basename for a client and creates a directory for
	 * the client using that basename.
	 */
	private async registerClient() {
		const clientBasename = await generateUniqueBasename({
			basePath: `${this.getDocumentDetails().dirname}/clients`,
			prefix: `client_`,
		});

		this.sessionId = clientBasename;

		await Deno.mkdir(`${this.getDocumentDetails().dirname}/clients/${this.sessionId}`, {
			recursive: true,
		});
	}

	/**
	 * The `unregisterClient` function removes a client directory associated with the current session if
	 * it exists.
	 * @returns If the path does not exist, nothing is returned. If the path exists and is successfully
	 * removed, nothing is returned.
	 */
	private async unregisterClient() {
		this.preventDestroyedSession();

		const path = `${this.getDocumentDetails().dirname}/clients/${this.sessionId}`;

		if (!await pathExist(path)) {
			return;
		}

		await Deno.remove(path, { recursive: true });
	}

	/**
	 * The function `getCurrentDocumentClientId` returns the text content of a file specified by the
	 * `filenameLocked` property of the document details, if the file exists.
	 * @returns either `false` if the path does not exist, or the text content of the file at the given
	 * path.
	 */
	private async getCurrentDocumentClientId() {
		const path = this.getDocumentDetails().filenameLocked;

		if (!await pathExist(path)) {
			return false;
		}

		return Deno.readTextFile(path);
	}

	/**
	 * The function checks if a document is locked by checking if a specific file exists.
	 * @returns The method is returning the result of the pathExist() function, which checks if the file
	 * specified by this.getDocumentDetails().filenameLocked exists.
	 */
	private isDocumentLocked() {
		return pathExist(this.getDocumentDetails().filenameLocked);
	}

	/**
	 * The `lockDocument` function prevents a destroyed session, checks if the document is already locked,
	 * and writes the session ID to a locked file.
	 * @returns a promise that resolves to the result of writing the session ID to a locked document file.
	 */
	private async lockDocument() {
		this.preventDestroyedSession();

		if (await this.isDocumentLocked()) {
			throw `Document already locked by "${await this.getCurrentDocumentClientId()}"!`;
		}
		logger.debug(`-------------- ADD lock`);

		return Deno.writeTextFile(this.getDocumentDetails().filenameLocked, this.sessionId);
	}

	/**
	 * The function `releaseDocumentLock` releases the lock on a document file if the current client ID
	 * matches the session ID.
	 * @returns a boolean value. If the current client ID is not equal to the session ID, it will return
	 * false. Otherwise, it will attempt to remove the locked filename and return the result of that
	 * operation.
	 */
	private async releaseDocumentLock() {
		this.preventDestroyedSession();

		const currentClientId = await this.getCurrentDocumentClientId();

		if (currentClientId !== this.sessionId) {
			return false;
		}

		logger.debug(`-------------- Remove lock`);

		return Deno.remove(this.getDocumentDetails().filenameLocked);
	}

	/**
	 * The function `getDocument` reads the contents of a file specified by the `filename` property of
	 * `getDocumentDetails`, and throws an error if the file does not exist.
	 * @returns the contents of the document file as a string.
	 */
	private async getDocument() {
		const filename = this.getDocumentDetails().filename;

		if (!await pathExist(filename)) {
			throw `Document filename doesn't exist "${filename}"!`;
		}

		return Deno.readTextFile(filename);
	}

	/**
	 * The function "openDocument" waits for the document to be unlocked and then locks it before
	 * returning.
	 * @returns the result of the `lockDocument()` function call.
	 */
	private async openDocument() {
		const tick = 100;

		while (await this.isDocumentLocked()) {
			await new Promise((res) => setTimeout(res, tick));
		}

		return await this.lockDocument();
	}

	/**
	 * The closeDocument function releases the document lock.
	 * @returns The method is returning the result of the `releaseDocumentLock()` method, which is awaited
	 * using the `await` keyword.
	 */
	private async closeDocument() {
		return await this.releaseDocumentLock();
	}

	/**
	 * The function updates a document by writing the provided data to a file.
	 * @param {string} data - The `data` parameter is a string that represents the content that you want
	 * to write to a file.
	 * @returns The `updateDocument` function is returning a promise that resolves to the result of
	 * writing the provided `data` to a text file.
	 */
	private async updateDocument(data: string) {
		return await Deno.writeTextFile(this.getDocumentDetails().filename, data);
	}

	/**
	 * The `setItem` function sets a value for a given key in a document, encoding and decoding the data
	 * as necessary.
	 * @param {string} key - A string representing the key of the item to be stored in the document.
	 * @param {any} value - The `value` parameter is the value that you want to store in the document with
	 * the specified key. It can be of any type.
	 */
	// deno-lint-ignore no-explicit-any
	public async setItem(key: string, value: any) {
		await this.openDocument();

		// deno-lint-ignore no-explicit-any
		let data = {} as { [key: string]: any };

		try {
			const decodeData = this.decodeData(await this.getDocument());

			if (typeof decodeData == 'object') {
				data = decodeData;
			}

			data[key] = value;

			await this.updateDocument(this.encodeData(data));
		} catch (err) {
			await this.closeDocument();
			throw err;
		}

		await this.closeDocument();
	}

	/**
	 * The function `getItem` retrieves a value from a document by its key.
	 * @param {string} key - The `key` parameter is a string that represents the key of the item you want
	 * to retrieve from the data object.
	 * @returns The value associated with the given key is being returned.
	 */
	public async getItem(key: string) {
		await this.openDocument();

		// deno-lint-ignore no-explicit-any
		let data = {} as { [key: string]: any };

		try {
			const decodeData = this.decodeData(await this.getDocument());

			if (typeof decodeData == 'object') {
				data = decodeData;
			}
		} catch (err) {
			await this.closeDocument();
			throw err;
		}

		const value = data[key];

		await this.closeDocument();

		return value;
	}

	/**
	 * The `removeItem` function removes an item from a document by its key.
	 * @param {string} key - The `key` parameter is a string that represents the key of the item that you
	 * want to remove from the data object.
	 */
	public async removeItem(key: string) {
		await this.openDocument();

		// deno-lint-ignore no-explicit-any
		let data = {} as { [key: string]: any };

		try {
			const decodeData = this.decodeData(await this.getDocument());

			if (typeof decodeData == 'object') {
				data = decodeData;
			}

			delete data[key];

			await this.updateDocument(this.encodeData(data));
		} catch (err) {
			await this.closeDocument();
			throw err;
		}

		await this.closeDocument();
	}
}
