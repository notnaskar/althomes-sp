'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type {
	ALL_EXPERIENCES_QUERY_RESULT,
	ALL_PROPERTIES_QUERY_RESULT,
} from '@/sanity/types'
import CircleBadge from '@/ui/atoms/circle-badge'
import ExperienceCard from './experience-card'
import { DecorBleed } from './experience-grid-decor'

interface SanityImageField {
	asset?: { _ref?: string; _id?: string; _type?: string; url?: string } | null
	alt?: string | null
}

interface ExperienceGridProps {
	experiences: ALL_EXPERIENCES_QUERY_RESULT
	properties: ALL_PROPERTIES_QUERY_RESULT
	cardsMaxShown?: number | null
	/** Sanity: experiencesPage.filterLabel */
	filterLabel?: string | null
	/** Sanity: experiencesPage.exploreCtaLabel */
	ctaLabel?: string | null
	/** Sanity: experiencesPage.exploreCtaLink */
	ctaHref?: string | null
	/** Sanity: experiencesPage.supportingTagline */
	supportingTagline?: string | null
	/** Sanity: experiencesPage.heroBadgeText */
	badgeText?: string | null
	/** Sanity: site.experiencesHeroBasket */
	decorBasket?: SanityImageField | null
	/** Sanity: site.experiencesHeroStars */
	decorStars?: SanityImageField | null
	/** Sanity: site.experiencesHeroDaisy */
	decorDaisy?: SanityImageField | null
	/** Sanity: experiencesPage.decorGalaxy */
	decorGalaxy?: SanityImageField | null
	/** Sanity: experiencesPage.heroFlower */
	heroFlower?: SanityImageField | null
}

