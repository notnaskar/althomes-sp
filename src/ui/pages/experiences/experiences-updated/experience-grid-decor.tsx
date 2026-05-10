import type { CSSProperties } from 'react'
import HeroDecorImage from '@/ui/molecules/hero-decor-image'

interface SanityImageField {
	asset?: { _ref?: string; _id?: string; _type?: string; url?: string } | null
	alt?: string | null
}

type Box = {
	top?: string
	left?: string
	right?: string
	bottom?: string
	width: string
	height: string
}

type Placement = {
	desktop: Box
	/** 'hidden' = hidden under 820px. Box = mobile size/position (Phase 2 — not yet wired). */
	mobile: Box | 'hidden'
	objectPosition?: string
}

export const DECOR_PLACEMENTS = {
	flower: {
		desktop: { top: '-180px', left: '0', width: '500px', height: '560px' },
		mobile: 'hidden',
		objectPosition: 'top left',
	},
	galaxy: {
		desktop: { top: '40%', left: '-100px', width: '340px', height: '340px' },
		mobile: 'hidden',
		objectPosition: 'center left',
	},
	stars: {
		desktop: { top: '50%', left: '-80px', width: '380px', height: '220px' },
		mobile: 'hidden',
	},
	basket: {
		desktop: { top: '60px', right: '0', width: '354px', height: '284px' },
		mobile: 'hidden',
	},
	daisy: {
		desktop: { right: '40px', bottom: '80px', width: '200px', height: '200px' },
		mobile: 'hidden',
	},
} as const satisfies Record<string, Placement>

export type DecorKey = keyof typeof DECOR_PLACEMENTS

export function DecorBleed({
	placement,
	asset,
	sizes,
}: {
	placement: DecorKey
	asset?: SanityImageField | null
	sizes?: string
}) {
	const cfg: Placement = DECOR_PLACEMENTS[placement]
	const d = cfg.desktop

	const style: CSSProperties = {
		top: d.top,
		left: d.left,
		right: d.right,
		bottom: d.bottom,
		width: d.width,
		height: d.height,
	}

	const hideMobile = cfg.mobile === 'hidden'

	return (
		<div
			aria-hidden="true"
			className={`pointer-events-none absolute ${hideMobile ? 'max-[820px]:hidden' : ''}`}
			style={style}
		>
			<HeroDecorImage
				asset={asset}
				alt=""
				sizes={sizes ?? d.width}
				style={{
					objectFit: 'contain',
					objectPosition: cfg.objectPosition ?? 'center',
				}}
			/>
		</div>
	)
}
