import { logger } from '../../services/logger.ts';
import { pathExist } from '../../utils/path/exist.ts';
import { version } from '../../utils/types/version.d.ts';
import { classSession } from '../session/session.ts';
import { classUvm } from '../uvm/uvm.ts';

export class classEngine {
	private uniffoVersionManager;
	private session;

	constructor(args: { uniffoVersionManager: classUvm; session: classSession }) {
		this.uniffoVersionManager = args.uniffoVersionManager;
		this.session = args.session;
	}

	public async exec(args: typeof Deno.args, prefferedUniffoVersion?: version) {
		logger.debug(`Args: "${JSON.stringify(args)}"`);

		try {
			await this.session.init();

			await this.uniffoVersionManager.init(prefferedUniffoVersion);

			if (this.uniffoVersionManager.shouldDispatchCmd()) {
				logger.debug(`Will dispatch uniffo command.`);

				const dispatchTarget = await this.getDispatchTarget();

				await this.ensureUniffoPermissions(dispatchTarget);
				await this.dispatchCommand(dispatchTarget, args);
			} else {
				// TODO(#2): execute command
			}

			await this.session.destroy();
		} catch (error) {
			await this.session.destroy();
			throw error;
		}
	}

	private async ensureUniffoPermissions(path: string) {
		const dispatchTargetMode = (await Deno.stat(path)).mode;
		const executePermission = 0o111;

		if (dispatchTargetMode !== null && !(dispatchTargetMode & executePermission)) {
			logger.debug(
				`Dispatch target is not executable! Upgrading permissions.`,
			);

			Deno.chmod(path, dispatchTargetMode | executePermission);
		}
	}

	private async dispatchCommand(path: string, args: typeof Deno.args) {
		logger.debug(`Dispatch "${path} ${args.join(' ')}"`);

		const command = new Deno.Command(path, {
			args,
		});

		const process = command.spawn();

		await process.status;
	}

	private async getDispatchTarget() {
		const dispatchTarget = this.uniffoVersionManager.getDispatchTarget();
		logger.debug(`Var dispatchTarget: ${dispatchTarget}`);

		if (!await pathExist(dispatchTarget)) {
			throw `Uniffo dispatch target doesn't exist "${dispatchTarget}"!`;
		}

		return dispatchTarget;
	}
}
