import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';

describe('Test Home component', () => {
	it('Renders without crashing', () => {
		const div = document.createElement ( 'div' ) ; 

		const saveImage = () => {
			return;
		};

		const getImagesList = () => {
			return [];
		};

		ReactDOM.render(<Home saveImage={saveImage} getImagesList={getImagesList} />, div);
	});
});