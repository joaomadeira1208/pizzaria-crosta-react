import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  fullWidth = false,
  icon
}) => {
  const baseClasses = 'py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    secondary: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-sm',
    outline: 'bg-transparent border border-red-600 text-red-600 hover:bg-red-50',
    danger: 'bg-red-700 hover:bg-red-800 text-white shadow-sm'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${disabled ? disabledClasses : ''}
    ${widthClass}
    ${className}
  `;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;