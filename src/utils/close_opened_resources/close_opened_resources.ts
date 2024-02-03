import { logger } from '../../services/logger.ts';
import { lodash as _ } from 'https://deno.land/x/deno_ts_lodash@0.0.1/mod.ts';

export default function closeOpenedResources() {
	const resources = Deno.resources();
	logger.debug(`Var resources: "${JSON.stringify(resources)}"`);

	const keys = Object.keys(resources);
	logger.debug(`Var keys: "${JSON.stringify(keys)}"`);

	const ignore = ['stdin', 'stdout', 'stderr'];
	logger.debug(`Var ignore: "${JSON.stringify(ignore)}"`);

	for (let i = 0; i < keys.length; i++) {
		const rid = parseInt(keys[i]);
		logger.debug(`Var rid: "${rid}"`);

		const resourceName = resources[rid];
		logger.debug(`Var resourceName: "${resourceName}"`);

		if (_.isString(resourceName) && ignore.includes(resourceName)) {
			logger.debug(`Skip - resource name in ignore list`);
			continue;
		}

		logger.debug(`Closing resource named "${resourceName}" with rid "${rid}"`);
		Deno.close(rid);
	}
}
