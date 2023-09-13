export type TLoggerLogMethodName = 'log';
export type TLoggerDebugMethodName = 'debug';
export type TLoggerErrorMethodName = 'error';
export type TLoggerSuccessMethodName = 'success';
export type TInfoMethodName = 'info';
export type TLoggerLogMethodNames =
	| TLoggerLogMethodName
	| TLoggerDebugMethodName
	| TLoggerErrorMethodName
	| TLoggerSuccessMethodName
	| TInfoMethodName;
export type TLoggerLogMethodDefinition = (message: string) => void;
export type TLoggerMethods = {
	[key in TLoggerLogMethodNames]: TLoggerLogMethodDefinition;
};
export type TLoggerLogLine = {
	message: string;
	method: TLoggerLogMethodNames;
};

export interface ILogger extends TLoggerMethods {
	omitStorage: (bool: boolean) => void;
	storage: {
		getAll: () => TLoggerLogLine[];
		getLastLog: () => TLoggerLogLine;
		getWeightInBytes: () => number;
		getLength: () => number;
	};
}

export type TCreateAppLogger = () => ILogger;
