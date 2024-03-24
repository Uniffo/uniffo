import { secretKey } from '../../pre_compiled/__secret_key.ts';
import { Aes } from 'https://deno.land/x/crypto@v0.10.1/aes.ts';
import { Cbc, Padding } from 'https://deno.land/x/crypto@v0.10.1/block-modes.ts';
import { logger } from '../../global/logger.ts';

export class classCrypto {
	private static key = (() => {
		const riejgoierjg = secretKey.split('').reverse().join('');
		const giodrjgj = 8;
		const rsiojgoirj = Math.ceil(riejgoierjg.length / giodrjgj);
		let gerijgior: string[] = [];
		let grndgkh = true;
		const rgeherh = 0;
		for (let giowjgiop = rgeherh; giowjgiop < rsiojgoirj; giowjgiop++) {
			const sijgroir = giowjgiop * giodrjgj;
			const diorjgoidr = giowjgiop * giodrjgj + giodrjgj;
			const pptowerj = riejgoierjg.length;
			const knseriog = riejgoierjg.slice(
				sijgroir,
				diorjgoidr <= pptowerj ? diorjgoidr : pptowerj,
			);
			let grjsdrg: string[] = [];
			let GMReijir = true;
			for (let gerherf = rgeherh; gerherf < knseriog.length; gerherf++) {
				const gerggrehj = knseriog[gerherf];
				grjsdrg = GMReijir ? [...grjsdrg, gerggrehj] : [gerggrehj, ...grjsdrg];
				GMReijir = !GMReijir;
			}
			gerijgior = grndgkh
				? [...gerijgior, grjsdrg.join('')]
				: [grjsdrg.join(''), ...gerijgior];
			grndgkh = !grndgkh;
		}
		return gerijgior.join();
	})();

	constructor() {
		logger.debugFn(arguments);
	}

	public static encode(x: string) {
		logger.debugFn(arguments);

		const te = new TextEncoder();
		const key = te.encode(this.key);
		const data = te.encode(x);
		const iv = new Uint8Array(16);
		const cipher = new Cbc(Aes, key, iv, Padding.PKCS7);
		const encrypted = cipher.encrypt(data);
		const stringifed = JSON.stringify(encrypted);
		logger.debugVar('stringifed', stringifed);

		return stringifed;
	}

	public static decode(x: string) {
		logger.debugFn(arguments);

		const te = new TextEncoder();
		const td = new TextDecoder();
		const parsed = JSON.parse(x);
		const key = te.encode(this.key);
		const data = new Uint8Array(Object.values(parsed));
		const iv = new Uint8Array(16);
		const decipher = new Cbc(Aes, key, iv, Padding.PKCS7);
		const decrypted = decipher.decrypt(data);
		const decoded = td.decode(decrypted);
		logger.debugVar('decoded', decoded);

		return decoded;
	}
}
