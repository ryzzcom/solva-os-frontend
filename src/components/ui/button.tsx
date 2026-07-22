import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center font-urbanist font-medium tracking-normal whitespace-nowrap transition-all duration-150 outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[#2e67b1] text-white border border-transparent hover:bg-[#255694] shadow-xs',
        secondary:
          'bg-[#f36f26] text-white border border-transparent hover:bg-[#d85e1c] shadow-xs',
        tertiary:
          'bg-transparent text-[#2e67b1] border border-[#2e67b1] hover:bg-[#e6effa]',
        outline:
          'bg-white text-[#1e293b] border border-[#d8dee8] hover:bg-slate-50 hover:border-slate-300',
        ghost:
          'bg-transparent text-[#2e67b1] hover:bg-[#f5f4fb]',
        destructive:
          'bg-[#dc2626] text-white border border-transparent hover:bg-[#b91c1c] shadow-xs',
        link: 'text-[#2e67b1] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-[40px] px-4 py-2 text-[18px] leading-[20px] rounded-[8px] gap-1.5 [&_svg]:size-[20px]',
        sm: 'h-[34px] px-3 py-1.5 text-sm rounded-[6px] gap-1 [&_svg]:size-[16px]',
        lg: 'h-[48px] px-6 py-2.5 text-[18px] leading-[20px] rounded-[8px] gap-2 [&_svg]:size-[24px]',
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
          <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
