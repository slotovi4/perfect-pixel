import React from 'react';
import { FileInput, IFileInputProps } from 'library';
import { cn } from '@bem-react/classname';
import './ThemeFileInput.scss';

const ThemeFileInput = ({
	className,
	errorTextClassName,
	labelClassName,
	...rest
}: IFileInputProps) => {
	const tfi = cn('ThemeFileInput');

	return (
		<FileInput
			{...rest}
			errorTextClassName={tfi('ErrorText', [errorTextClassName])}
			labelClassName={tfi('Label', [labelClassName])}
			className={tfi('', [className])}
		/>
	);
};

export default ThemeFileInput;