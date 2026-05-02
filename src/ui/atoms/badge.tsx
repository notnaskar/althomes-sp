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
				'absolute inline-flex h-[26px] items-center justify-center rounded-[5px] bg-accent px-[14px] text-[13px] font-bold tracking-[0.3em] text-accent-foreground transition-transform hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]'
			}
			style={style}
		>
			{label}
		</Link>
	)
}
