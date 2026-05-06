import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

type HomePageData = NonNullable<HOME_PAGE_QUERY_RESULT>

type Props = {
	heroImage: NonNullable<HomePageData['heroImage']>
	navLabels: NonNullable<HomePageData['navLabels']>
}

export default function NavLabels({ heroImage, navLabels }: Props) {
	const imageUrl = heroImage.asset
		? urlFor(heroImage.asset).width(1920).url()
		: null

	if (!imageUrl) return null

	return (
		<div className="relative aspect-[16/9] w-full overflow-hidden">
			<Image
				src={imageUrl}
				alt={heroImage.alt ?? ''}
				fill
				priority
				className="object-cover"
			/>
			{navLabels.map((item, i) => {
				const xM = item.xMobile ?? 50
				const yM = item.yMobile ?? 50
				const xD = item.xDesktop ?? xM
				const yD = item.yDesktop ?? yM

				return (
					<Link
						key={item._key ?? i}
						href={item.link ?? '#'}
						data-nav-label={i}
						className="nav-label absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
						style={
							{
								'--xm': `${xM}%`,
								'--ym': `${yM}%`,
								'--xd': `${xD}%`,
								'--yd': `${yD}%`,
								left: 'var(--xm)',
								top: 'var(--ym)',
							} as React.CSSProperties
						}
					>
						{item.label}
					</Link>
				)
			})}
			<style>{`
				@media (min-width: 768px) {
					.nav-label { left: var(--xd); top: var(--yd); }
				}
			`}</style>
		</div>
	)
}
