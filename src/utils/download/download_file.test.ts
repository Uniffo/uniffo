import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { pathExist } from '../path/exist.ts';
import { downloadFile } from './download_file.ts';

Deno.test('downloadFile', async function testDownloadFile() {
	const testUrl =
		'https://user-images.githubusercontent.com/26837876/266847173-447a3630-af21-468f-bc98-b6201bf43f29.png';
	const basename = '266847173-447a3630-af21-468f-bc98-b6201bf43f29.png';
	const testDest = `${Deno.cwd()}/tmp`;

	if (!await pathExist(testDest)) {
		await Deno.mkdir(testDest, { recursive: true });
	}

	await downloadFile({
		url: testUrl,
		destDir: testDest,
		saveToFile: true,
		returnFileContent: false,
	});

	const filename = `${testDest}/${basename}`;

	assertEquals(await pathExist(filename), true, 'file saved');

	Deno.remove(filename);

	await downloadFile({
		url: testUrl,
		destDir: testDest,
		saveToFile: false,
		returnFileContent: false,
	});

	assertEquals(await pathExist(filename), false, 'file not saved');

	const fileContent = await downloadFile({
		url: testUrl,
		destDir: testDest,
		saveToFile: false,
		returnFileContent: false,
	});

	assertEquals(fileContent != undefined, true, 'file content');
});
