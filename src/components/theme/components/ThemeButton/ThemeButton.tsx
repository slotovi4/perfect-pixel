import React from 'react';
import { Button, IButtonProps } from 'library';
import { cn } from '@bem-react/classname';
import './ThemeButton.scss';

/**
 * Компонент кнопки стилизированный темой приложения
 */
const ThemeButton = ({ 
	className, 
	asMinimize, 
	asChangePosition, 
	asClose, 
	asControl,
	...rest 
}: IProps) => {
	const tb = cn('ThemeButton');

	return (
		<Button
			{...rest}
			asControl={asControl || asClose || asMinimize || asChangePosition}
			className={tb(
				'',
				{
					active: rest.isActive,
					close: asClose,
					minimize: asMinimize,
				},
				[
					asClose ? 'icon-cross' : undefined,
					asMinimize ? 'icon-minus' : undefined,
					asChangePosition ? 'icon-tab' : undefined,
					className
				])
			}
		/>
	);
};

export default ThemeButton;

interface IProps extends IButtonProps {
	asChangePosition?: boolean;
	asClose?: boolean;
	asMinimize?: boolean;
}
