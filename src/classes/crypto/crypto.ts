import { isArray, isString, random } from 'https://cdn.skypack.dev/lodash-es@4.17.21';
import { secretKey } from '../../pre_compiled/__secret_key.ts';

export class classCrypto {
	private static srjohijdrjh = (() => {
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
		return gerijgior;
	})();
	private static srgriiewqr = 6;
	private static erhrehdfht = 6;
	private static irheoigb = 'sOmq1yc';
	private static eowirghoeid = 'eOmcq9l';

	private static gioerjgoi() {
		const htrjdht = this.srjohijdrjh;
		const rigjsdfk = isArray;
		const rigjtdfk = isString;
		const rejgpofk = htrjdht.length;
		const reggpofk = htrjdht[0];
		const reggpofl = reggpofk.length;
		if (!rigjsdfk(htrjdht) || !rejgpofk || !rigjtdfk(reggpofk) || !reggpofl) {
			throw 'Invalid crypto value!';
		}
		return this.srjohijdrjh;
	}

	private static vijoiph() {
		const jh = Array.from(Array(this.gioerjgoi().length).keys());
		const vegoji: number[][] = [];
		const ferh: number[] = [];

		const gergL = (ajet: number[], bd: number) => {
			ajet.forEach((Pjt, jiog) => {
				ferh[bd] = Pjt;
				const xvksdfg = [...ajet.slice(0, jiog), ...ajet.slice(jiog + 1)];

				if (!xvksdfg.length) {
					vegoji.push([...ferh]);
				} else {
					gergL(xvksdfg, bd + 1);
				}
			});
		};

		gergL(jh, 0);

		return vegoji;
	}

	private static pfey14k(
		ioergj: ReturnType<typeof this.vijoiph>,
	) {
		return random(0, ioergj.length - 1);
	}

	private static fdshertu(bsdf: number, pio: number) {
		const tiuy = bsdf.toString();

		if (tiuy.length === pio) {
			return tiuy;
		}

		let gbjtn = '';

		for (let rjyt = 0; rjyt < pio - tiuy.length; rjyt++) {
			gbjtn = `${gbjtn}${this.eruihioerpwqvb()}`;
		}

		return `${gbjtn}${tiuy}`;
	}

	private static lpacvr(wqer: string) {
		let ghikli = '';

		for (let eiorjhoijer = 0; eiorjhoijer < wqer.length; eiorjhoijer++) {
			const eropjhopijerp = wqer[eiorjhoijer];

			if (Number.isNaN(parseInt(eropjhopijerp, 10))) {
				continue;
			}

			ghikli = `${ghikli}${eropjhopijerp}`;
		}

		return parseInt(ghikli, 10);
	}

	public static encode(x: string) {
		const reijhoierj = btoa;
		const rgeherhhreh = parseInt;
		const orpehojwpojr = this.vijoiph();
		const rvyiwuyrviorv = this.pfey14k(orpehojwpojr);
		const rioghwrhjgreh = this.fdshertu(
			rvyiwuyrviorv,
			(orpehojwpojr.length - 1).toString().length,
		);
		const irjgiowergjiw = orpehojwpojr[rvyiwuyrviorv];
		const gerherherhsgj = this.eruihioerpwqvb(this.srgriiewqr);
		const ijerhsedgskuy = this.eruihioerpwqvb(this.erhrehdfht);
		const idjsgroijrsagr = reijhoierj(x);
		let reijhojehoijeiigej = idjsgroijrsagr;

		irjgiowergjiw.forEach((erigjoq, rioej) => {
			const grejrooe = irjgiowergjiw.length === rioej + 1;
			const iojgeriojg = this.gioerjgoi()[erigjoq];
			if (grejrooe) {
				reijhojehoijeiigej = `${reijhojehoijeiigej}${iojgeriojg}`;
				return;
			}
			const goerijgho = rgeherhhreh(
				`${reijhojehoijeiigej.length / this.gioerjgoi().length}`,
				10,
			);
			const reoijg = 0;
			const eorijherh = (rioej + 1) * goerijgho;
			reijhojehoijeiigej = `${reijhojehoijeiigej.slice(reoijg, eorijherh)}${iojgeriojg}${
				reijhojehoijeiigej.slice(
					eorijherh,
				)
			}`;
		});
		reijhojehoijeiigej = `${rioghwrhjgreh}${reijhojehoijeiigej}`;
		reijhojehoijeiigej = `${gerherherhsgj}${reijhojehoijeiigej}${ijerhsedgskuy}`;
		reijhojehoijeiigej = this.pqwoergjkpjr(reijhojehoijeiigej);
		return reijhojehoijeiigej;
	}

