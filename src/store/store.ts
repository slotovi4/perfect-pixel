import { RematchRootState, init } from '@rematch/core';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History, createBrowserHistory } from 'history';
import { imageHistory } from './models';

const models = {
	imageHistory
};

export const browserHistory: History = createBrowserHistory();

export const store = init({
	models,
	redux: {
		initialState: {},
		reducers: {
			router: connectRouter(browserHistory)
		},
		middlewares: [routerMiddleware(browserHistory)]
	}
});

export type TDispatch = typeof store.dispatch;
export type TState = RematchRootState<typeof models> & ILoadingPlugin;

interface ILoadingPlugin {
	loading: {
		models: RematchRootState<typeof models>;
		effects: TDispatch;
	};
}