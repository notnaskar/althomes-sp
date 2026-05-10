'use client'

import { useEffect, useState } from 'react'

export default function HeaderShell({
	children,
}: {
	children: React.ReactNode
}) {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 4)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<header
			className={`fixed top-0 right-0 left-0 z-50 flex w-full flex-row-reverse items-center justify-between gap-3 px-[18px] py-4 transition-[background-color,box-shadow] duration-200 [padding-top:calc(env(safe-area-inset-top)+16px)] lg:flex-row lg:gap-6 lg:px-[90px] lg:py-6 ${
				scrolled
					? 'bg-background shadow-[0_2px_10px_rgba(0,0,0,0.08)]'
					: 'bg-transparent shadow-none'
			}`}
		>
			{children}
		</header>
	)
}
