import React from 'react';
import { Button, IButtonProps } from 'library';
import { cn } from '@bem-react/classname';
import './ThemeButton.scss';

/**
 * Компонент кнопки стилизированный темой приложения
 */
const ThemeButton = ({ isActive, asClose, className, ...rest }: IButtonProps) => {
	const tb = cn('ThemeButton');

	return (
		<Button
			{...rest}
			className={tb(
				'',
				{ active: isActive, close: asClose },
				[className])
			}
		/>
	);
};

export default ThemeButton;
