import React from 'react';
import { Home, ImageHistory } from './components';
import {
	saveImageToStore,
	getImagesListFromStore,
	clearImagesListFromStore,
} from './store';
import './components/theme/scss/index.scss';

const App = () => {
	const params = window.location.search.substr(1);

	return params === 'imageHistory'
		? <ImageHistory getImagesList={getImagesListFromStore} clearImagesList={clearImagesListFromStore} />
		: <Home saveImageToStore={saveImageToStore} />;
};

export default App;
