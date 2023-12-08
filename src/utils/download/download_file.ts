import { pathExist } from '../path/exist.ts';

/**
 * The `downloadFile` function is a TypeScript function that downloads a file from a given URL, saves
 * it to a specified directory, and optionally returns the file content.
 * @param arg - The `arg` parameter is an object that contains the following properties:
 * @returns The function `downloadFile` returns an object with the following properties:
 */
export const downloadFile = async (
	arg: { url: string; saveToFile: boolean; destDir: string; returnFileContent: boolean },
) => {
	const { url, destDir, saveToFile, returnFileContent } = arg;
	const req = await fetch(url);

	if (!req.ok) {
		await req.body?.cancel();
		throw `Something went wrong while request to "${url}". Error code: ${req.status}`;
	}

	const contentDisposition = req.headers.get('content-disposition');

	let filename = 'unknown';
	if (contentDisposition) {
		const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);

		if (match && match[1]) {
			filename = match[1].replace(/['"]/g, '');
		}
	} else {
		const candidate = new URL(url).pathname.split('/').slice(-1)[0];

		if (candidate) {
			filename = candidate;
		}
	}

	const contentLength = Number(req.headers.get('content-length'));
	const fileContent = new Uint8Array(contentLength);
	let downloadedBytes = 0;
	const classProgressBar = await import('https://deno.land/x/progress@v1.3.9/mod.ts');
	const progressBar = new classProgressBar.default({
		total: 100,
		interval: 15,
		width: 10,
		display: 'Downloading: :percent :bar t: :time eta: :eta',
	});

	progressBar.render(0);

	if (!req.body) {
		throw `Invalid response body of request to "${url}"`;
	}

	for await (const chunk of req.body) {
		fileContent.set(chunk, downloadedBytes);

		downloadedBytes += chunk.length;

		const progress = Math.floor((downloadedBytes / contentLength) * 100);

		progressBar.render(progress);
	}

	progressBar.end();

	const details: {
		basename: string;
		filename?: string;
		fileContent?: Uint8Array;
	} = {
		basename: filename,
	};

	if (saveToFile) {
		if (!await pathExist(destDir)) {
			await Deno.mkdir(destDir, { recursive: true });
		}

		const filepath = `${destDir}/${filename}`;

		details.filename = filepath;

		if (await pathExist(filepath)) {
			await Deno.remove(filepath);
		}

		await Deno.writeFile(filepath, fileContent);
	}

	if (returnFileContent) {
		details.fileContent = fileContent;
	}

	return details;
};
