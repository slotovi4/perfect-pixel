import React from 'react';
import { getImagesListFromStore, clearImagesListFromStore, saveImageToStore } from './store';
import { ImageHistory, Home } from './components';
import './components/theme/scss/index.scss';

const App = () => {

	// получим параметр локации
	const params = window.location.search.substr(1);

	return params === 'imageHistory'
		? <ImageHistory getImagesList={getImagesListFromStore} clearImagesList={clearImagesListFromStore} />
		: <Home getImagesList={getImagesListFromStore} saveImage={saveImageToStore} />;
};

export default App;