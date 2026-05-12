import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200",
          {
            'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-500 hover:to-purple-500 shadow-blue-500/25': variant === 'default',
            'border border-white/10 bg-transparent hover:bg-white/5 text-white': variant === 'outline',
            'hover:bg-white/10 text-white': variant === 'ghost',
            'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20': variant === 'glass',
            'h-12 px-6 py-2': size === 'default',
            'h-10 rounded-xl px-4 text-xs': size === 'sm',
            'h-14 rounded-3xl px-8 text-base': size === 'lg',
            'h-12 w-12': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
