import { logger } from '../../services/logger.ts';
import { generateUniqueBasename } from '../../utils/file/generate_unique_basename.ts';
import { pathExist } from '../../utils/path/exist.ts';

export class classDocumentStorage {
	private dirname;
	private basename = 'uniffo_ds.txt';
	private basenameLocked = 'uniffo_ds.lock.txt';
	private sessionId = '';
	constructor(dirname: string) {
		this.dirname = dirname;
	}

	public async init() {
		if (!await this.documentExist()) {
			await this.createDocument();
		}

		await this.registerClient();
	}

	public async destroySession() {
		await this.unregisterClient();
	}

	private async createDocument() {
		if (await this.documentExist()) {
			await Deno.remove(this.getDocumentDetails().filename);
		}

		if (!await pathExist(this.getDocumentDetails().dirname)) {
			await Deno.mkdir(this.getDocumentDetails().dirname, { recursive: true });
		}

		return Deno.writeTextFile(this.getDocumentDetails().filename, '');
	}

	private documentExist() {
		const filename = this.getDocumentDetails().filename;
		logger.debug(`Var filename: "${filename}"`);

		return pathExist(filename);
	}

	private getDocumentDetails() {
		return {
			dirname: this.dirname,
			basename: this.basename,
			basenameLocked: this.basenameLocked,
			filename: `${this.dirname}/${this.basename}`,
			filenameLocked: `${this.dirname}/${this.basenameLocked}`,
		};
	}

	private encodeData<T>(data: T) {
		if (data == '') {
			return '';
		}

		return JSON.stringify(data);
	}

	private decodeData(data: string) {
		if (data == '') {
			return '';
		}

		// deno-lint-ignore no-explicit-any
		return JSON.parse(data) as { [key: string]: any };
	}

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

	private async unregisterClient() {
		const path = `${this.getDocumentDetails().dirname}/clients/${this.sessionId}`;

		if (!await pathExist(path)) {
			return;
		}

		await Deno.remove(path, { recursive: true });
	}

	private async getCurrentDocumentClientId() {
		const path = this.getDocumentDetails().filenameLocked;

		if (!await pathExist(path)) {
			return false;
		}

		return Deno.readTextFile(path);
	}

	private isDocumentLocked() {
		return pathExist(this.getDocumentDetails().filenameLocked);
	}

	private async lockDocument() {
		if (await this.isDocumentLocked()) {
			throw `Document already locked by "${await this.getCurrentDocumentClientId()}"!`;
		}

		return Deno.writeTextFile(this.getDocumentDetails().filenameLocked, this.sessionId);
	}

	private async releaseDocumentLock() {
		const currentClientId = await this.getCurrentDocumentClientId();

		if (currentClientId !== this.sessionId) {
			return false;
		}

		return Deno.remove(this.getDocumentDetails().filenameLocked);
	}

	private async getDocument() {
		const filename = this.getDocumentDetails().filename;

		if (!await pathExist(filename)) {
			throw `Document filename doesn't exist "${filename}"!`;
		}

		return Deno.readTextFile(filename);
	}

	private async openDocument() {
		const tick = 100;

		while (await this.isDocumentLocked()) {
			await new Promise((res) => setTimeout(res, tick));
		}

		return await this.lockDocument();
	}

	private async closeDocument() {
		return await this.releaseDocumentLock();
	}

	private async updateDocument(data: string) {
		return await Deno.writeTextFile(this.getDocumentDetails().filename, data);
	}

	// deno-lint-ignore no-explicit-any
	public async setItem(key: string, value: any) {
		await this.openDocument();

		let data = this.decodeData(await this.getDocument());

		if (typeof data != 'object') {
			data = {};
		}

		data[key] = value;

		await this.updateDocument(this.encodeData(data));

		await this.closeDocument();
	}

	public async getItem(key: string) {
		await this.openDocument();

		let data = this.decodeData(await this.getDocument());

		if (typeof data != 'object') {
			data = {};
		}

		const value = data[key];

		await this.closeDocument();

		return value;
	}

	public async removeItem(key: string) {
		await this.openDocument();

		let data = this.decodeData(await this.getDocument());

		if (typeof data != 'object') {
			data = {};
		}

		delete data[key];

		await this.updateDocument(this.encodeData(data));

		await this.closeDocument();
	}
}
