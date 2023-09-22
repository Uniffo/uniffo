export const getRandomId = (idLength: number) => {
	const availableChars = '1234567890qwertyuioplkjhgfdsazxcvbnm';
	const getRandomNumber = (max: number, min: number) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	let id = '';
	while (id.length < idLength) {
		const randomChar = availableChars[getRandomNumber(availableChars.length - 1, 0)];

		id = `${id}${randomChar}`;
	}

	return id;
};
