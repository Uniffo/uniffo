import { logger } from './services/logger.ts';
import { pathExist } from './utils/path/exist.ts';
import { cwd } from './utils/workdir/cwd.ts';

await (async function testCoverageReport() {
	const testCoverageDir = `${cwd()}/.test_coverage`;
	const testCoverageLcovFilename = `${cwd()}/test-coverage.lcov`;
	const testCoverageReportDir = `${cwd()}/.test_coverage_report`;

	const removeTestCoverageFiles = async () => {
		if (await pathExist(testCoverageDir)) {
			logger.info('Remove current coverage directory');
			await Deno.remove(testCoverageDir, { recursive: true });
		}
	};
	const removeTestCoverageReportFiles = async () => {
		if (await pathExist(testCoverageReportDir)) {
			logger.info('Remove current coverage report files');
			await Deno.remove(testCoverageReportDir, { recursive: true });
		}
	};
	const removeTestCoverageLcovFile = async () => {
		if (await pathExist(testCoverageLcovFilename)) {
			logger.info('Remove current coverage lcov file');
			await Deno.remove(testCoverageLcovFilename, { recursive: true });
		}
	};
	const denoCommand = async (options: Deno.CommandOptions) => {
		logger.info(`Execute deno command ${options.args ? `"${options.args.join(' ')}"` : ''}`);

		const command = new Deno.Command(Deno.execPath(), options);

		const process = command.spawn();

		await process.status;
	};

	await removeTestCoverageFiles();
	await removeTestCoverageLcovFile();
	await removeTestCoverageReportFiles();

	await denoCommand({
		args: ['task', 'pre-compile'],
	});

	await denoCommand({
		args: ['task', 'test'],
	});

	await denoCommand({
		args: ['task', 'test-coverage'],
	});

	await denoCommand({
		args: ['task', 'test-coverage-html'],
	});

	await removeTestCoverageFiles();
	await removeTestCoverageLcovFile();

	logger.success(`Test coverage report generated! Check "${testCoverageReportDir}"`);
})();
