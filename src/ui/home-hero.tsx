import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { HOME_PAGE_QUERY_RESULT, SITE_QUERY_RESULT } from '@/sanity/types'
import HeroDecorImage from '@/ui/molecules/hero-decor-image'
import css from './home-hero.module.css'

type Props = {
	page: NonNullable<HOME_PAGE_QUERY_RESULT>
	site: SITE_QUERY_RESULT
}

export default function HomeHero({ page, site }: Props) {
	const waHref = site?.whatsappNumber
		? `https://wa.me/${site.whatsappNumber.replace(/\D/g, '')}`
		: null

	const imageUrl = page.heroImage?.asset
		? urlFor(page.heroImage.asset).width(900).height(900).url()
		: null

	return (
		<section className={css.hero}>
			{/* Background decorative circle */}
			<div className={css.bgCircle}>
				<HeroDecorImage asset={site?.heroBgCircle} sizes="1110px" />
			</div>

			{/* Hero image — no clip, asset handles its own shape */}
			{imageUrl && (
				<div className={css.heroImg}>
					<Image
						src={imageUrl}
						alt={page.heroImage?.alt ?? ''}
						fill
						priority
						sizes="856px"
						className="object-cover"
					/>
				</div>
			)}

			{/* Decorative elements */}
			<div className={css.stars}>
				<HeroDecorImage asset={site?.heroDecorStars} sizes="336px" />
			</div>
			<div className={css.flowers}>
				<HeroDecorImage asset={site?.heroDecorFlowers} sizes="199px" />
			</div>
			<div className={css.stripes}>
				<HeroDecorImage asset={site?.heroDecorStripes} sizes="146px" />
			</div>

			{/* Hero headline */}
			<div className={css.headline}>
				<h1 className={`${css.headlineH1} font-heading`}>
					{page.heroHeadline || 'Travel Beyond, Discover Within'}
				</h1>
			</div>

			{/* Navigation badge buttons */}
			<div className={css.badges} aria-label="Site sections">
				{page.navLabels?.map((item, i) => {
					const xM = item.xMobile ?? item.xDesktop ?? 50
					const yM = item.yMobile ?? item.yDesktop ?? 50
					const xD = item.xDesktop ?? xM
					const yD = item.yDesktop ?? yM

					return (
						<Link
							key={item._key ?? i}
							href={item.link ?? '#'}
							className={css.badge}
							style={
								{
									'--xm': `${xM}%`,
									'--ym': `${yM}%`,
									'--xd': `${xD}%`,
									'--yd': `${yD}%`,
								} as React.CSSProperties
							}
						>
							{item.label}
						</Link>
					)
				})}
			</div>

			{/* Floating action pills */}
			<div className={css.actions}>
				{site?.bookDirectLink && (
					<a href={site.bookDirectLink} className={css.pill}>
						{'Book Direct\nBest Rate Guaranteed'}
						<span className={`${css.pillIcon} ${css.pillIconBook}`}>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
								strokeLinejoin="round"
								width="18"
								height="18"
							>
								<path d="M4 19.5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-1.5z" />
								<path d="M8 7h8M8 11h8M8 15h5" />
							</svg>
						</span>
					</a>
				)}
				{waHref && (
					<a
						href={waHref}
						className={css.pill}
						target="_blank"
						rel="noopener noreferrer"
					>
						{'Have a query or\nlooking for offers?'}
						<span className={`${css.pillIcon} ${css.pillIconWa}`}>
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								width="18"
								height="18"
							>
								<path d="M20.52 3.48A11.94 11.94 0 0 0 12.04 0C5.46 0 .12 5.34.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.65a11.9 11.9 0 0 0 5.77 1.47c6.58 0 11.92-5.34 11.92-11.92 0-3.18-1.24-6.18-3.45-8.42zM12.05 21.8a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.27c0-5.46 4.45-9.9 9.9-9.9 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.88-9.93 9.88zm5.43-7.41c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.57-.49-.5-.66-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.21 5.08 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
							</svg>
						</span>
					</a>
				)}
			</div>
		</section>
	)
}
