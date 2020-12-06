import React from 'react';
import {
	onMouseDown,
	onKeyDown,
	listenPasteImage,
	onCloseApp,
	isHaveIpcRenderer
} from './helpers';
import { CheckBox, Range, Button } from '../';
import { cn } from '@bem-react/classname';
import './Home.scss';

const Home = () => {
	const home = cn('Home');
	const initImageParams: IImageParams = {
		width: undefined,
		height: undefined,
		src: undefined
	};

	const [imageParams, setImageParams] = React.useState<IImageParams>(initImageParams);
	const [imageOpacity, setImageOpacity] = React.useState(100);
	const [imageScale, setImageScale] = React.useState<number>(EScaleValues.X05);
	const [isImageFlashing, setIsImageFlashing] = React.useState(false);
	const [isImageGrayscale, setIsImageGrayscale] = React.useState(false);
	const [errorText, setErrorText] = React.useState<string | null>(null);

	// список значений(ключей) "scale" для изображения
	const scaleButtonsValuesList = React.useMemo(() => {

		// получим массив ключей enum фильтруя значения
		const valuesArrayList: string[] = Object.keys(EScaleValues).map(key => {
			if (typeof EScaleValues[key] === 'string') {
				return EScaleValues[key];
			}
		});

		// отфильтруем массив удалив все undefined 
		const valuesArrayWithoutUndefinedList = valuesArrayList.filter(e => e !== undefined);

		// отсортируем массив по возрастанию
		const valuesArrayAscendingList = valuesArrayWithoutUndefinedList.sort((a, b) => EScaleValues[a] - EScaleValues[b]);

		return valuesArrayAscendingList;
	}, []);

	React.useEffect(() => {

		// вешаем слушать на опускание мыши для перетаскивания окна
		document.addEventListener('mousedown', onMouseDown);

		// вешаем слушатель на клавиши для передвижения окна стрелками или wasd
		document.addEventListener('keydown', onKeyDown);

		// вешаем слушатель на вставку изображения через clipboard от main
		listenPasteImage(setImage);

		return () => {

			// очищаем слушатель опускания мыши
			document.removeEventListener('mousedown', onMouseDown);

			// очищаем слушатель опускания клавиши
			document.addEventListener('keydown', onKeyDown);
		};
	}, []);

	/**
	 * Валидируем и установим изображение
	 * @param imageSrc - src изображения
	 */
	const setImage = (imageSrc: string) => {

		// очистим ошибки
		setErrorText(null);
		
		// изображение для валидации ошибок
		const img = new Image();

		// установлю ссылку на тест изображение
		img.src = imageSrc;

		// при загрузке некорректного файла
		img.onerror = () => {

			// очистим параметры изображения
			setImageParams(initImageParams);

			// установим текст ошибки
			setErrorText('Invalid file');

			return;
		};

		// при загрузке изображения
		img.onload = () => {

			// сохраним параметры изображения
			setImageParams({
				src: img.src,
				height: img.naturalHeight,
				width: img.naturalWidth
			});
		};
	};

	/**
	 * События при загрузке файла файла
	 * @param event - HTMLInputElement event
	 */
	const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {

		// получим файлы
		const { files } = event.target;

		// если FileReader поддерживается
		if (FileReader && files && files.length) {

			// получаю файл
			const fr = new FileReader();

			// при загрузке файла устанавливаю изображение
			fr.onload = () => {

				// если результат string
				if (typeof fr.result === 'string') {

					// установлю ссылку на тест изображение
					setImage(fr.result);
				}
			};

			// читаю файл 
			fr.readAsDataURL(files[0]);
		}

		// если FileReader не поддерживается/ошибка
		else if (!FileReader) {
			setErrorText('FileReader not support');
		}
	};

	/**
	 * События при изменении уровня прозрачности
	 * @param event HTMLInputElement event
	 */
	const onChangeOpacity = (event: React.ChangeEvent<HTMLInputElement>) => {

		// установим прозрачность изображения
		setImageOpacity(parseInt(event.target.value, 10));
	};

	/**
	 * События при включении/выключении мигания
	 * @param event 
	 */
	const onChangeImageFlashing = (event: React.ChangeEvent<HTMLInputElement>) => {

		// включим/выключим мигание изображения
		setIsImageFlashing(event.target.checked);
	};

	/**
	 * События при включении/выключении чб фильтра
	 * @param event 
	 */
	const onChangeImageGrayscale = (event: React.ChangeEvent<HTMLInputElement>) => {

		// включим/выключим чб фильтр
		setIsImageGrayscale(event.target.checked);
	};

	return (
		<section className={home()}>
			<header className={home('Header')}>
				<input
					type="file"
					className={home('FileInput', { error: errorText ? true : false })}
					onChange={onChangeFile}
					accept="image/x-png,image/gif,image/jpeg"
				/>

				<Range
					id='opacityRange'
					titleText='Image opacity (between 0% and 100%)'
					containerClassName={home('Section')}
					value={imageOpacity}
					step={10}
					min={0}
					max={100}
					onChange={onChangeOpacity}
					valueText={`${imageOpacity}%`}
				/>

				<CheckBox
					id="imageFlashing"
					containerClassName={home('Section')}
					checked={isImageFlashing}
					onChange={onChangeImageFlashing}
					labelText='Flashing'
				/>

				<CheckBox
					id="imageGrayscale"
					containerClassName={home('Section')}
					checked={isImageGrayscale}
					onChange={onChangeImageGrayscale}
					labelText='Grayscale'
				/>

				<div className={home('ScaleSection')}>
					<span className={home('ScaleSection-Title')}>Image scale</span>

					<div>
						{scaleButtonsValuesList.map((scaleKey, i) => (
							<Button
								className={home('ScaleSection-Button')}
								isActive={EScaleValues[scaleKey] === imageScale}
								onClick={() => setImageScale(EScaleValues[scaleKey])}
								key={`scaleButton_${i}`}
							>
								{EScaleValues[scaleKey]}x
							</Button>)
						)}
					</div>
				</div>

				{isHaveIpcRenderer() ? <Button className={home('CloseButton')} onClick={onCloseApp} asClose>x</Button> : null}
			</header>

			<div className={home('ImageContainer')}>
				{errorText ? (
					<span className={home('ErrorText')}>{errorText}</span>
				) : imageParams.src ? (
					<div
						className={home('Image', { flashing: isImageFlashing, grayscale: isImageGrayscale })}
						data-opacity={`${imageOpacity}%`}
						draggable={false}
						style={{
							opacity: `${imageOpacity}%`,
							backgroundImage: `url(${imageParams.src})`,
							height: imageParams.height && imageParams.height * imageScale,
							width: imageParams.width && imageParams.width * imageScale,
						}}
					/>
				) : null}
			</div>
		</section>
	);
};

export default Home;

interface IImageParams {
	width: number | undefined;
	height: number | undefined;
	src: string | undefined;
}

enum EScaleValues {
	X05 = 0.5,
	X1 = 1,
	X15 = 1.5,
	X2 = 2,
	X3 = 3,
}
