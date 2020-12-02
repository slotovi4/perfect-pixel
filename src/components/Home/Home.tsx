import React from 'react';
import { cn } from '@bem-react/classname';
import { CheckBox } from '../';
import { getIpcRenderer } from '../../helpers';
import './Home.scss';

const Home = () => {
	const home = cn('Home');
	const ipcRenderer = getIpcRenderer();
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

	let mouseX: number;
	let mouseY: number;

	React.useEffect(() => {
		if (ipcRenderer) {
			document.addEventListener('mousedown', onMouseDown);
		}

		return () => {
			if (ipcRenderer) {
				document.removeEventListener('mousedown', onMouseDown);
			}
		};
	}, []);

	const onMouseDown = ({ target, clientX, clientY }: MouseEvent) => {
		if (ipcRenderer) {
			mouseX = clientX;
			mouseY = clientY;

			if (target instanceof HTMLElement && (
				target.tagName === 'BUTTON' ||
				target.tagName === 'LABEL' ||
				target.tagName === 'INPUT'
			)) {
				return;
			}

			document.addEventListener('mouseup', stopMovingWindow);
			document.addEventListener('mousemove', moveWindow);
		}
	};

	const moveWindow = () => {
		if (ipcRenderer) {
			ipcRenderer.send('windowMoving', { mouseX, mouseY });
		}
	};

	const stopMovingWindow = () => {
		if (ipcRenderer) {
			document.removeEventListener('mouseup', stopMovingWindow);
			document.removeEventListener('mousemove', moveWindow);
		}
	};

	/**
	 * События при загрузке файла файла
	 * @param event - HTMLInputElement event
	 */
	const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {

		// получим файлы
		const { files } = event.target;

		// очистим ошибки
		setErrorText(null);

		// если FileReader поддерживается
		if (FileReader && files && files.length) {

			// получаю файл
			const fr = new FileReader();

			// при загрузке файла устанавливаю изображение
			fr.onload = () => {

				// изображение для валидации ошибок
				const img = new Image();

				// если результат string
				if (typeof fr.result === 'string') {

					// установлю ссылку на тест изображение
					img.src = fr.result;
				}

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
	 * События при клике на кнопку "закрыть приложение"
	 */
	const onCloseApp = () => {

		if (ipcRenderer) {

			// отправляем сообщение на закрытие приложения
			ipcRenderer.sendSync('close-window');
		}
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

				<div className={home('RangeSection')}>
					<span className={home('RangeSection-Title')}>Image opacity (between 0% and 100%)</span>

					<div className={home('RangeSection-Container')}>
						<input
							type="range"
							id="points"
							name="points"
							value={imageOpacity}
							step='10'
							min="0"
							max="100"
							onChange={onChangeOpacity}
						/>
						<span>{`${imageOpacity}%`}</span>
					</div>
				</div>

				<CheckBox
					id="imageFlashing"
					containerClassName={home('CheckBoxSection')}
					checked={isImageFlashing}
					onChange={onChangeImageFlashing}
					labelText='Flashing'
				/>

				<CheckBox
					id="imageGrayscale"
					containerClassName={home('CheckBoxSection')}
					checked={isImageGrayscale}
					onChange={onChangeImageGrayscale}
					labelText='Grayscale'
				/>

				<div className={home('ScaleSection')}>
					<span className={home('ScaleSection-Title')}>Image scale</span>

					<div>
						{scaleButtonsValuesList.map((scaleKey, i) => (
							<button
								className={home('ScaleSection-Button', { active: EScaleValues[scaleKey] === imageScale })}
								onClick={() => setImageScale(EScaleValues[scaleKey])}
								key={`scaleButton_${i}`}
							>
								{EScaleValues[scaleKey]}x
							</button>)
						)}
					</div>
				</div>

				{ipcRenderer ? <button className={home('CloseButton')} onClick={onCloseApp}>x</button> : null}
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
