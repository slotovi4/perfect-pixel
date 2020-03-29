import { History } from 'history';
import { init, RematchRootState } from '@rematch/core';
import { testModel } from '../models';
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';

const models = {
    testModel,
};

export const browserHistory: History = createBrowserHistory();

export const store = init({
    models,
    plugins: [],
    redux: {
        initialState: {},
        reducers: {
            router: connectRouter(browserHistory),
        },
        middlewares: [],
    },
});

export type Dispatch = typeof store.dispatch;
export type IRootState = RematchRootState<typeof models>;