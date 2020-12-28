import React from 'react';
import { Button, IButtonProps } from 'library';
import { cn } from '@bem-react/classname';
import './ThemeButton.scss';

/**
 * Компонент кнопки стилизированный темой приложения
 */
const ThemeButton = ({
	asChangePosition, 
	asImageHistory,
	asMinimize,
	asControl,
	className,
	asClose,
	...rest 
}: IProps) => {
	const tb = cn('ThemeButton');

	return (
		<Button
			{...rest}
			asControl={asControl || asClose || asMinimize || asChangePosition || asImageHistory}
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
					asImageHistory ? 'icon-images' : undefined,
					className
				])
			}
		/>
	);
};

export default ThemeButton;

interface IProps extends IButtonProps {
	asChangePosition?: boolean;
	asImageHistory?: boolean;
	asMinimize?: boolean;
	asClose?: boolean;
}
