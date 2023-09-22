import { logger } from '../../services/logger.ts';
import { getRandomId } from '../../utils/random_id/get_random_id.ts';

export class classStore {
	private storeName;
	private sessionId: ReturnType<typeof this.generateSessionId> = '';

	constructor(name = 'uniffo') {
		this.storeName = name;

		this.ensureStore();
		this.initSession();
		this.ensureDateOfCreation();
	}

	private initSession() {
		if (this.sessionId) {
			return;
		}

		this.sessionId = this.generateSessionId();

		const store = this.getStore();

		if (store && this.isValidStore()) {
			store.session[this.sessionId] = { _id: this.sessionId };
			this.updateStore(store);
		}
	}

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

	private setInitialStore() {
		this.updateStore(this.getInitialStore());
	}

	private encode<T>(value: T) {
		return JSON.stringify(value);
	}

	private decode<T>(value: string): T | undefined {
		if (!value) {
			return undefined;
		}

		const parsedStore = JSON.parse(value);

		return parsedStore;
	}

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

	private updateStore<T>(store: T) {
		const encodedStore = this.encode(store);

		localStorage.setItem(this.storeName, encodedStore);
	}

	private isValidStore() {
		const store = this.decode<ReturnType<typeof this.getInitialStore>>(
			localStorage.getItem(this.storeName) || '',
		);

		if (!store || !store?.session || !store?.persistent) {
			return false;
		}

		return true;
	}

	private ensureStore() {
		if (!this.isValidStore()) {
			this.setInitialStore();
		}
	}

	public deleteSession() {
		const store = this.getStore();

		if (this.isValidStore() && store) {
			delete store.session[this.sessionId];
			this.updateStore(store);
		}
	}

	public clearPersistent() {
		const store = this.getStore();

		if (this.isValidStore() && store) {
			store.persistent = {};
			this.updateStore(store);
		}

		this.ensureDateOfCreation();
	}

	public deleteAll() {
		localStorage.removeItem(this.storeName);
	}

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

	public getSessionValue<T>(key?: string) {
		const store = this.getStore();

		let output;

		if (key) {
			output = store.session[this.sessionId]?.[key];
		} else {
			output = store.session[this.sessionId];
		}

		logger.debug(
			`Get persistent value "${key}":"${
				typeof output === 'string' && !output.length ? output : JSON.stringify(output)
			}"`,
		);

		return output as T;
	}

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

	public removeSessionKey(key: string) {
		const store = this.getStore();

		delete store.session[this.sessionId]?.[key];

		logger.debug(`Remove session key "${key}"`);

		this.updateStore(store);
	}

	public removePersistentKey(key: string) {
		const store = this.getStore();

		delete store.persistent?.[key];

		logger.debug(`Remove persistent key "${key}"`);

		this.updateStore(store);
	}
}
