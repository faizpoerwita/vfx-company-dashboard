import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { ButtonProps } from './types'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type = 'button', disabled = false, className = '', onClick }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2',
          'bg-primary text-white hover:bg-primary/90',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
