import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, touched, type = 'text', ...props }, ref) => {
    const showError = error && touched;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-2 rounded-lg bg-neutral-900 border text-neutral-200 focus:outline-none focus:ring-2 transition-colors',
            {
              'border-neutral-800 focus:ring-blue-500': !showError,
              'border-red-500 focus:ring-red-500': showError,
            },
            className
          )}
          {...props}
        />
        {showError && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
