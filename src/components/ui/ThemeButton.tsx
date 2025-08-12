import { Button, ButtonProps, cn } from '@heroui/react'
import React from 'react'

export default function ThemeButton({ children, className, isIconOnly, disabled, ...props }: { children: React.ReactNode, className?: string, isIconOnly?: boolean } & ButtonProps) {
  return (
    <Button color='primary' isIconOnly={isIconOnly} {...props} className={cn(
      isIconOnly ? "rounded-full p-2 scale-100 md:scale-125" : "text-md md:text-lg p-7 md:p-9  py-5 md:py-6 rounded-full font-semibold",
      className)} >
      {children}
    </Button>
  )
}
