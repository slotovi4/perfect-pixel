import React from 'react';
import { Button, IButtonProps } from 'library';
import { cn } from '@bem-react/classname';
import './ThemeButton.scss';

/**
 * Компонент кнопки стилизированный темой приложения
 */
const ThemeButton = ({ className, ...rest }: IButtonProps) => {
	const tb = cn('ThemeButton');

	return (
		<Button
			{...rest}
			className={tb(
				'',
				{
					active: rest.isActive,
					close: rest.asClose,
					minimize: rest.asMinimize
				},
				[
					rest.asClose ? 'icon-cross' : undefined,
					rest.asMinimize ? 'icon-minus' : undefined,
					className
				])
			}
		/>
	);
};

export default ThemeButton;
