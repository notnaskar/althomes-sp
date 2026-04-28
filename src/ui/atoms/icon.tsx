interface IconProps {
	children: React.ReactNode
	size?: number
	className?: string
}

export default function Icon({ children, size = 24, className }: IconProps) {
	return (
		<span
			className={className}
			style={{
				width: size,
				height: size,
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{children}
		</span>
	)
}
