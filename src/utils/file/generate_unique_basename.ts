import { pathExist } from '../path/exist.ts';
import { getRandomId } from '../random_id/get_random_id.ts';

/**
 * The function `generateUniqueBasename` generates a unique basename by appending a random ID to a
 * given prefix and checking if the resulting path already exists.
 * @param args - The `args` parameter is an object that contains the following properties:
 * @returns The function `generateUniqueBasename` returns a promise that resolves to a string value,
 * which is the generated unique basename.
 */
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
