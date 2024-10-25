// Copyright 2023-2024 Maciej Koralewski. All rights reserved. EULA license.

import { pathExist } from '../utils/path_exist/path_exist.ts';

const CWD = Deno.cwd();
const PRECOMPILED_DIR = `${CWD}/src/pre_compiled`;

const dirExist = () => pathExist(PRECOMPILED_DIR);
if (await dirExist()) {
	await Deno.remove(PRECOMPILED_DIR, { recursive: true });
}

if (!await dirExist()) {
	await Deno.mkdir(PRECOMPILED_DIR, { recursive: true });
}
