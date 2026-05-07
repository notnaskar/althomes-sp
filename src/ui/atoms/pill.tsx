interface PillProps {
	label: string
	href: string
	icon: React.ReactNode
}

export default function Pill({ label, href, icon }: PillProps) {
	return (
		<a
			href={href}
			className="bg-background text-foreground relative flex h-[32px] w-[142px] items-center justify-end rounded-[20px] pr-9 pl-2 text-right text-[9px] leading-[1.1] tracking-[0.1em] whitespace-pre-line shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] max-[820px]:w-auto max-[820px]:px-4"
		>
			{label}
			<span className="absolute top-0 right-0 flex h-[30px] w-[30px] items-center justify-center rounded-full">
				{icon}
			</span>
		</a>
	)
}
