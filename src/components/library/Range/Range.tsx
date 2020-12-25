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
	titleClassName,
	inputClassName,
	valueClassName,
	...rest
}: IProps) => {
	const range = cn('Range');

	return (
		<div className={range(null, [containerClassName])}>
			<span className={range('Title', [titleClassName])}>{titleText}</span>

			<div className={range('Container')}>
				<input className={range('Input', [inputClassName])} type="range" {...rest} />
				{valueText ?
					<span className={range('Value', [valueClassName])}>
						{valueText}
					</span>
				: null}
			</div>
		</div>
	);
};

export default Range;

export interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
	value: number;
	id: string;
	step: number;
	min: number;
	max: number;
	titleText: string;
	valueText?: string;
	containerClassName?: string;
	titleClassName?: string;
	inputClassName?: string;
	valueClassName?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}