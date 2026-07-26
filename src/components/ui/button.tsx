import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center font-urbanist font-medium tracking-normal whitespace-nowrap transition-all duration-150 outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-primary text-white border border-transparent hover:bg-brand-hover shadow-xs',
        secondary:
          'bg-accent-orange text-white border border-transparent hover:bg-accent-orange-hover shadow-xs',
        tertiary:
          'bg-transparent text-brand-primary border border-brand-primary hover:bg-bg-subtle',
        outline:
          'bg-white text-navy-main border border-card-border hover:bg-slate-50 hover:border-slate-300',
        ghost:
          'bg-transparent text-brand-primary hover:bg-bg-subtle',
        destructive:
          'bg-rose-600 text-white border border-transparent hover:bg-rose-700 shadow-xs',
        link: 'text-brand-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-[40px] px-4 py-2 text-[18px] rounded-[8px] gap-2 [&_svg]:size-[20px]',
        sm: 'h-[34px] px-3 py-1.5 text-sm rounded-[6px] gap-1.5 [&_svg]:size-[16px]',
        lg: 'h-[48px] px-6 py-2.5 text-[18px] rounded-[8px] gap-2.5 [&_svg]:size-[24px]',
        icon: 'size-[40px] rounded-[8px] p-0 flex items-center justify-center [&_svg]:size-[20px]',
        'icon-sm': 'size-[34px] rounded-[6px] p-0 flex items-center justify-center [&_svg]:size-[16px]',
        'icon-lg': 'size-[48px] rounded-[8px] p-0 flex items-center justify-center [&_svg]:size-[24px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="inline-flex items-center justify-center shrink-0">{leftIcon}</span>
        )}
        {children && <span className="inline-flex items-center leading-none">{children}</span>}
        {!isLoading && rightIcon && (
          <span className="inline-flex items-center justify-center shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
