import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

interface StyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

type ButtonProps = StyleProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'lg',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />
}

type ButtonLinkProps = StyleProps & LinkProps

export function ButtonLink({
  variant = 'primary',
  size = 'lg',
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />
}
