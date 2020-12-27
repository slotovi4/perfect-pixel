import React from 'react';
import { cn } from '@bem-react/classname';
import './Button.scss';

/**
 * Компонент кнопки
 */
const Button = ({
	isActive,
	asClose,
	asMinimize,
	className,
	...rest
}: IProps) => {
	const btn = cn('Button');

	return (
		<button
			className={btn(
				'',
				{ 
					active: isActive, 
					control: asClose || asMinimize, 
				},
				[className])
			}
			{...rest}
		/>
	);
};

export default Button;

export interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isActive?: boolean;
	asMinimize?: boolean;
	asClose?: boolean;
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
