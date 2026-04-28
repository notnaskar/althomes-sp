'use client'

import { useState } from 'react'
import type { SITE_QUERY_RESULT } from '@/sanity/types'
import MenuOverlay from './menu-overlay'

type Props = {
	site: NonNullable<SITE_QUERY_RESULT>
}

export default function MenuState({ site }: Props) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<button
				type="button"
				aria-label="Open menu"
				onClick={() => setIsOpen(true)}
				className="w-8 h-8 inline-flex items-center justify-center flex-shrink-0"
			>
				<svg viewBox="0 0 25 18" width="25" height="18" fill="none">
					<line x1="0" y1="2" x2="25" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					<line x1="0" y1="9" x2="25" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					<line x1="0" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			</button>
			<MenuOverlay isOpen={isOpen} onCloseAction={() => setIsOpen(false)} site={site} />
		</>
	)
}
