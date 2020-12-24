import React from 'react';
import { FileInput, IFileInputProps } from 'library';
import { cn } from '@bem-react/classname';
import './ThemeFileInput.scss';

const ThemeFileInput = ({ className, ...rest }: IFileInputProps) => {
	const tfi = cn('ThemeFileInput');
	
	return (
		<FileInput className={tfi('', [className])} {...rest} />
	);
};

export default ThemeFileInput;