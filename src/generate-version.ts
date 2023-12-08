import { logger } from './services/logger.ts';
import { cwd } from './utils/workdir/cwd.ts';

(function generateVersion() {
	// Init
	const workdir = cwd();

	logger.displayDebug(true);

	let error = '';

	const getLatestReleaseTag = './.github/workflows/shell-scripts/get_latest_release_tag.sh';
	const getNewReleaseCommitsRange =
		'./.github/workflows/shell-scripts/get_new_release_commits_range.sh';
	const getNextSemanticVersion = './.github/workflows/shell-scripts/get_next_semantic_version.sh';

	const textDecoder = new TextDecoder();

	// Get latest release tag
	const latestReleaseTagCmd = new Deno.Command(getLatestReleaseTag, { args: ['*.*.*'] })
		.outputSync();
	const latestReleaseTag = textDecoder.decode(
		latestReleaseTagCmd.stdout,
	);

	error = textDecoder.decode(
		latestReleaseTagCmd.stderr,
	);

	if (error) throw error;

	logger.debug(`latestReleaseTag: "${latestReleaseTag.trim()}"`);

	// Get commits range
	const commitsRangeCmd = new Deno.Command(getNewReleaseCommitsRange, {
		args: [latestReleaseTag, 'main'],
	}).outputSync();
	const commitsRange = textDecoder.decode(
		commitsRangeCmd.stdout,
	);

	error = textDecoder.decode(
		commitsRangeCmd.stderr,
	);

	if (error) throw error;

	const commitStart = commitsRange.split(',')[0];
	const commitStop = commitsRange.split(',')[1];

	logger.debug(`commitsRange: "${commitsRange.trim()}"`);

	// Get next semantic version
	const nextSemanticVersionCmd = new Deno.Command(getNextSemanticVersion, {
		args: [latestReleaseTag, commitStart, commitStop],
	})
		.outputSync();
	const nextSemanticVersion = textDecoder.decode(
		nextSemanticVersionCmd.stdout,
	);

	error = textDecoder.decode(
		nextSemanticVersionCmd.stderr,
	);

	if (error) throw error;

	logger.debug(`nextSemanticVersion: "${nextSemanticVersion.trim()}"`);

	// Write to file
	const versionFile = `${workdir}/VERSION`;

	logger.debug(`write to file "${nextSemanticVersion.trim()}"`);

	Deno.writeTextFileSync(versionFile, nextSemanticVersion.trim());
})();
