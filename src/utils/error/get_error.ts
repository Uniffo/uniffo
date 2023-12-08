/**
 * The `getError` function is a TypeScript async function that executes a callback and returns any
 * error that occurs during its execution.
 * @param callback - A function that returns a promise. This function will be executed and any errors
 * thrown within it will be caught and returned as the result of the promise.
 * @returns The function `getError` returns a promise that resolves to the error object caught in the
 * `catch` block, or `undefined` if no error was thrown.
 */
export const getError = async <T>(callback: () => Promise<void> | void): Promise<T> => {
	let _throw = undefined;

	try {
		await callback();
	} catch (error) {
		_throw = error;
	}

	return _throw;
};
