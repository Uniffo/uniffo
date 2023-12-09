import { logger } from './services/logger.ts';
import { cwd } from './utils/workdir/cwd.ts';

(function generateVersion() {
	// Init
	const workdir = cwd();
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
	).trim();

	error = textDecoder.decode(
		latestReleaseTagCmd.stderr,
	);

	if (error) throw error;

	logger.debug(`latestReleaseTag: "${latestReleaseTag}"`);

	// Get commits range
	const commitsRangeCmd = new Deno.Command(getNewReleaseCommitsRange, {
		args: [latestReleaseTag, 'main'],
	}).outputSync();
	const commitsRange = textDecoder.decode(
		commitsRangeCmd.stdout,
	).trim();

	error = textDecoder.decode(
		commitsRangeCmd.stderr,
	);

	if (error) throw error;

	const commitStart = commitsRange.split(',')[0];
	const commitStop = commitsRange.split(',')[1];

	logger.debug(`commitsRange: "${commitsRange}"`);

	// Get next semantic version
	let nextSemanticVersion = latestReleaseTag;

	if (commitStart !== commitStop) {
		const nextSemanticVersionCmd = new Deno.Command(getNextSemanticVersion, {
			args: [latestReleaseTag, commitStart, commitStop],
		})
			.outputSync();
		nextSemanticVersion = textDecoder.decode(
			nextSemanticVersionCmd.stdout,
		).trim();

		error = textDecoder.decode(
			nextSemanticVersionCmd.stderr,
		);

		if (error) throw error;
	}

	logger.debug(`nextSemanticVersion: "${nextSemanticVersion}"`);

	// Write to file
	const versionFile = `${workdir}/VERSION`;

	logger.debug(`write to file "${nextSemanticVersion}"`);

	Deno.writeTextFileSync(versionFile, nextSemanticVersion);
})();
