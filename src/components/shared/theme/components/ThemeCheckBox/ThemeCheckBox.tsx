import React from 'react';
import { CheckBox, ICheckBoxProps } from '../../../library';
import { cn } from '@bem-react/classname';
import './ThemeCheckBox.scss';

const ThemeCheckBox = ({ inputClassName, labelClassName, ...rest }: ICheckBoxProps) => {
	const tcb = cn('ThemeCheckBox');

	return (
		<CheckBox
			{...rest}
			inputClassName={tcb('Input', [inputClassName])}
			labelClassName={tcb('Label', [labelClassName])}
		/>
	);
};

export default ThemeCheckBox;
