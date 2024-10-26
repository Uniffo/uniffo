// Copyright 2023-2024 Maciej Koralewski. All rights reserved. MIT license.

import { parseCliArgs } from '../utils/parser/parser.ts';

export const commandArguments = parseCliArgs(Deno.args);
