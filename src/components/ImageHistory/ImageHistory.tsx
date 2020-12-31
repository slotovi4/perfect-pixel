import React from 'react';
import {
	addImageListener,
	setHistoryImage,
	hideImageHistory,
	errorListener,
} from './helpers';
import { IImage } from 'store';
import { Button } from 'theme';
import { cn } from '@bem-react/classname';
import './ImageHistory.scss';

const ImageHistory = ({ getImagesList, clearImagesList }: IProps) => {
	const [imagesList, setImagesList] = React.useState(getImagesList());
	const [addedImage, setAddedImage] = React.useState<IImage | null>(null);
	const ih = cn('ImageHistory');

	React.useEffect(() => {

		// вешаем слушатель на добавление изображения с главного окна
		addImageListener(setAddedImage);

		// вешаем слушатель на ошибки в окнах
		errorListener();
	}, []);

	// когда добавили новое изображение
	React.useEffect(() => {
		if (addedImage) {

			// обновим список изображений
			setImagesList([addedImage, ...imagesList]);
		}
	}, [addedImage]);

	/**
	 * Когда очищаем список изображений
	 */
	const onClearImagesList = () => {

		// скроем окно
		hideImageHistory();

		// очистим историю изображений в store
		clearImagesList();

		// очистим историю изображений на клиенте
		setImagesList([]);
	};

	return (
		<div className={ih()}>
			{imagesList.length ? (
				<>
					<Button
						className={ih('ClearButton')}
						onClick={onClearImagesList}
					>
						Clear image history
					</Button>

					{imagesList.map((image, i) => (
						<div
							className={ih('ImageBlock')}
							onClick={() => setHistoryImage(image)}
							key={`image_${i}`}
						>
							<span>{image.name}</span>
							<img {...image} className={ih('Image')} />
						</div>
					))}
				</>
			) : (
					<div className={ih('EmptyHistoryBlock')}>
						<div className={ih('EmptyHistoryIcon', ['icon-info'])} />
						<span className={ih('EmptyHistoryText')}>Image history is empty</span>
					</div>
				)}
		</div>
	);
};

export default ImageHistory;

interface IProps {
	getImagesList: () => IImage[];
	clearImagesList: () => void;
}
