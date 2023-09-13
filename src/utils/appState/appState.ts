import { TCreateAppState } from './appState.d.ts';

export const createAppState: TCreateAppState = () => {
	return {
		logger: {
			storage: [],
		},
	};
};
