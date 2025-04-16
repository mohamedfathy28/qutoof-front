"use client"
import React, { useState, ChangeEvent } from 'react';

interface PriceInputProps {
    maxValue?: number;
    minValue?: number;
    onChange?: (value: number) => void;
    initialValue?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    label?: string
    currency?: string
}

const PriceInput: React.FC<PriceInputProps> = ({
    maxValue = 999999999,
    minValue = 0,
    onChange,
    initialValue = '',
    placeholder = '0.00',
    disabled = false,
    className = '',
    label,
    currency
}) => {
    const [value, setValue] = useState<string>(initialValue);
    const [error, setError] = useState<string>('');

    const formatPrice = (input: string): string => {
        // Remove all non-digits/dots
        let cleanNum = input.replace(/[^0-9.]/g, '');

        // Handle decimal points
        const parts = cleanNum.split('.');
        if (parts.length > 2) {
            cleanNum = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        // Format with commas
        const [whole, decimal] = cleanNum.split('.');
        let formatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (decimal) formatted += `.${decimal}`;

        return formatted;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value;
        const numericValue = Number(input.replace(/,/g, ''));

        // Validation checks
        if (isNaN(numericValue)) {
            setError('Please enter a valid number');
            return;
        }

        if (numericValue > maxValue) {
            setError(`Maximum value is ${maxValue.toLocaleString()}`);
            return;
        }

        if (numericValue < minValue) {
            setError(`Minimum value is ${minValue.toLocaleString()}`);
            return;
        }

        if (input.split('.')[1]?.length > 2) {
            setError('Maximum 2 decimal places allowed');
            return;
        }

        setError('');
        const formatted = formatPrice(input);
        setValue(formatted);

        // Pass the numeric value to parent component if needed
        onChange?.(numericValue);
    };

    const baseInputClasses = `
    w-full 
    outline-none 
    transition-colors
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${error
            ? 'border-red-500 focus:ring-0'
            : ''
        }
  `;

    return (
        <div className="space-y-2">
            {label && <label className='text-[#656C77] text-[16px] leading-[24px] font-[500] mb-2'>{label}</label>}
            <div className="flex justify-center items-center gap-2 border border-[#ECECEE] rounded-[8px] bg-white overflow-hidden px-4 py-2 ">

                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${baseInputClasses} ${className}`.trim()}
                    aria-invalid={!!error}
                />

                {currency && <span className={`
                w-10
                text-[16px]
                font-[400]
                ${disabled ? 'text-gray-400' : 'text-[#363636]'}
        `}>
                    {currency}
                </span>}
            </div>
            {error && (
                <p className="text-red-500 text-sm" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PriceInput;