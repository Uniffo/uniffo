import { logger } from '../../global/logger.ts';
import {
    DOCKER_CONTAINERS_DEFINITIONS,
    DOCKER_CONTAINERS_DICTIONARY,
} from '../../pre_compiled/__docker_containers_definitions.ts';

export default class classDockerContainers {
    constructor() {
        logger.debugFn(arguments);
    }

    public static getDeffinition(containerName: keyof typeof DOCKER_CONTAINERS_DICTIONARY) {
        logger.debugFn(arguments);

        const container = DOCKER_CONTAINERS_DEFINITIONS.find((def) => def.name === containerName);

        if (!container) {
            throw new Error(`Container definition not found for: ${containerName}`);
        }

        return container.content;
    }

    public static isSupported(containerName: string) {
        logger.debugFn(arguments);

        return Object.keys(DOCKER_CONTAINERS_DICTIONARY).find((p) => p === containerName)
            ? true
            : false;
    }

    public static getDictionary() {
        logger.debugFn(arguments);

        return { ...DOCKER_CONTAINERS_DICTIONARY };
    }
}
