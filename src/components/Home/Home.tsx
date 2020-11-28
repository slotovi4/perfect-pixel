import React from 'react';
import { cn } from '@bem-react/classname';
import './Home.scss';

const Home = ({ onHeaderClick }: IProps) => {
	const home = cn('Home');

	const [imageUrl, setImageUrl] = React.useState<string | null>(null);
	const [imageOpacity, setImageOpacity] = React.useState(100);
	const [isImageFlashing, setIsImageFlashing] = React.useState(false);
	const [errorText, setErrorText] = React.useState<string | null>(null);

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

				// при загрузке некорректного файла
				img.onerror = () => {
					setImageUrl(null);
					setErrorText('Invalid file');
					return;
				};

				// если результат string
				if (typeof fr.result === 'string') {

					// установлю ссылку на тест изображение
					img.src = fr.result;

					// установлю ссылку на текущее изображение
					setImageUrl(fr.result);
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

	const onChangeOpacity = (event: React.ChangeEvent<HTMLInputElement>) => {
		setImageOpacity(parseInt(event.target.value, 10));
	};

	const onChangeImageFlashing = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsImageFlashing(event.target.checked);
	};

	return (
		<section className={home()}>
			<header className={home('Header')} onClick={onHeaderClick}>
				<input
					type="file"
					className={home('FileInput', { error: errorText ? true : false })}
					onChange={onChangeFile}
					accept="image/x-png,image/gif,image/jpeg"
				/>

				<div className={home('RangeSection')}>
					<label htmlFor="points">Image opacity (between 0% and 100%)</label>

					<div className={home('RangeSection-Container')}>
						<input
							type="range"
							id="points"
							name="points"
							value={imageOpacity}
							step='1'
							min="0"
							max="100"
							onChange={onChangeOpacity}
						/>
						<span>{`${imageOpacity}%`}</span>
					</div>
				</div>

				<div className={home('FlashingSection')}>
					<input
						type="checkbox"
						id="imageFlashing"
						name="imageFlashing"
						checked={isImageFlashing}
						onChange={onChangeImageFlashing}
					/>
					<label htmlFor="imageFlashing">Flashing</label>
				</div>
			</header>

			<div className={home('ImageContainer')}>
				{errorText ? (
					<span className={home('ErrorText')}>{errorText}</span>
				) : imageUrl ? (
					<img
						className={home('Image', { flashing: isImageFlashing })}
						data-opacity={`${imageOpacity}%`}
						style={{ opacity: `${imageOpacity}%` }}
						src={imageUrl}
						draggable={false}
						alt="image"
					/>
				) : null}
			</div>
		</section>
	);
};

export default Home;

interface IProps {
	onHeaderClick?: () => void;
}
