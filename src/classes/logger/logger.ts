import { writeAllSync } from 'https://deno.land/std@0.201.0/streams/write_all.ts';
import { ansiColors } from './colors.ts';
import { getCallingFunctionName } from '../../utils/calling_function_name/calling_function_name.ts';
import { formatDate } from '../../utils/date/format_date.ts';

/* The `classLogger` class is a TypeScript class that provides logging functionality with configurable
options. */
export class classLogger {
	private config = {
		omitStorage: false,
		maxWeight: 1024 * 1024 * 100,
		displayDebug: true,
		displayDate: true,
	};
	private archive: ReturnType<typeof this.getLogLine>[] = [];

	/**
	 * The constructor function initializes a Logger instance with optional configuration parameters.
	 * @param [config] - The `config` parameter is an optional object that can contain the following
	 * properties:
	 * omitStorage?: boolean;
	 * maxWeight?: number;
	 * displayDebug?: boolean;
	 * displayDate?: boolean;
	 */
	constructor(config?: {
		omitStorage?: boolean;
		maxWeight?: number;
		displayDebug?: boolean;
		displayDate?: boolean;
	}) {
		this.config.omitStorage = typeof config?.omitStorage == 'boolean'
			? config?.omitStorage
			: false;
		this.config.maxWeight = config?.maxWeight && config?.maxWeight >= 1024 * 1024 * 1
			? config?.maxWeight
			: 1024 * 1024 * 1;
		this.config.displayDebug = typeof config?.displayDebug == 'boolean'
			? config?.displayDebug
			: true;
		this.config.displayDate = typeof config?.displayDate == 'boolean'
			? config?.displayDate
			: true;

		this.omitStorage(true);
		this.debug('New Logger instance was created.');
		this.omitStorage(false);
	}

	/**
	 * The function `getMessageColor` returns the ANSI color code based on the given log type.
	 * @param {string} logType - The `logType` parameter is a string that represents the type of log
	 * message. It can have one of the following values: 'log', 'debug', 'error', 'info', or 'success'.
	 * @returns The color code corresponding to the given log type.
	 */
	private getMessageColor(logType: string) {
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
	 * The function "keepLogsOptimized" checks if the weight of the logger exceeds the maximum weight, and
	 * if so, shifts logs, omits storage, and recursively calls itself.
	 */
	private keepLogsOptimized() {
		if (this.getWeight() > this.config.maxWeight) {
			this.archive.shift();
			this.omitStorage(true);
			this.debug('Shift logs because of logger size');
			this.omitStorage(false);
			this.keepLogsOptimized();
		}
	}

	/**
	 * The function returns an object with a log type and message.
	 * @param {string} logType - The logType parameter is a string that represents the type of log
	 * message. It could be something like "info", "warning", "error", etc.
	 * @param {string} message - A string representing the log message.
	 * @returns An object with the properties "message" and "logType".
	 */
	private getLogLine(logType: string, message: string) {
		return {
			message,
			logType,
		};
	}

	/**
	 * The primaryLogFunction is a private function in TypeScript that logs a message with a specified log
	 * type and performs additional formatting and handling based on the configuration settings.
	 * @param {string} message - The `message` parameter is a string that represents the log message that
	 * you want to log.
	 * @param {string} logType - The `logType` parameter is a string that represents the type of log
	 * message being passed to the `primaryLogFunction`. It is used to determine the color and formatting
	 * of the log message.
	 */
	private primaryLogFunction(
		message: string,
		logType: string,
	) {
		const logLine = this.getLogLine(logType, message);

		!this.config.omitStorage && this.archive.push(logLine);

		this.keepLogsOptimized();

		const maxMsgLength = 300;
		const truncatedMessage = message.length > maxMsgLength
			? `${message.slice(0, maxMsgLength)}...`
			: message;
		const now = new Date();
		const date = formatDate(now);
		const MessageColor = this.getMessageColor(logType);
		const dateColor = MessageColor;
		const resetColor = ansiColors.Reset;
		const extraDebugMsg = logType == 'debug' ? `${getCallingFunctionName()}(...): ` : '';
		const extraDebugMsgColor = ansiColors.Dim;

		const coloredText = `${
			this.config.displayDate ? `${dateColor}[${date}]${resetColor}` : ''
		}${MessageColor}[${logType}]:${resetColor} ${extraDebugMsgColor}${extraDebugMsg}${resetColor}${truncatedMessage}`;

		const omitDebug = logType == 'debug' && !this.config.displayDebug;

		!omitDebug && writeAllSync(
			logType == 'error' ? Deno.stderr : Deno.stdout,
			new TextEncoder().encode(coloredText + '\n'),
		);
	}

	/**
	 * The function `omitStorage` sets the `omitStorage` property of the `config` object to the value of
	 * the `bool` parameter.
	 * @param {boolean} bool - A boolean value that determines whether or not to omit storage.
	 */
	public omitStorage(bool: boolean) {
		this.config.omitStorage = bool;
	}

	/**
	 * The function sets the displayDebug property of the config object to the value of the boolean
	 * parameter.
	 * @param {boolean} bool - The "bool" parameter is a boolean type, which means it can only have two
	 * possible values: true or false.
	 */
	public displayDebug(bool: boolean) {
		this.config.displayDebug = bool;
	}

	/**
	 * The function sets the displayDate property of a configuration object to a boolean value.
	 * @param {boolean} bool - The "bool" parameter is a boolean value that determines whether or not to
	 * display the date. If the value is true, the date will be displayed. If the value is false, the date
	 * will not be displayed.
	 */
	public displayDate(bool: boolean) {
		this.config.displayDate = bool;
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
	 * The info function logs an informational message.
	 * @param {string} message - The parameter "message" is of type string. It is used to pass a message
	 * that will be logged as an information message.
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
	 * The function returns a copy of all the logs in the archive.
	 * @returns An array containing all the logs in the archive.
	 */
	public getAllLogs() {
		return [...this.archive];
	}

	/**
	 * The function returns the last log entry from an archive.
	 * @returns The last log in the archive.
	 */
	public getLastLog() {
		return this.archive[this.archive.length - 1];
	}

	/**
	 * The function calculates the weight of a JSON object in bytes, kilobytes, or megabytes.
	 * @param {'b' | 'kb' | 'mb'} [unit] - The `unit` parameter is an optional parameter that specifies
	 * the unit in which the weight should be returned. It can have one of three values: 'b' for bytes,
	 * 'kb' for kilobytes, or 'mb' for megabytes. If the `unit` parameter is not provided
	 * @returns The weight of the archive in the specified unit (bytes, kilobytes, or megabytes) is being
	 * returned.
	 */
	public getWeight(unit?: 'b' | 'kb' | 'mb') {
		const jsonString = JSON.stringify(this.archive);
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
	 * The function returns the length of the "archive" array.
	 * @returns The length of the archive.
	 */
	public getLength() {
		return this.archive.length;
	}
}
