import React from 'react';
import { Home, ImageHistory } from './components';
import { saveImageToStore, getImagesListFromStore } from './store';
import './components/theme/scss/index.scss';

const App = () => {
	const params = window.location.search.substr(1);

	return params === 'imageHistory'
		? <ImageHistory getImagesListFromStore={getImagesListFromStore} />
		: <Home saveImageToStore={saveImageToStore} />;
};

export default App;
