export const getError = <T>(callback: () => void): T => {
	let _throw = undefined;

	try {
		callback();
	} catch (error) {
		_throw = error;
	}

	return _throw;
};
