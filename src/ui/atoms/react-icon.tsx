import { getIcon } from '@/ui/atoms/icon-map'

interface ReactIconProps {
  name: string | null | undefined
  size?: number
  className?: string
}

export default function ReactIcon({ name, size = 24, className }: ReactIconProps) {
  const IconComp = getIcon(name)
  if (!IconComp) return null
  return <IconComp size={size} className={className} />
}
