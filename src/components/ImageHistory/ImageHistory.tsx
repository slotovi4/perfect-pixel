import React from 'react';
import { Button } from 'theme';
import { hideImageHistory } from './helpers';

const ImageHistory = () => {
	return (
		<div>
			<Button onClick={hideImageHistory} asClose />
		</div>
	);
};

export default ImageHistory;
