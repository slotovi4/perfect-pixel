import React from 'react';
import { cn } from '@bem-react/classname';
import './CheckBox.scss';

/**
 * Компонент чек-бокса
 */
const CheckBox = ({ containerClassName, labelText, ...rest }: IProps) => {
	const cb = cn('CheckBox');

	return (
		<div className={cb(null, [containerClassName])}>
			<input
				className={cb('Input')}
				type="checkbox"
				{...rest}
			/>
			<label className={cb('Label')} htmlFor={rest.id}>{labelText}</label>
		</div>
	);
};

export default CheckBox;

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
	checked: boolean;
	labelText: string;
	id: string;
	containerClassName?: string;
}