import React from 'react';
import { cn } from '@bem-react/classname';
import './FileInput.scss';

const FileInput = ({ className, isInvalid, ...rest }: IProps) => {
	const fi = cn('FileInput');

	return (
		<input
			type="file"
			accept="image/x-png,image/gif,image/jpeg"
			className={fi(
				'',
				{ isInvalid },
				[className])
			}
			{...rest}
		/>
	);
};

export default FileInput;

export interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	isInvalid?: boolean;
}
