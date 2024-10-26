// Copyright 2023-2024 Maciej Koralewski. All rights reserved. EULA license.

import { extname } from '@std/path/extname';
import { recursiveReaddir } from 'https://deno.land/x/recursive_readdir@v2.0.0/mod.ts';
import { logger } from '../../global/logger.ts';
import { basename } from '@std/path/basename';

type definition = { containerName: string; content: string };

export async function generateDockerContainersDefinitions(preCompiledDir: string) {
    const definitionsDir = `${preCompiledDir}/../classes/docker_containers/definitions`;

    const definitionsArray: definition[] = [];

    const addDefinition = (def: definition) => definitionsArray.push(def);

    for (
        const file of (await recursiveReaddir(definitionsDir)).filter((file: string) =>
            extname(file) === '.yml'
        )
    ) {
        logger.debug(`Var file:`, file);

        const fileBasename = basename(file);
        logger.debug(`Var fileBasename:`, fileBasename);

        const containerName = fileBasename.split('.')[1] || undefined;
        logger.debug(`Var containerName:`, containerName);

        if (!containerName) {
            throw new Error(`Container name not found in file: ${file}`);
        }

        const content = Deno.readTextFileSync(file);
        logger.debug(`Var content:`, content);

        addDefinition({ containerName, content });
    }

    const spacing = '    ';
    const containersDictionary = `export const DOCKER_CONTAINERS_DICTIONARY = {\n${spacing}${
        definitionsArray.map((def) => `"${def.containerName}": "${def.containerName}",`).join(
            `\n${spacing}`,
        )
    }\n} as {\n${spacing}${
        definitionsArray.map((def) => `"${def.containerName}": "${def.containerName}",`).join(
            `\n${spacing}`,
        )
    }\n};`;
    const definitionsContent =
        `${containersDictionary}\nexport const DOCKER_CONTAINERS_DEFINITIONS = [\n${spacing}${
            definitionsArray.map((def) =>
                `{\n${spacing}${spacing}name: "${def.containerName}",\n${spacing}${spacing}content: ${
                    JSON.stringify(def.content || '')
                },\n${spacing}}`
            ).join(`,\n${spacing}`)
        }\n];`;
    const definitionsFile = `${preCompiledDir}/__docker_containers_definitions.ts`;

    Deno.writeTextFileSync(definitionsFile, definitionsContent);
}
