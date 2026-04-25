import Link from 'next/link'

interface BadgeProps {
  label: string
  href: string
  className?: string
  style?: React.CSSProperties
}

export default function Badge({ label, href, className, style }: BadgeProps) {
  return (
    <Link
      href={href}
      className={
        className ??
        'absolute inline-flex items-center justify-center rounded-[5px] bg-[#F2C94C] px-[14px] h-[26px] font-bold text-[13px] tracking-[0.3em] text-[#3A3A3A] transition-transform hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]'
      }
      style={style}
    >
      {label}
    </Link>
  )
}
