import React from 'react';
import { Button } from 'theme';
import { hideImageHistory } from './helpers';

const ImageHistory = ({ getImagesList, clearImagesList }: IProps) => {
	const [imagesList, setImagesList] = React.useState(getImagesList());

	const onClearImagesList = () => {
		clearImagesList();
		setImagesList(getImagesList());
	};

	return (
		<div>
			<Button onClick={onClearImagesList}>Clear image history</Button>
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

export interface IProps {
	getImagesList: () => IImage[];
	clearImagesList: () => void;
}
interface IImage {
	width: number;
	height: number;
	src: string;
	name: string;
}