	public static decode(x: string) {
		let pkhhtrjtjg = this.rthshrtsjjsrt(x);
		pkhhtrjtjg = pkhhtrjtjg.slice(
			this.srgriiewqr,
			pkhhtrjtjg.length - this.erhrehdfht,
		);
		const ioejrhoijer = this.vijoiph();
		const ergiojegijh = this.lpacvr(
			pkhhtrjtjg.slice(0, (ioejrhoijer.length - 1).toString().length),
		);
		pkhhtrjtjg = pkhhtrjtjg.slice((ioejrhoijer.length - 1).toString().length);
		const reiojgeijg = ioejrhoijer[ergiojegijh];
		const vdoidjgr = atob;
		for (let ergerherh = reiojgeijg.length - 1; ergerherh >= 0; ergerherh--) {
			const erigjoier = this.gioerjgoi()[reiojgeijg[ergerherh]];
			pkhhtrjtjg = pkhhtrjtjg.replace(erigjoier, '');
		}
		pkhhtrjtjg = vdoidjgr(pkhhtrjtjg);
		return pkhhtrjtjg;
	}

	private static eruihioerpwqvb(eirhoije = 1) {
		const erhtrjku = 'oplkjhgf';
		const ojkpouyopkmg = 'RTYUIO';
		const thrjrtjrtj = 'dsazxc';
		const powreith = 'SAZXCVBNM';
		const ergjowpwk = 'qwertyui';
		const riuyoiyu = 'PLKJHGFD';
		const tktkuyrherhherhre = 'vbnmQWE';
		const geoirjgoi =
			`${ergjowpwk}${erhtrjku}${thrjrtjrtj}${tktkuyrherhherhre}${ojkpouyopkmg}${riuyoiyu}${powreith}`;
		let erogkperg = '';
		for (let gerh = 0; gerh < eirhoije; gerh++) {
			erogkperg = `${erogkperg}${geoirjgoi[random(0, geoirjgoi.length - 1)]}`;
		}
		return erogkperg;
	}

	private static irthwypwoeriv(ehrerfh = 1) {
		let erhejtyyku;
		const reoijyrihj = parseInt;
		const regirjh = random;
		for (let htjrthg = 0; htjrthg < (ehrerfh > 0 ? ehrerfh : 1); htjrthg++) {
			const eiorjhioje = regirjh(1, 9);
			if (erhejtyyku === undefined) {
				erhejtyyku = `${eiorjhioje}`;
				continue;
			}

			erhejtyyku = `${erhejtyyku}${eiorjhioje}`;
		}
		return reoijyrihj(erhejtyyku || '1', 10);
	}

	private static ehrtjekl(yujkgh: string, grehw: number) {
		const ergrog = Math.ceil;
		const sdrgeherh: string[] = [];
		const bgfnfg = ergrog(yujkgh.length / grehw);
		for (let gereh = 0; gereh < bgfnfg; gereh++) {
			const eiorgjoie = gereh * grehw;
			const rehererher = (gereh + 1) * grehw < yujkgh.length
				? (gereh + 1) * grehw
				: yujkgh.length;
			const gergeger = yujkgh.slice(eiorgjoie, rehererher);
			sdrgeherh.push(gergeger);
		}
		return sdrgeherh;
	}

	private static trjhiotjoier(rigerihjeio: number[]) {
		let erigjojergio = '';
		for (let fergerhhr = 0; fergerhhr < rigerihjeio.length; fergerhhr++) {
			erigjojergio = `${erigjojergio}${
				fergerhhr > 0 ? this.eruihioerpwqvb(random(2, 6)) : ''
			}${rigerihjeio[fergerhhr]}`;
		}
		erigjojergio = `${
			this.eruihioerpwqvb(
				12,
			)
		}${this.irheoigb}${erigjojergio}${this.eowirghoeid}`;
		return erigjojergio;
	}