export default function ExperienceGrid({
	experiences,
	properties,
	cardsMaxShown,
	filterLabel = 'Filter',
	ctaLabel = 'EXPLORE ALL ALT HOMES',
	ctaHref = '/our-homes',
	supportingTagline,
	badgeText,
	decorBasket,
	decorStars,
	decorDaisy,
	decorGalaxy,
	heroFlower,
}: ExperienceGridProps) {
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [filterOpen, setFilterOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const filtered = selectedId
		? experiences.filter((e) => e.propertyIds?.includes(selectedId))
		: cardsMaxShown
			? experiences.slice(0, cardsMaxShown)
			: experiences

	const selectedProperty = properties.find((p) => p._id === selectedId)
	const showCta = !cardsMaxShown

	// Close dropdown on outside click or Escape
	useEffect(() => {
		function handleOutside(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setFilterOpen(false)
			}
		}
		function handleEsc(e: KeyboardEvent) {
			if (e.key === 'Escape') setFilterOpen(false)
		}
		document.addEventListener('mousedown', handleOutside)
		document.addEventListener('keydown', handleEsc)
		return () => {
			document.removeEventListener('mousedown', handleOutside)
			document.removeEventListener('keydown', handleEsc)
		}
	}, [])

	return (
		<section className="bg-background relative z-10 w-full overflow-x-clip px-[5%] pt-[48px] pb-[80px] sm:px-[10%] sm:pt-[32px] sm:pb-[56px]">
			{/* ── Decorative bleeds — config in ./experience-grid-decor.tsx ── */}
			<DecorBleed placement="flower" asset={heroFlower} />
			<DecorBleed placement="galaxy" asset={decorGalaxy} />
			<DecorBleed placement="stars" asset={decorStars} />
			<DecorBleed placement="basket" asset={decorBasket} />
			<DecorBleed placement="daisy" asset={decorDaisy} />

			{/* ── Supporting tagline + decorative badge ── */}
			{(supportingTagline || badgeText) && (
				<div className="relative mb-[48px] flex items-end justify-between gap-[32px] max-[820px]:mb-[32px] max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:gap-[24px]">
					{supportingTagline ? (
						<p className="text-foreground font-heading w-[50%] text-[30px] leading-[40px] tracking-[0.1em] max-[820px]:max-w-none max-[820px]:text-[19px] max-[820px]:leading-[29px]">
							{supportingTagline}
						</p>
					) : (
						<span />
					)}

					<CircleBadge
						text={badgeText?.trim() || 'your questions, answered'}
						textOffset="80%"
						bgClass="bg-[var(--color-terracotta)]"
						textClass="fill-primary-foreground"
						arrowColorClass="bg-primary-foreground"
						className="absolute right-0 bottom-0 z-10 shrink-0 rotate-100 max-[820px]:self-end md:-top-[48px]"
						arrowRotationDeg={-25}
					/>
				</div>
			)}

			{/* ── Filter bar ── */}
			{properties.length > 0 && (
				<div
					ref={dropdownRef}
					className="relative mb-[48px] w-fit bg-white px-4 py-2 max-[820px]:mb-[32px]"
				>
					<button
						onClick={() => setFilterOpen((v) => !v)}
						aria-expanded={filterOpen}
						aria-controls="filter-panel"
						className="text-foreground flex min-h-[44px] items-center gap-[10px] font-sans text-[15px] leading-[23px] tracking-[0.1em]"
					>
						<span>{filterLabel}</span>
						{selectedProperty && (
							<span className="font-semibold">
								&mdash;&nbsp;{selectedProperty.title}
							</span>
						)}
						{/* Chevron — rotates when open */}
						<svg
							aria-hidden="true"
							width="9"
							height="6"
							viewBox="0 0 9 6"
							fill="none"
							className={`text-foreground transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`}
						>
							<path
								d="M1 1L4.5 5L8 1"
								stroke="currentColor"
								strokeWidth="1.2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>

					{/* Dropdown panel */}
					{filterOpen && (
						<div
							id="filter-panel"
							role="menu"
							className="absolute top-[60px] left-0 z-10 w-[288px] rounded-b-[16px] bg-white py-[8px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] max-[820px]:w-[calc(100vw-36px)]"
						>
							{/* All locations row */}
							<label className="text-foreground hover:bg-background flex cursor-pointer items-center gap-[12px] px-[24px] font-sans text-[15px] leading-[42px] tracking-[0.1em] transition-colors">
								<input
									type="checkbox"
									checked={selectedId === null}
									onChange={() => {
										setSelectedId(null)
										setFilterOpen(false)
									}}
									className="accent-primary h-[16px] w-[16px]"
								/>
								All Locations
							</label>

							{properties.map((p) => (
								<label
									key={p._id}
									className="text-foreground hover:bg-background mb-2 flex cursor-pointer items-center gap-[12px] px-[24px] font-sans text-[15px] leading-[24px] tracking-[0.1em] transition-colors"
								>
									<input
										type="checkbox"
										checked={selectedId === p._id}
										onChange={() => {
											setSelectedId(selectedId === p._id ? null : p._id)
											setFilterOpen(false)
										}}
										className="accent-primary h-[16px] w-[16px]"
									/>
									{p.title}
								</label>
							))}
						</div>
					)}
				</div>
			)}

			{/* ── Card grid ── */}
			{filtered.length === 0 ? (
				<p className="text-foreground py-[64px] text-center font-sans text-[15px] tracking-[0.1em]">
					No experiences found.
				</p>
			) : (
				<div className="grid grid-cols-3 gap-x-[32px] gap-y-[64px] max-[820px]:grid-cols-1 max-[820px]:gap-y-[48px]">
					{filtered.map((exp, i) => (
						<ExperienceCard
							key={exp._id}
							title={exp.title ?? ''}
							description={exp.description ?? null}
							image={exp.image ?? null}
							tilt={i % 2 === 0 ? 'cw' : 'ccw'}
						/>
					))}
				</div>
			)}

			{/* ── Explore CTA ── */}
			{showCta && ctaHref && (
				<div className="mt-[80px] flex justify-center max-[820px]:mt-[56px]">
					<Link
						href={ctaHref}
						className="bg-accent text-accent-foreground inline-flex h-[26px] items-center justify-center rounded-[5px] px-[24px] font-sans text-[12px] font-bold tracking-[0.3em] transition-transform hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] max-[820px]:h-[44px]"
					>
						{ctaLabel}
					</Link>
				</div>
			)}
		</section>
	)
}
