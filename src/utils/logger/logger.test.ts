import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { Logger } from './logger.ts';
import { assertGreater } from 'https://deno.land/std@0.201.0/assert/assert_greater.ts';
import { TLoggerLogLine } from './logger.d.ts';

Deno.test('logger', function testLogger() {
	const logsData: TLoggerLogLine[] = [{
		message: 'log',
		logType: 'log',
	}, {
		message: 'debug',
		logType: 'debug',
	}, {
		message: 'info',
		logType: 'info',
	}, {
		message: 'error',
		logType: 'error',
	}, {
		message: 'success',
		logType: 'success',
	}];

	const logger = new Logger();

	logsData.forEach((log) => {
		logger?.[log.logType](log.message);
	});

	logger.omitStorage(true);
	logger.log('omited');
	logger.omitStorage(false);

	const logsLength = logger.getLength();
	const logsWeight = logger.getWeight('b');
	const logsWeightKb = logger.getWeight('kb');
	const logsWeightMb = logger.getWeight('mb');
	const logs = logger.getAllLogs();
	const lastLog = logger.getLastLog();

	assertEquals(logsLength, 5, 'logs length');
	assertGreater(logsWeight, 0, 'logs weight');
	assertEquals(logsWeightKb, logsWeight / 1024, 'logs weight kb');
	assertEquals(logsWeightMb, logsWeight / 1024 / 1024, 'logs weight mb');
	assertEquals(logs, logsData, 'logs storage');
	assertEquals(lastLog, logsData[logsData.length - 1], 'last log');
});
