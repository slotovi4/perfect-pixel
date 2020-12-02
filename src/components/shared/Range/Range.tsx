import React from 'react';
import { cn } from '@bem-react/classname';
import './Range.scss';

/**
 * Компонент диапазона
 */
const Range = ({ 
	valueText, 
	titleText, 
	containerClassName, 
	...rest 
}: IProps) => {
	const range = cn('Range');

	return (
		<div className={range(null, [containerClassName])}>
			<span className={range('Title')}>{titleText}</span>

			<div className={range('Container')}>
				<input type="range" {...rest} />
				{valueText ? <span>{valueText}</span> : null}
			</div>
		</div>
	);
};

export default Range;

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
	value: number;
	id: string;
	step: number;
	min: number;
	max: number;
	titleText: string;
	valueText?: string;
	containerClassName?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}