import React from 'react';
import {
	saveImageToStore,
	getImagesListFromStore,
	clearImagesListFromStore,
} from './store';
import { Home } from 'components';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { ImageHistoryContainer } from './containers';
import { store, browserHistory } from 'store';
import './components/theme/scss/index.scss';

const App = () => {
	const params = window.location.search.substr(1);

	return (
		<Provider store={store}>
			<ConnectedRouter history={browserHistory}>
				<Switch>
					<Route path="/" component={() => (params === 'imageHistory'
						? <ImageHistoryContainer getImagesList={getImagesListFromStore} clearImagesList={clearImagesListFromStore} />
						: <Home saveImageToStore={saveImageToStore} />
					)} />
				</Switch>
			</ConnectedRouter>
		</Provider>);
};

export default App;