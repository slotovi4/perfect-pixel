import React from 'react';
import { Range, IRangeProps } from '../../../library';
import { cn } from '@bem-react/classname';
import './ThemeRange.scss';

const ThemeRange = ({
	containerClassName,
	inputClassName,
	titleClassName,
	...rest
}: IRangeProps) => {
	const tr = cn('ThemeRange');

	return (
		<Range
			{...rest}
			containerClassName={tr('Container', [containerClassName])}
			inputClassName={tr('Input', [inputClassName])}
			titleClassName={tr('Title', [titleClassName])}
		/>
	);
};

export default ThemeRange;
