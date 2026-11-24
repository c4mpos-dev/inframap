import { getCategory } from '@/domain/categories'
import type { CategoryId } from '@/domain/types'
import { StrokeIcon } from './StrokeIcon'

interface CategoryIconProps {
  categoryId: CategoryId
  size?: number
  strokeWidth?: number
  className?: string
}

export function CategoryIcon({
  categoryId,
  size = 22,
  strokeWidth = 2,
  className,
}: CategoryIconProps) {
  return (
    <StrokeIcon
      path={getCategory(categoryId).iconPath}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  )
}
