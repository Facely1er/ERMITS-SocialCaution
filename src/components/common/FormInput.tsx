import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random()}`;
  const hasError = !!error;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`
            w-full px-3 py-2 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            transition-colors
            ${hasError 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700' 
              : 'border-gray-300 dark:border-border bg-white dark:bg-card-hover'
            }
            text-gray-900 dark:text-white
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          required={required}
          {...props}
        />
        {hasError && (
          <AlertCircle 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" 
            aria-hidden="true"
          />
        )}
      </div>
      {error && (
        <p 
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`}
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormInput;

