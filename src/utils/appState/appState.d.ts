export interface IAppState {
	logger: {
		storage: string[];
	};
}

export type TCreateAppState = () => IAppState;
