import { writeAllSync } from 'https://deno.land/std@0.201.0/streams/write_all.ts';
import { formatDate } from '../date/format_date.ts';
import { ansiColors } from './colors.ts';
import {
	ILogger,
	TLoggerConstructorArgs,
	TLoggerLogLine,
	TLoggerLogTypes,
	TLoggerStorageWeightUnits,
} from './logger.d.ts';
import { getCallingFunctionName } from '../calling_function_name/calling_function_name.ts';

/* The Logger class is a TypeScript implementation of a logging utility that allows for storing and
displaying different types of log messages. */
export class Logger implements ILogger {
	private OMIT_STORAGE = false;
	private MAX_WEIGHT: number = 1024 * 1024 * 100;
	private LOGS: TLoggerLogLine[] = [];
	private DEBUG: TLoggerConstructorArgs['debug'] = true;
	private DISPLAY_DATE: TLoggerConstructorArgs['displayDate'] = true;

	/**
	 * The constructor function initializes a new instance of the Logger class and logs a debug message.
	 */
	constructor(args?: TLoggerConstructorArgs) {
		this.DEBUG = !!args?.debug;
		this.DISPLAY_DATE = !!args?.displayDate;

		this.omitStorage(true);
		this.debug('New Logger instance was created.');
		this.omitStorage(false);
	}

	/**
	 * The function `getMessageColor` returns the ANSI color code based on the given log type.
	 * @param {TLoggerLogTypes} logType - The `logType` parameter is of type `TLoggerLogTypes`. It is used
	 * to determine the color of the message based on the type of log. The possible values for `logType`
	 * are: "log", "info", "debug", "success" and "error"
	 * @returns a color code from the `ansiColors` object based on the `logType` parameter. The color code
	 * returned will depend on the value of `logType`.
	 */
	private getMessageColor(logType: TLoggerLogTypes) {
		switch (logType) {
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
	}

	/**
	 * The function "keepLogsOptimized" shifts logs from the beginning of the array if the total weight
	 * exceeds the maximum weight, and recursively calls itself until the logs are optimized.
	 */
	private keepLogsOptimized() {
		if (this.getWeight() > this.MAX_WEIGHT) {
			this.LOGS.shift();
			this.omitStorage(true);
			this.debug('Shift logs because of logger size');
			this.omitStorage(false);
			this.keepLogsOptimized();
		}
	}

	/**
	 * The primaryLogFunction is a private function in TypeScript that logs a message with a specified log
	 * type and colorizes the output.
	 * @param {string} message - A string representing the log message to be logged.
	 * @param {TLoggerLogTypes} logType - The `logType` parameter is of type `TLoggerLogTypes`. It is used
	 * to specify the type of log message being logged.
	 */
	private primaryLogFunction(
		message: string,
		logType: TLoggerLogTypes,
	) {
		const logLine: TLoggerLogLine = {
			message,
			logType,
		};

		!this.OMIT_STORAGE && this.LOGS.push(logLine);

		this.keepLogsOptimized();

		const now = new Date();
		const date = formatDate(now);
		const MessageColor = this.getMessageColor(logType);
		const dateColor = ansiColors.FgYellow;
		const resetColor = ansiColors.Reset;
		const extraDebugMsg = logType == 'debug' ? `${getCallingFunctionName()}(...): ` : '';

		const coloredText = `${
			this.DISPLAY_DATE ? `${dateColor}[${date}]${resetColor}` : ''
		}${MessageColor}[${logType}]: ${extraDebugMsg}${message}${resetColor}`;

		const omitDebug = logType == 'debug' && !this.DEBUG;

		!omitDebug && writeAllSync(
			logType == 'error' ? Deno.stderr : Deno.stdout,
			new TextEncoder().encode(coloredText + '\n'),
		);
	}

	/**
	 * The function `omitStorage` sets the value of the `OMIT_STORAGE` property to a boolean value. If true logs will not been stored.
	 * @param {boolean} bool - A boolean value that determines whether storage should be omitted or not.
	 */
	public omitStorage(bool: boolean) {
		this.OMIT_STORAGE = bool;
	}

	/**
	 * The log function logs a message using the primaryLogFunction with the log level set to 'log'.
	 * @param {string} message - The parameter "message" is of type string. It is used to pass a message
	 * that will be logged.
	 */
	public log(message: string) {
		this.primaryLogFunction(message, 'log');
	}

	/**
	 * The "info" function logs a message with the level set to "info".
	 * @param {string} message - The parameter "message" is a string that represents the information or
	 * message that you want to log.
	 */
	public info(message: string) {
		this.primaryLogFunction(message, 'info');
	}

	/**
	 * The debug function logs a message with the 'debug' level.
	 * @param {string} message - The parameter "message" is of type string. It is used to pass a debug
	 * message that needs to be logged or displayed for debugging purposes.
	 */
	public debug(message: string) {
		this.primaryLogFunction(message, 'debug');
	}

	/**
	 * The function logs a success message using a primary log function.
	 * @param {string} message - The parameter "message" is a string that represents the success message
	 * that you want to log.
	 */
	public success(message: string) {
		this.primaryLogFunction(message, 'success');
	}

	/**
	 * The function logs an error message using a primary log function.
	 * @param {string} message - The parameter "message" is of type string and represents the error
	 * message that you want to log.
	 */
	public error(message: string) {
		this.primaryLogFunction(message, 'error');
	}

	/**
	 * The function returns a copy of all the logs stored in the LOGS array.
	 * @returns An array containing all the logs.
	 */
	public getAllLogs() {
		return [...this.LOGS];
	}

	/**
	 * The function returns the last log entry from an array of logs.
	 * @returns The last log in the LOGS array.
	 */
	public getLastLog() {
		return this.LOGS[this.LOGS.length - 1];
	}

	/**
	 * The function calculates the weight of the logs stored in a JSON format, and returns the weight in
	 * the specified unit (bytes, kilobytes, or megabytes).
	 * @param {TLoggerStorageWeightUnits} [unit] - The `unit` parameter is an optional parameter of type
	 * `TLoggerStorageWeightUnits`. It is used to specify the unit in which the weight of the logs should
	 * be returned. The possible values for `unit` are 'b' (bytes), 'kb' (kilobytes), and 'mb' (megabytes)
	 * @returns The weight of the LOGS object in the specified unit. If no unit is provided, the weight
	 * will be returned in bytes.
	 */
	public getWeight(unit?: TLoggerStorageWeightUnits) {
		const jsonString = JSON.stringify(this.LOGS);
		const encoder = new TextEncoder();
		const bytes = encoder.encode(jsonString).length;

		if (unit == 'b') {
			return bytes;
		} else if (unit == 'kb') {
			return bytes / 1024;
		} else if (unit == 'mb') {
			return bytes / 1024 / 1024;
		}

		return bytes;
	}

	/**
	 * The function returns the length of an array called LOGS.
	 * @returns The length of the LOGS array.
	 */
	public getLength() {
		return this.LOGS.length;
	}
}
