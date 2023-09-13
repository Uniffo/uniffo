import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts';
import { createAppLogger } from './logger.ts';
import { assertGreater } from 'https://deno.land/std@0.201.0/assert/assert_greater.ts';
import { TLoggerLogLine } from './logger.d.ts';

Deno.test('logger', () => {
	const logsData: TLoggerLogLine[] = [{
		message: 'log',
		method: 'log',
	}, {
		message: 'debug',
		method: 'debug',
	}, {
		message: 'info',
		method: 'info',
	}, {
		message: 'error',
		method: 'error',
	}, {
		message: 'success',
		method: 'success',
	}];

	const logger = createAppLogger();

	logsData.forEach((log) => {
		logger?.[log.method](log.message);
	});

	logger.omitStorage(true);
	logger.log('omited');
	logger.omitStorage(false);

	const logsLength = logger.storage.getLength();
	const logsWeight = logger.storage.getWeightInBytes();
	const logs = logger.storage.getAll();
	const lastLog = logger.storage.getLastLog();

	assertEquals(logsLength, 5);
	assertGreater(logsWeight, 0);
	assertEquals(logs, logsData);
	assertEquals(lastLog, logsData[logsData.length - 1]);
});
