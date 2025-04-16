'use client'
import React, { useState, useRef, KeyboardEvent, ClipboardEvent, RefObject } from 'react';

interface OTPInputProps {
  onComplete?: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onComplete }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputRefs: RefObject<HTMLInputElement | null>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const handleChange = (index: number, value: string): void => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Check if OTP is complete
    if (value !== '' && index === 3) {
      const completeOtp = newOtp.join('');
      onComplete?.(completeOtp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(4 - pastedData.length).fill(''));
      setOtp(newOtp);
      
      // Trigger onComplete if the pasted OTP is complete
      if (pastedData.length === 4) {
        onComplete?.(pastedData);
      }
      
      inputRefs[Math.min(pastedData.length, 3)].current?.focus();
    }
  };

  return (
      <div className="grid grid-cols-4 gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className='w-full p-4 text-center border border-[#ECECEE] bg-white rounded-[8px] outline-none text-[28px]'
            autoComplete="off"
            inputMode="numeric"
            pattern="\d*"
          />
        ))}
      </div>
  );
};

export default OTPInput;