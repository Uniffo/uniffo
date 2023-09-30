export const getError = async <T>(callback: () => Promise<void> | void): Promise<T> => {
	let _throw = undefined;

	try {
		await callback();
	} catch (error) {
		_throw = error;
	}

	return _throw;
};
