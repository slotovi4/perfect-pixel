import React from 'react';
import { getImagesListFromStore, clearImagesListFromStore, saveImageToStore } from './store';
import { ImageHistory, Home } from './components';
import './components/theme/scss/index.scss';

const App = () => {
	const params = window.location.search.substr(1);

	return params === 'imageHistory'
		? <ImageHistory getImagesList={getImagesListFromStore} clearImagesList={clearImagesListFromStore} />
		: <Home saveImage={saveImageToStore} />;
};

export default App;