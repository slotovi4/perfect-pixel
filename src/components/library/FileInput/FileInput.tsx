import React from 'react';
import { cn } from '@bem-react/classname';
import './FileInput.scss';

const FileInput = ({
	errorTextClassName,
	labelClassName,
	className,
	errorText,
	id,
	...rest
}: IProps) => {
	const fi = cn('FileInput');

	return (
		<div className={fi('', [className])}>
			<label htmlFor={id} className={fi('Label', [labelClassName])}>
				Select image
			</label>

			{errorText ? <span className={fi('ErrorText', [errorTextClassName])}>{errorText}</span> : null}

			<input
				type="file"
				id={id}
				accept="image/x-png,image/gif,image/jpeg"
				hidden
				{...rest}
			/>
		</div>
	);
};

export default FileInput;

export interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	id: string;
	labelClassName?: string;
	errorTextClassName?: string;
	errorText?: string | null;
}
