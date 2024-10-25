// Copyright 2023-2024 Maciej Koralewski. All rights reserved. MIT license.

import { logger } from '../../global/logger.ts';

export async function sleep(ms: number) {
    logger.debugFn(arguments);
    const sleep = new Promise((resolve) => setTimeout(resolve, ms));

    await sleep;
}
