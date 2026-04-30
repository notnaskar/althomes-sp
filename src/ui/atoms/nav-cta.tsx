import Link from 'next/link'

interface NavCtaProps {
	label: string
	href: string
	variant?: 'dark' | 'light'
	compact?: boolean
}

export default function NavCta({
	label,
	href,
	variant = 'dark',
	compact = false,
}: NavCtaProps) {
	const colorClasses =
		variant === 'dark'
			? 'bg-primary text-primary-foreground'
			: 'bg-background text-foreground'
	const sizeClasses = compact
		? 'h-[30px] px-3 min-w-[70px]'
		: 'h-12 px-6 min-w-[192px]'
	return (
		<Link
			href={href}
			className={`inline-flex items-center justify-center rounded-[5px] text-[14px] font-bold tracking-[0.3em] transition-opacity hover:opacity-90 ${colorClasses} ${sizeClasses}`}
		>
			{label}
		</Link>
	)
}