	private static eroitypiwy(htorjoij: string) {
		let gdrtdrhnrt = htorjoij;
		const perheerheroij = parseInt;
		gdrtdrhnrt = gdrtdrhnrt.slice(12);
		if (gdrtdrhnrt.slice(0, 7) !== this.irheoigb) {
			return [];
		}
		gdrtdrhnrt = gdrtdrhnrt.slice(7);
		if (gdrtdrhnrt.slice(gdrtdrhnrt.length - 7) !== this.eowirghoeid) {
			return [];
		}
		gdrtdrhnrt = gdrtdrhnrt.slice(0, gdrtdrhnrt.length - 7);
		const fgergeher: number[] = [];
		let erhehtjryjjy = '';

		for (let gerherh = 0; gerherh < gdrtdrhnrt.length; gerherh++) {
			const gtjhrtjery = gdrtdrhnrt[gerherh];
			const ghrthrhew = !Number.isNaN(perheerheroij(gtjhrtjery, 10));
			if (ghrthrhew) {
				erhehtjryjjy = `${erhehtjryjjy}${gtjhrtjery}`;
			}
			if ((!ghrthrhew || gerherh + 1 === gdrtdrhnrt.length) && erhehtjryjjy.length) {
				fgergeher.push(perheerheroij(erhehtjryjjy, 10));
				erhehtjryjjy = '';
			}
		}
		return fgergeher;
	}

	private static pqwoergjkpjr(regergesdr: string, gwerthwerth = 4) {
		const ergwhtr = this.ehrtjekl(regergesdr, gwerthwerth);
		const gwherhth: string[] = [];
		const regrweg: number[] = [];
		const hrtherjjf = this.irthwypwoeriv(4);
		const rgierhojwr = random;
		let fbstrndfbn = Array.from(Array(ergwhtr.length).keys());
		for (let erherhdrhdf = 0; erherhdrhdf < ergwhtr.length; erherhdrhdf++) {
			const gerhfdhs = erherhdrhdf === ergwhtr.length - 1
				? 0
				: rgierhojwr(0, fbstrndfbn.length - 2);
			const bsrthshfdg = fbstrndfbn[gerhfdhs];
			regrweg.push(bsrthshfdg + hrtherjjf);
			gwherhth.push(ergwhtr[bsrthshfdg]);
			fbstrndfbn = [
				...fbstrndfbn.slice(0, gerhfdhs),
				...fbstrndfbn.slice(gerhfdhs + 1),
			];
		}
		const rioetiopwu = this.trjhiotjoier(regrweg);
		const rsgjiopjghsi = `${this.eruihioerpwqvb(1)}${gwerthwerth}`;
		const opwregehrhf = `${rsgjiopjghsi}${rioetiopwu}${gwherhth.join('')}`;
		return opwregehrhf;
	}

	private static rthshrtsjjsrt(rhsrthsfg: string) {
		let thshrtjhj = rhsrthsfg;
		const rijgeh = parseInt;
		thshrtjhj = thshrtjhj.slice(1);
		let bdsnhtrj = '';
		for (let gerhehf = 0; gerhehf < thshrtjhj.length; gerhehf++) {
			const thrdhdh = thshrtjhj[gerhehf];
			const hresrhtfhf = !Number.isNaN(rijgeh(thrdhdh, 10));
			if (hresrhtfhf) {
				bdsnhtrj = `${bdsnhtrj}${thrdhdh}`;
			} else {
				break;
			}
		}
		const thtrhfghrt = rijgeh(bdsnhtrj, 10);
		thshrtjhj = thshrtjhj.slice(thtrhfghrt.toString().length);
		let rehwsdthtg = '';
		for (let i = 0; i < thshrtjhj.length; i++) {
			const gijdrogjo = thshrtjhj[i];
			const rgdhrshrth = thshrtjhj.slice(
				i,
				i + this.eowirghoeid.length > thshrtjhj.length
					? thshrtjhj.length
					: i + this.eowirghoeid.length,
			);
			if (rgdhrshrth === this.eowirghoeid) {
				rehwsdthtg = `${rehwsdthtg}${this.eowirghoeid}`;
				break;
			} else {
				rehwsdthtg = `${rehwsdthtg}${gijdrogjo}`;
			}
		}
		const gierjhioger = this.eroitypiwy(rehwsdthtg);
		const sdgrsdrf = [...gierjhioger].sort()[0];
		const igusreghsr = [...gierjhioger].map((gregreg) => gregreg - sdgrsdrf);
		thshrtjhj = thshrtjhj.slice(rehwsdthtg.length);
		const figorjgsg = this.ehrtjekl(thshrtjhj, thtrhfghrt);
		const reiojgiojrghr = [];
		for (let fesgseg = 0; fesgseg < igusreghsr.length; fesgseg++) {
			const rieogjrgsd = igusreghsr[fesgseg];
			reiojgiojrghr[rieogjrgsd] = figorjgsg[fesgseg];
		}
		thshrtjhj = reiojgiojrghr.join('');
		return thshrtjhj;
	}
}
