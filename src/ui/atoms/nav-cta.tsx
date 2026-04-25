interface NavCtaProps {
  label: string
  href: string
  variant?: 'dark' | 'light'
  compact?: boolean
}

export default function NavCta({ label, href, variant = 'dark', compact = false }: NavCtaProps) {
  const bg = variant === 'dark' ? '#2F5D50' : '#FCF6EA'
  const color = variant === 'dark' ? '#FCF6EA' : '#3A3A3A'
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-[5px] font-bold tracking-[0.3em] transition-opacity hover:opacity-90"
      style={{
        background: bg,
        color,
        height: compact ? 30 : 48,
        padding: compact ? '0 12px' : '0 24px',
        minWidth: compact ? 70 : 192,
        fontSize: 14,
      }}
    >
      {label}
    </a>
  )
}
