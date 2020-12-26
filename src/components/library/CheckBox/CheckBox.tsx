import React from 'react';
import { cn } from '@bem-react/classname';
import './CheckBox.scss';

/**
 * Компонент чек-бокса
 */
const CheckBox = ({ 
	containerClassName, 
	inputClassName,
	labelClassName,
	labelText, 
	...rest 
}: IProps) => {
	const cb = cn('CheckBox');

	return (
		<div className={cb('', [containerClassName])}>
			<input
				className={cb('Input', [inputClassName])}
				type="checkbox"
				{...rest}
			/>
			<label className={cb('Label', [labelClassName])} htmlFor={rest.id}>{labelText}</label>
		</div>
	);
};

export default CheckBox;

export interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
	checked: boolean;
	labelText: string;
	id: string;
	inputClassName?: string;
	labelClassName?: string;
	containerClassName?: string;
}