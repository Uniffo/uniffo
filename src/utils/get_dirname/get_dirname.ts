// Copyright 2023-2024 Maciej Koralewski. All rights reserved. EULA license.

import { dirname } from '@std/path/dirname';

export const getDirname = (path: string) => {
	return dirname(path);
};
