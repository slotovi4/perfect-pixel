import React from 'react';
import ReactDOM from 'react-dom';
import ImageHistory from './ImageHistory';

describe('Test ImageHistory component', () => {
	it('Renders without crashing', () => {
		const div = document.createElement ( 'div' ) ; 

		const clearImagesList = () => {
			return;
		};

		const getImagesList = () => {
			return [];
		};

		ReactDOM.render(<ImageHistory clearImagesList={clearImagesList} getImagesList={getImagesList} />, div);
	});
});