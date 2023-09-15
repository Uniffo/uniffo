import { writeAllSync } from 'https://deno.land/std@0.201.0/streams/write_all.ts';
import { formatDate } from '../date/format_date.ts';
import { ansiColors } from './colors.ts';
import { ILogger, TLoggerLogLine, TLoggerLogTypes, TLoggerStorageWeightUnits } from './logger.d.ts';

export class Logger implements ILogger {
	private OMIT_STORAGE = false;
	private MAX_WEIGHT: number = 1024 * 1024 * 100;
	private LOGS: TLoggerLogLine[] = [];

	private getMessageColor = (logType: TLoggerLogTypes) => {
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
	};

	private calcLogsWeight(unit?: TLoggerStorageWeightUnits) {
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

	private keepLogsOptimized() {
		if (this.calcLogsWeight() > this.MAX_WEIGHT) {
			this.LOGS.shift();
			this.omitStorage(true);
			this.debug('Shift logs because of logger size');
			this.omitStorage(false);
			this.keepLogsOptimized();
		}
	}

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

		const coloredText =
			`${dateColor}[${date}]${MessageColor}[${logType}]: ${message}${resetColor}`;

		writeAllSync(
			logType == 'error' ? Deno.stderr : Deno.stdout,
			new TextEncoder().encode(coloredText + '\n'),
		);
	}

	public omitStorage(bool: boolean) {
		this.OMIT_STORAGE = bool;
	}

	public log(message: string) {
		this.primaryLogFunction(message, 'log');
	}

	public info(message: string) {
		this.primaryLogFunction(message, 'info');
	}

	public debug(message: string) {
		this.primaryLogFunction(message, 'debug');
	}

	public success(message: string) {
		this.primaryLogFunction(message, 'success');
	}

	public error(message: string) {
		this.primaryLogFunction(message, 'error');
	}

	public getAllLogs() {
		return [...this.LOGS];
	}
	public getLastLog() {
		return this.LOGS[this.LOGS.length - 1];
	}
	public getWeight(unit?: TLoggerStorageWeightUnits) {
		return this.calcLogsWeight(unit);
	}
	public getLength() {
		return this.LOGS.length;
	}
}
