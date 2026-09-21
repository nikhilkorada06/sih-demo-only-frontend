import React, { InputHTMLAttributes, ReactNode, useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isRequired?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = 'text',
      isRequired = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 tracking-wide flex items-center gap-1"
          >
            <span>{label}</span>
            {isRequired && <span className="text-rose-500 font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={computedType}
            className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-2 ${
              leftIcon ? 'pl-10' : ''
            } ${isPassword || rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                : 'border-slate-300 focus:border-gov-blue focus:ring-gov-light hover:border-slate-400'
            } ${className}`}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1 animate-fade-in">
            <span>{error}</span>
          </p>
        ) : (
          helperText && <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
