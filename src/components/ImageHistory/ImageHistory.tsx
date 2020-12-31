import React from 'react';
import { IImage } from 'store';
import { Button } from 'theme';
import {
	hideImageHistory,
	addImageListener,
	setHistoryImage
} from './helpers';

const ImageHistory = ({ getImagesList, clearImagesList }: IProps) => {
	const [imagesList, setImagesList] = React.useState(getImagesList());
	const [addedImage, setAddedImage] = React.useState<IImage | null>(null);

	React.useEffect(() => {

		// вешаем слушатель на добавление изображения с главного окна
		addImageListener(setAddedImage);
	}, []);

	// когда добавили новое изображение
	React.useEffect(() => {
		if (addedImage) {

			// обновим список изображений
			setImagesList([addedImage, ...imagesList]);
		}
	}, [addedImage]);

	/**
	 * Очистим список изображений
	 */
	const onClearImagesList = () => {
		clearImagesList();
		setImagesList([]);
	};

	return (
		<div>
			<Button onClick={onClearImagesList}>Clear image history</Button>
			<Button onClick={hideImageHistory} asClose />
			<div>
				{imagesList.map((image, i) => (
					<div key={`image_${i}`}>
						<span>{image.name}</span>
						<img
							{...image}
							onClick={() => {
								setHistoryImage(image);
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ImageHistory;

interface IProps {
	getImagesList: () => IImage[];
	clearImagesList: () => void;
}
