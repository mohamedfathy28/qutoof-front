"use client";
import React from "react";

// Define the props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| "default"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| "destructive";
	size?: "default" | "sm" | "lg" | "xl" | "icon";
}

// Reusable Button component
const Button: React.FC<ButtonProps> = ({
	className = "",
	variant = "default",
	size = "default",
	children,
	...props
}) => {
	// Base button styles
	const baseStyles =
		"inline-flex items-center justify-center rounded-[8px] font-medium transition-colors focus:outline-none focus:ring-0 focus:border-0";

	// Variant-specific styles
	const variantStyles = {
		default: "bg-[#009444] text-white hover:bg-[#00431F]",
		outline:
			"border-2 border-[#009444] bg-transparent hover:bg-[#009444] text-[#009444] hover:text-[#fff]",
		secondary:
			"bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
		ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-200",
		link: "text-[#009444]  bg-transparent",
		destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
	};

	// Size-specific styles
	const sizeStyles = {
		default: "h-10 px-2 py-2 text-sm md:text-base",
		sm: "h-9 rounded-md px-3 text-sm",
		lg: "h-11 rounded-md px-8 text-lg",
		xl: "h-12 rounded-md px-8 text-lg",
		icon: "h-10 w-10 p-0 justify-center",
	};

	// Combine all styles
	const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${className}
  `.trim();

	return (
		<button className={combinedClassName} {...props}>
			{children}
		</button>
	);
};

export default Button;
