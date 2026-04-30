'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type { SITE_QUERY_RESULT } from '@/sanity/types'
import NavCta from '@/ui/atoms/nav-cta'
import SocialLinks from '@/ui/molecules/social-links'

type Props = {
	isOpen: boolean
	onCloseAction: () => void
	site: NonNullable<SITE_QUERY_RESULT>
}

export default function MenuOverlay({ isOpen, onCloseAction, site }: Props) {
	useEffect(() => {
		if (!isOpen) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onCloseAction()
		}
		document.addEventListener('keydown', handler)
		return () => document.removeEventListener('keydown', handler)
	}, [isOpen, onCloseAction])

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : ''
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div
			className="animate-in fade-in fixed inset-0 z-50 grid duration-200 min-[821px]:grid-cols-[1fr_415px] bg-background"
			role="dialog"
			aria-modal="true"
		>
			<div className="relative hidden overflow-hidden min-[821px]:block">
				{site?.menuPhoto?.asset && (
					<Image
						src={urlFor(site.menuPhoto.asset).url()}
						alt={site.menuPhoto.alt ?? ''}
						fill
						className="object-cover object-center"
						sizes="50vw"
					/>
				)}
			</div>

			<aside
				className="flex flex-col overflow-y-auto bg-primary text-primary-foreground pt-[48px] px-[40px] pb-[40px]"
			>
				<div className="mb-10 flex items-center justify-between gap-6 md:justify-end">
					{site?.navCtaLink && (
						<NavCta
							label={site.navCtaLabel ?? 'STAY WITH US'}
							href={site.navCtaLink}
							variant="light"
						/>
					)}
					<button
						type="button"
						aria-label="Close menu"
						onClick={onCloseAction}
						className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center"
					>
						<svg viewBox="0 0 25 25" width="25" height="25" fill="none">
							<line
								x1="3"
								y1="3"
								x2="22"
								y2="22"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<line
								x1="22"
								y1="3"
								x2="3"
								y2="22"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				<nav className="mt-[30px] flex flex-col items-end">
					{(site?.overlayNavLinks ?? []).map((item) => (
						<a
							key={item.url ?? item.label}
							href={item.url ?? '#'}
							className="font-heading text-[30px] leading-[40px] font-normal tracking-[0.1em] text-primary-foreground italic transition-opacity hover:opacity-75"
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className="mt-auto flex flex-col items-end gap-[18px] pt-8">
					<SocialLinks
						instagram={site?.instagramUrl}
						facebook={site?.facebookUrl}
						linkedin={site?.linkedinUrl}
						youtube={site?.youtubeUrl}
						size={26}
					/>

					<div className="flex flex-col items-end gap-[4px] text-[15px] leading-[23px] tracking-[0.1em]">
						{site?.contactPhone && (
							<div className="flex items-center gap-[10px]">
								<svg
									viewBox="0 0 24 24"
									fill="currentColor"
									width={14}
									height={14}
								>
									<path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
								</svg>
								<span>{site.contactPhone}</span>
							</div>
						)}
						{site?.contactEmail && (
							<div className="flex items-center gap-[10px]">
								<svg
									viewBox="0 0 24 24"
									fill="currentColor"
									width={14}
									height={14}
								>
									<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
								</svg>
								<span>{site.contactEmail}</span>
							</div>
						)}
					</div>
				</div>
			</aside>
		</div>
	)
}
