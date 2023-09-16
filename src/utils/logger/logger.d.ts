export type TLoggerLogTypes = 'log' | 'info' | 'debug' | 'success' | 'error';
export type TLoggerStorageWeightUnits = 'b' | 'kb' | 'mb';
export type TLoggerLogLine = {
	message: string;
	logType: TLoggerLogTypes;
};
type TLoggerLogTypesDefinition = {
	[key in TLoggerLogTypes]: (message: string) => void;
};

export type TLoggerConstructorArgs = {
	debug?: boolean;
	displayDate?: boolean;
};
export interface ILogger extends TLoggerLogTypesDefinition {
	omitStorage(bool: boolean): void;
	displayDebug(bool: boolean): void;
	displayDate(bool: boolean): void;
	getAllLogs(): TLoggerLogLine[];
	getLastLog(): TLoggerLogLine | undefined;
	getWeight(unit?: TLoggerStorageWeightUnits): number;
	getLength(): number;
}
