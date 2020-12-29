import React from 'react';
import { Home, ImageHistory } from './components';
import './components/theme/scss/index.scss';

const App = () => {
	const params = window.location.search.substr(1);

	return params === 'imageHistory' ? <ImageHistory /> : <Home />;
};

export default App;
