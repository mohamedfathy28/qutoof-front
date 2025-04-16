'use client'
import React, { useState, useRef, useEffect } from 'react';
import arrowButtom from '@/media/arrow-button.png'
import Image, { StaticImageData } from 'next/image';




interface DropdownProps {
  options: {option:string,img?:string | StaticImageData}[];
  onSelect?: (selected: {option:string,img?:string | StaticImageData}) => void;
  placeholder?: {option:string,img?:StaticImageData};
  selected?: {option:string,img?: string|StaticImageData};
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onSelect,
  placeholder,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{option:string,img?:string|StaticImageData} | null>(selected?selected:null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: {option:string,img?:string|StaticImageData}) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div 
      className={`relative inline-block ltr:pr-4 rtl:pl-4 min-w-28 ${className}`} 
      ref={dropdownRef}
    >
      {/* Dropdown Trigger */}
      <button
        type="button"
        className="flex gap-4 justify-between items-center w-full px-2 py-2 text-left bg-white rounded-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-black flex gap-2' : 'text-gray-500 flex gap-2'}>
            {selectedOption?.img ? <Image src={selectedOption.img} alt='english' width={20} height={20} className='inline ltr:mr-2 rtl:ml-2' /> : ''}
          {selectedOption?.option || placeholder?.option}
        </span>
        <span className="pointer-events-none">
          <Image src={arrowButtom} alt="" className={isOpen ? "rotate-180" : "rotate-0"} />
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="flex flex-col justify-start items-start gap-0 absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className={`
                flex gap-2 w-full p-2 text-sm cursor-pointer 
                hover:bg-gray-100 
                ${selectedOption?.option === option.option ? 'bg-blue-50' : ''}
              `}
              onClick={() => handleOptionClick(option)}
            >
                {option.img ? <Image src={option.img} alt='english' width={20} height={20} /> : ''}
                {option.option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;