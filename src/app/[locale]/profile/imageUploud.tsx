import React, { useState, ChangeEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
	maxSizeInMB?: number;
	onImageUpload?: (file: File) => void;
	onImageRemove?: () => void;
	acceptedFileTypes?: string[];
	width?: number;
	height?: number;
	profileImage?: string | null;
}

type FileError = {
	message: string;
	code: "size" | "type" | "generic";
};

const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif"];
const DEFAULT_MAX_SIZE_MB = 5;

export const ImageUpload: React.FC<ImageUploadProps> = ({
	maxSizeInMB = DEFAULT_MAX_SIZE_MB,
	onImageUpload,
	acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
	profileImage,
}) => {
	const [preview, setPreview] = useState<string | null>(
		profileImage ? profileImage : null
	);
	const [error, setError] = useState<FileError | null>(null);

	const validateFile = (file: File): FileError | null => {
		if (!acceptedFileTypes.includes(file.type)) {
			return {
				message: `Please select a valid image file (${acceptedFileTypes.join(
					", "
				)})`,
				code: "type",
			};
		}

		if (file.size > maxSizeInMB * 1024 * 1024) {
			return {
				message: `File size should be less than ${maxSizeInMB}MB`,
				code: "size",
			};
		}

		return null;
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setError(null);

		if (file) {
			const validationError = validateFile(file);

			if (validationError) {
				setError(validationError);
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
				onImageUpload?.(file);
			};

			reader.onerror = () => {
				setError({
					message: "Error reading file",
					code: "generic",
				});
			};

			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='w-full max-w-md space-y-4'>
			<label className='relative w-28 h-28 border-2 border-[#A2A1A833] bg-[#A2A1A80D] hover:bg-[#a2a1a845] duration-200 cursor-pointer rounded-[10px] flex items-center justify-center overflow-hidden'>
				{preview && (
					<Image
						src={preview}
						alt='Upload preview'
						fill
						className='absolute top-0 left-0 w-full h-full z-[1] object-cover'
						priority
						unoptimized={true}
					/>
				)}
				<input
					type='file'
					name=''
					id=''
					onChange={handleFileChange}
					accept={acceptedFileTypes.join(",")}
					className='absolute top-0 left-0 w-full h-full z-[2] opacity-0 cursor-pointer'
				/>
				<svg
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M15 13.5C15 15.1569 13.6569 16.5 12 16.5C10.3431 16.5 9 15.1569 9 13.5C9 11.8431 10.3431 10.5 12 10.5C13.6569 10.5 15 11.8431 15 13.5Z'
						stroke='#252525'
						strokeWidth='1.5'
					/>
					<circle cx='12' cy='7' r='1' fill='#252525' />
					<path
						d='M21 15.5V11.5C21 8.73858 18.7614 6.5 16 6.5H15.874C15.4299 4.77477 13.8638 3.5 12 3.5C10.1362 3.5 8.57006 4.77477 8.12602 6.5H8C5.23858 6.5 3 8.73858 3 11.5V15.5C3 18.2614 5.23858 20.5 8 20.5H16C18.7614 20.5 21 18.2614 21 15.5Z'
						stroke='#252525'
						strokeWidth='1.5'
						strokeLinejoin='round'
					/>
				</svg>
			</label>

			{error && (
				<p
					className='text-red-500 text-sm'
					id='image-upload-error'
					role='alert'
				>
					{error.message}
				</p>
			)}
		</div>
	);
};

export default ImageUpload;
