import React from 'react';
import { cn } from '@bem-react/classname';
import './Button.scss';

/**
 * Компонент кнопки
 */
const Button = ({ 
	isActive, 
	asClose, 
	className, 
	...rest 
}: IProps) => {
	const btn = cn('Button');

	return (
		<button
			className={btn('', { active: isActive, close: asClose }, [className])}
			{...rest}
		/>
	);
};

export default Button;

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isActive?: boolean;
	asClose?: boolean;
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
