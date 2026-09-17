"use client"

import { useFormStatus } from "react-dom"
import { Button, ButtonProps } from "@/components/ui/button"
import { ReactNode } from "react"

interface SubmitButtonProps extends ButtonProps {
  children: ReactNode
  loadingText?: string
}

export function SubmitButton({ children, loadingText, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" loading={pending} {...props}>
      {pending && loadingText ? loadingText : children}
    </Button>
  )
}
