import React from 'react';
import { Button } from 'theme';
import { hideImageHistory } from './helpers';

const ImageHistory = ({ getImagesListFromStore }: IProps) => {
	const imagesList = getImagesListFromStore();

	return (
		<div>
			<Button onClick={hideImageHistory} asClose />
			<div>
				{imagesList.map((image, i) => (
					<div key={`image_${i}`}>
						<span>{image.name}</span>
						<img {...image} />
					</div>
				))}
			</div>
		</div>
	);
};

export default ImageHistory;

interface IProps {
	getImagesListFromStore: () => IImage[];
}

interface IImage {
	width: number;
	height: number;
	src: string;
	name: string;
}
