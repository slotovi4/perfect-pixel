import React from 'react';
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

	// при загрузке файла файла
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

	// при изменении уровня прозрачности
	const onChangeOpacity = (event: React.ChangeEvent<HTMLInputElement>) => {

		// установим прозрачность изображения
		setImageOpacity(parseInt(event.target.value, 10));
	};

	// при включении/выключении мигания
	const onChangeImageFlashing = (event: React.ChangeEvent<HTMLInputElement>) => {

		// включим/выключим мигание изображения
		setIsImageFlashing(event.target.checked);
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
					<label className={home('RangeSection-Label')} htmlFor="points">Image opacity (between 0% and 100%)</label>

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

				<div className={home('FlashingSection')}>
					<input
						className={home('FlashingSection-Input')}
						type="checkbox"
						id="imageFlashing"
						name="imageFlashing"
						checked={isImageFlashing}
						onChange={onChangeImageFlashing}
					/>
					<label className={home('FlashingSection-Label')} htmlFor="imageFlashing">Flashing</label>
				</div>

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
			</header>

			<div className={home('ImageContainer')}>
				{errorText ? (
					<span className={home('ErrorText')}>{errorText}</span>
				) : imageParams.src ? (
					<div
						className={home('Image', { flashing: isImageFlashing })}
						data-opacity={`${imageOpacity}%`}
						draggable={false}
						style={{
							opacity: `${imageOpacity}%`,
							backgroundImage: `url(${imageParams.src})`,
							height: imageParams.height && imageParams.height * imageScale,
							width: imageParams.width && imageParams.width * imageScale
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
