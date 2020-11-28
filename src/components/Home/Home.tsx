import React from 'react';
import { cn } from '@bem-react/classname';
import logo from './logo.svg';
import './Home.scss';

const Home = ({ text, onHeaderClick }: IProps) => {
	const home = cn('Home');
	const [imageUrl, setImageUrl] = React.useState<string | null>(null);

	const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		// FileReader support
		if (FileReader && files && files.length) {
			const fr = new FileReader();
			fr.onload = () => {
				if (typeof fr.result === 'string') {
					setImageUrl(fr.result);
				}
			};
			fr.readAsDataURL(files[0]);
		}

		// Not supported
		else {
			// fallback -- perhaps submit the input to an iframe and temporarily store
			// them on the server until the user's session ends.
		}

	};

	return (
		<section className={home()}>
			<header className={home('Header')} onClick={onHeaderClick}>
				<img src={logo} className={home('Logo')} alt="logo" />
				<h1 className={home('Title')}>{text || 'Welcome to React'}</h1>
				<input type="file" onChange={onChangeFile} />
			</header>
			<p className={home('Intro')}>
				{imageUrl ? (
					<img src={imageUrl} alt="" />
				) : null}
			</p>
		</section>
	);
};

export default Home;

interface IProps {
	text?: string;
	onHeaderClick?: () => void;
}
