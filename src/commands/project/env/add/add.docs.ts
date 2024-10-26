// Copyright 2023-2024 Maciej Koralewski. All rights reserved. MIT license.

import { DOCUMENTATION_COLOR_THEME } from '../../../../constants/DOCUMENTATION_COLOR_THEME.ts';
import { generateDocumentation } from '../../../../utils/generate_documentation/generate_documentation.ts';

const feedArguments = [
	['--env-name="..."', 'Environment name'],
];

const feedOptions = [
	[['-h', '--help'], 'Display documentation'],
	[['-dbg', '--debug'], 'Display debug logs'],
];

export const description = 'Initialize the project';
export const commandProjectEnvAddDocs = generateDocumentation({
	usage: 'uniffo project env add [ARGUMENTS] [OPTIONS]',
	description,
	commands: [],
	arguments: feedArguments,
	options: feedOptions,
	colorTheme: DOCUMENTATION_COLOR_THEME,
});
