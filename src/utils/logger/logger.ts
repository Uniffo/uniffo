import { writeAllSync } from 'https://deno.land/std@0.201.0/streams/write_all.ts';
import { ILogger, TCreateAppLogger, TLoggerLogLine, TLoggerLogMethodNames } from './logger.d.ts';
import { formatDate } from '../date/format_date.ts';

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
	const getStdColors = () => {
		return {
			Reset: '\x1b[0m',
			Bright: '\x1b[1m',
			Dim: '\x1b[2m',
			Underscore: '\x1b[4m',
			Blink: '\x1b[5m',
			Reverse: '\x1b[7m',
			Hidden: '\x1b[8m',
			FgBlack: '\x1b[30m',
			FgRed: '\x1b[31m',
			FgGreen: '\x1b[32m',
			FgYellow: '\x1b[33m',
			FgBlue: '\x1b[34m',
			FgMagenta: '\x1b[35m',
			FgCyan: '\x1b[36m',
			FgWhite: '\x1b[37m',
		};
	};
	const getMessageColor = (method: TLoggerLogMethodNames) => {
		const stdColor = getStdColors();

		switch (method) {
			case 'log':
				return stdColor.Reset;

			case 'debug':
				return stdColor.FgMagenta;

			case 'error':
				return stdColor.FgRed;

			case 'info':
				return stdColor.FgCyan;

			case 'success':
				return stdColor.FgGreen;

			default:
				return stdColor.Reset;
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
		const stdColor = getStdColors();
		const MessageColor = getMessageColor(method);

		const coloredText =
			`${stdColor.FgYellow}[${date}]${MessageColor}[${method}]: ${message}${stdColor.Reset}`;

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
