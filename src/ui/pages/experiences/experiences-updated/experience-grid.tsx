'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type {
	ALL_EXPERIENCES_QUERY_RESULT,
	ALL_PROPERTIES_QUERY_RESULT,
} from '@/sanity/types'
import HeroDecorImage from '@/ui/molecules/hero-decor-image'
import ExperienceCard from './experience-card'

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
	/** Sanity: site.experiencesHeroBasket */
	decorBasket?: SanityImageField | null
	/** Sanity: site.experiencesHeroStars */
	decorStars?: SanityImageField | null
	/** Sanity: site.experiencesHeroDaisy */
	decorDaisy?: SanityImageField | null
}

export default function ExperienceGrid({
	experiences,
	properties,
	cardsMaxShown,
	filterLabel = 'Filter',
	ctaLabel = 'EXPLORE ALL ALT HOMES',
	ctaHref = '/our-homes',
	decorBasket,
	decorStars,
	decorDaisy,
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
		<section className="bg-background relative w-full overflow-hidden px-[90px] pt-[48px] pb-[80px] max-[820px]:px-[18px] max-[820px]:pt-[32px] max-[820px]:pb-[56px]">
			{/* ── Decorative bleeds — desktop only ── */}
			{/* Stars — mid-left */}
			<div
				className="pointer-events-none absolute top-[40%] left-[-80px] h-[320px] w-[480px] max-[820px]:hidden"
				aria-hidden="true"
			>
				<HeroDecorImage asset={decorStars} alt="" sizes="480px" />
			</div>
			{/* Basket — top-right */}
			<div
				className="pointer-events-none absolute top-[60px] right-0 h-[284px] w-[354px] max-[820px]:hidden"
				aria-hidden="true"
			>
				<HeroDecorImage asset={decorBasket} alt="" sizes="354px" />
			</div>
			{/* Daisy — bottom-right */}
			<div
				className="pointer-events-none absolute right-[40px] bottom-[80px] h-[200px] w-[200px] max-[820px]:hidden"
				aria-hidden="true"
			>
				<HeroDecorImage asset={decorDaisy} alt="" sizes="200px" />
			</div>
			
			{/* ── Filter bar ── */}
			{properties.length > 0 && (
				<div
					ref={dropdownRef}
					className="relative mb-[48px] max-[820px]:mb-[32px]"
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
							className="absolute top-[44px] left-0 z-10 w-[288px] rounded-b-[16px] bg-background py-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] max-[820px]:w-[calc(100vw-36px)]"
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
									className="text-foreground hover:bg-background flex cursor-pointer items-center gap-[12px] px-[24px] font-sans text-[15px] leading-[42px] tracking-[0.1em] transition-colors"
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
							slug={exp.slug ?? null}
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
						className="bg-accent text-accent-foreground inline-flex h-[26px] items-center justify-center rounded-[5px] px-[24px] font-sans text-[12px] font-bold tracking-[0.3em] transition-transform hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-[820px]:h-[44px]"
					>
						{ctaLabel}
					</Link>
				</div>
			)}
		</section>
	)
}
