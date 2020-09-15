import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { HomeContainer } from './containers';
import { store, browserHistory } from './redux/store';

const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={browserHistory}>
            <Switch>
                <Route path="/" component={HomeContainer} />
            </Switch>
        </ConnectedRouter>
    </Provider>
);

export default App;
