export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[14px] border-2 px-5 text-center no-underline transition-[transform,box-shadow] duration-150 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-asfalto bg-faixa font-extrabold text-asfalto shadow-hard enabled:hover:-translate-y-px enabled:hover:shadow-[0_4px_0_var(--color-asfalto)] enabled:active:translate-y-px enabled:active:shadow-none disabled:bg-meio-fio disabled:text-brita disabled:shadow-none',
  secondary:
    'border-asfalto bg-branco font-bold text-asfalto enabled:hover:bg-concreto disabled:text-brita',
  danger:
    'border-aberta bg-branco font-bold text-aberta enabled:hover:bg-concreto disabled:opacity-60',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-12 text-[15px]',
  lg: 'h-14 text-[17px]',
}

export function buttonClasses(variant: ButtonVariant, size: ButtonSize, className = ''): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()
}
