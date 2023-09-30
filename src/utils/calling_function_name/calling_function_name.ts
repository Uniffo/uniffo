/**
 * The function `getCallingFunctionName` retrieves the name of the calling function in TypeScript.
 * @returns The function `getCallingFunctionName` returns the name of the calling function. If the
 * calling function name cannot be determined, it returns the string "Unknown".
 */
export const getCallingFunctionName = () => {
	const stack = new Error().stack;
	const Unknown = 'Unknown';

	if (!stack) {
		return Unknown;
	}

	const stackLines = stack.split('\n');
	const callerLine = stackLines[4].trim();
	const callerFunctionName = callerLine.substring(
		callerLine.indexOf(' ') + 1,
		callerLine.lastIndexOf(' ('),
	);

	if (!callerFunctionName.length || callerFunctionName === 'at ') {
		return Unknown;
	}

	return callerFunctionName;
};
