import { pathExist } from '../path/exist.ts';
import { getRandomId } from '../random_id/get_random_id.ts';

export const generateUniqueBasename = async (args: {
	basePath: string;
	prefix?: string;
	extension?: string;
}) => {
	const { basePath, extension, prefix } = args;
	let candidate = '';
	const startDate = Date.now();
	const timeoutDate = startDate + (1000 * 60 * 5);

	while (!candidate) {
		const basename = `${prefix ? prefix : ''}${getRandomId(16)}${
			extension ? `.${extension}` : ''
		}`;
		const path = `${basePath}/${basename}`;

		if (!await pathExist(path)) {
			candidate = basename;
		}

		if (Date.now() > timeoutDate) {
			throw `Generate unique basename hit a timeout (5 mins)!`;
		}
	}

	return candidate;
};
