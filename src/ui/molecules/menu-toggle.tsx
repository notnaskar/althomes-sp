'use client'

interface MenuToggleProps {
	onOpen: () => void
}

export default function MenuToggle({ onOpen }: MenuToggleProps) {
	return (
		<button
			type="button"
			aria-label="Open menu"
			onClick={onOpen}
			className="inline-flex h-8 w-8 items-center justify-center"
		>
			<svg viewBox="0 0 25 18" width="25" height="18" fill="none">
				<line
					x1="0"
					y1="2"
					x2="25"
					y2="2"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="0"
					y1="9"
					x2="25"
					y2="9"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="0"
					y1="16"
					x2="25"
					y2="16"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</svg>
		</button>
	)
}
