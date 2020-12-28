import React from 'react';
import {
	onMouseDown,
	onKeyDown,
	listenPasteImage,
	onCloseApp,
	onMinimizeApp,
	isHaveIpcRenderer,
	resizeWindow,
} from './helpers';
import {
	CheckBox,
	Range,
	Button,
	FileInput
} from 'theme';
import { cn } from '@bem-react/classname';
import './Home.scss';

/**
 * Главный компонент приложения отвечающий за весь функционал
 */
const Home = () => {
	const home = cn('Home');
	const initImageParams: TImageParams = null;

	const [imageParams, setImageParams] = React.useState<TImageParams>(initImageParams);
	const [imageOpacity, setImageOpacity] = React.useState(100);
	const [imageScale, setImageScale] = React.useState<number>(EScaleValues.X05);
	const [imagePosition, setImagePosition] = React.useState<EImagePosition>(EImagePosition.Left);
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

	// при изменении изображения/размеров изображения - меняем размер окна
	React.useEffect(() => {

		if (imageParams) {

			// размеры изображения относительно увеличения изображения
			const height = imageParams.height * imageScale;
			const width = imageParams.width * imageScale;

			// изменим размеры окна
			resizeWindow({ width, height });

		} else {

			// вернем начальные размеры окна
			resizeWindow(null);
		}
	}, [imageScale, imageParams]);

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

	/**
	 * События при клике на кнопку смены позиции изображения
	 */
	const onChangeImagePosition = () => {

		// установим новую позицию изображения относительно текущего положения
		if (imagePosition === EImagePosition.Left) {
			setImagePosition(EImagePosition.Center);
		}
		else if (imagePosition === EImagePosition.Center) {
			setImagePosition(EImagePosition.Right);
		}
		else if (imagePosition === EImagePosition.Right) {
			setImagePosition(EImagePosition.Left);
		}
	};

	return (
		<section className={home()}>
			<header className={home('Header')}>
				<FileInput id='uploadImageInput' onChange={onChangeFile} errorText={errorText} />

				<Range
					id='opacityRange'
					titleText='Image opacity'
					value={imageOpacity}
					step={10}
					min={0}
					max={100}
					onChange={onChangeOpacity}
					valueText={`${imageOpacity}%`}
					onKeyDown={(e) => {
						e.preventDefault();
						return false;
					}}
				/>

				<CheckBox
					id="imageFlashing"
					checked={isImageFlashing}
					onChange={onChangeImageFlashing}
					labelText='Flashing'
				/>

				<CheckBox
					id="imageGrayscale"
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
								disabled={!imageParams}
							>
								{EScaleValues[scaleKey]}x
							</Button>)
						)}
					</div>
				</div>

				<Button onClick={onChangeImagePosition} disabled={!imageParams} asChangePosition />

				{isHaveIpcRenderer() ? (
					<div className={home('ControlSection')}>
						<Button onClick={onMinimizeApp} asMinimize />
						<Button onClick={onCloseApp} asClose />
					</div>
				) : null}
			</header>

			<div className={home('ImageContainer')}>
				{!errorText && imageParams ? (
					<div
						className={home('Image', { flashing: isImageFlashing, grayscale: isImageGrayscale })}
						draggable={false}
						style={{
							opacity: `${imageOpacity}%`,
							backgroundImage: `url(${imageParams.src})`,
							height: imageParams.height * imageScale,
							backgroundPosition: imagePosition
						}}
					/>
				) : null}
			</div>
		</section>
	);
};

export default Home;

type TImageParams = {
	width: number;
	height: number;
	src: string;
} | null;

enum EScaleValues {
	X05 = 0.5,
	X1 = 1,
	X15 = 1.5,
	X2 = 2,
	X3 = 3,
}

enum EImagePosition {
	Left = 'left',
	Center = 'center',
	Right = 'right'
}
