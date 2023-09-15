import { writeAllSync } from 'https://deno.land/std@0.201.0/streams/write_all.ts';
import { ILogger, TCreateAppLogger, TLoggerLogLine, TLoggerLogMethodNames } from './logger.d.ts';
import { formatDate } from '../date/format_date.ts';
import { ansiColors } from './colors.ts';

export const createAppLogger: TCreateAppLogger = () => {
	const maxWeight = 1024 * 1024 * 100;
	let omitStorage = false;
	const logs: TLoggerLogLine[] = [];

	const calcLogsWeight = () => {
		const jsonString = JSON.stringify(logs);
		const encoder = new TextEncoder();
		const bytes = encoder.encode(jsonString).length;

		return bytes;
	};
	const keepLogsOptimized = () => {
		if (calcLogsWeight() > maxWeight) {
			logs.shift();
			logger.omitStorage(true);
			logger.debug('Shift logs because of logger size');
			logger.omitStorage(false);
			keepLogsOptimized();
		}
	};
	const getMessageColor = (method: TLoggerLogMethodNames) => {
		switch (method) {
			case 'log':
				return ansiColors.Reset;

			case 'debug':
				return ansiColors.FgMagenta;

			case 'error':
				return ansiColors.FgRed;

			case 'info':
				return ansiColors.FgCyan;

			case 'success':
				return ansiColors.FgGreen;

			default:
				return ansiColors.Reset;
		}
	};
	const primaryLogFunction = (
		message: string,
		method: TLoggerLogMethodNames,
	) => {
		const logLine: TLoggerLogLine = {
			message,
			method,
		};

		!omitStorage && logs.push(logLine);

		keepLogsOptimized();

		const now = new Date();
		const date = formatDate(now);
		const MessageColor = getMessageColor(method);
		const dateColor = ansiColors.FgYellow;
		const resetColor = ansiColors.Reset;

		const coloredText =
			`${dateColor}[${date}]${MessageColor}[${method}]: ${message}${resetColor}`;

		writeAllSync(
			method == 'error' ? Deno.stderr : Deno.stdout,
			new TextEncoder().encode(coloredText + '\n'),
		);
	};

	const logger: ILogger = {
		log: (message) => primaryLogFunction(message, 'log'),
		debug: (message) => primaryLogFunction(message, 'debug'),
		error: (message) => primaryLogFunction(message, 'error'),
		success: (message) => primaryLogFunction(message, 'success'),
		info: (message) => primaryLogFunction(message, 'info'),
		omitStorage: (bool) => omitStorage = bool,
		storage: {
			getAll: () => logs,
			getLastLog: () => logs[logs.length - 1],
			getWeightInBytes: () => calcLogsWeight(),
			getLength: () => logs.length,
		},
	};

	return logger;
};
