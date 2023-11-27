import { logger } from './services/logger.ts';
import { pathExist } from './utils/path/exist.ts';
import { cwd } from './utils/workdir/cwd.ts';

logger.displayDebug(true);
logger.displayDate(true);

const testCoverageDir = `${cwd()}/.test_coverage`;
const testCoverageLcovFilename = `${cwd()}/test-coverage.lcov`;
const testCoverageReportDir = `${cwd()}/.test_coverage_report`;

const removeTestCoverageFiles = async () => {
	if (await pathExist(testCoverageDir)) {
		await Deno.remove(testCoverageDir, { recursive: true });
	}
};
const removeTestCoverageReportFiles = async () => {
	if (await pathExist(testCoverageReportDir)) {
		await Deno.remove(testCoverageReportDir, { recursive: true });
	}
};
const removeTestCoverageLcovFile = async () => {
	if (await pathExist(testCoverageLcovFilename)) {
		await Deno.remove(testCoverageLcovFilename, { recursive: true });
	}
};
const denoCommand = (options: Deno.CommandOptions) => {
	const task = new Deno.Command(Deno.execPath(), options);

	const taskOutput = task.outputSync();
	const taskOutputStdout = new TextDecoder().decode(taskOutput.stdout);
	const taskOutputStderr = new TextDecoder().decode(taskOutput.stderr);

	if (taskOutputStdout.length) {
		console.log(taskOutputStdout);
	}
	if (taskOutputStderr.length) {
		console.log(taskOutputStderr);
	}
};

await removeTestCoverageFiles();
await removeTestCoverageLcovFile();
await removeTestCoverageReportFiles();

denoCommand({
	args: ['task', 'pre-compile'],
	stderr: 'piped',
	stdout: 'piped',
});

denoCommand({
	args: ['task', 'test'],
	stderr: 'piped',
	stdout: 'piped',
});

denoCommand({
	args: ['task', 'test-coverage'],
	stderr: 'piped',
	stdout: 'piped',
});

denoCommand({
	args: ['task', 'test-coverage-html'],
	stderr: 'piped',
	stdout: 'piped',
});

await removeTestCoverageFiles();
await removeTestCoverageLcovFile();

denoCommand({
	args: ['task', 'open-test-coverage-report'],
	stderr: 'piped',
	stdout: 'piped',
});
