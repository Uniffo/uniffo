// Copyright 2023-2024 Maciej Koralewski. All rights reserved. EULA license.

import { basename } from '@std/path/basename';

export const getBasename = (path: string) => {
	return basename(path);
};
