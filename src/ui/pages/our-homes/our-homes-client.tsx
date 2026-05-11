'use client'

import { format } from 'date-fns'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
	DayPicker,
	useDayPicker,
	type DateRange,
	type MonthCaptionProps,
} from 'react-day-picker'
import { toast } from 'sonner'
import { searchAvailability } from '@/actions/availability'
import type { ALL_PROPERTIES_QUERY_RESULT } from '@/sanity/types'
import PropertyShowcase from './property-showcase'

type Props = {
	properties: ALL_PROPERTIES_QUERY_RESULT
}

const labelTypography =
	'text-[10px] font-semibold uppercase tracking-[0.1em] text-muted font-sans'

const counterBtnClass =
	'flex h-6 w-6 items-center justify-center rounded-md text-foreground/70 text-base leading-none transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground/70 select-none'

const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
	const points = dir === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.25"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<polyline points={points} />
		</svg>
	)
}

function CustomCaption({
	calendarMonth,
	displayIndex: _displayIndex,
	...rest
}: MonthCaptionProps) {
	const { goToMonth, nextMonth, previousMonth } = useDayPicker()
	const d = calendarMonth.date
	const title = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
	const navBtn =
		'absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-foreground/80 hover:text-foreground transition-colors focus:outline-none'

	return (
		<div
			{...rest}
			className="relative mb-3 flex h-9 items-center justify-center"
		>
			{previousMonth && (
				<button
					type="button"
					onClick={() => goToMonth(previousMonth)}
					className={`${navBtn} left-0`}
					aria-label="Previous month"
				>
					<ChevronIcon dir="left" />
				</button>
			)}
			<span className="font-heading text-foreground text-lg font-bold tracking-tight lg:text-xl">
				{title}
			</span>
			{nextMonth && (
				<button
					type="button"
					onClick={() => goToMonth(nextMonth)}
					className={`${navBtn} right-0`}
					aria-label="Next month"
				>
					<ChevronIcon dir="right" />
				</button>
			)}
		</div>
	)
}

const pickerClassNames = {
	root: 'p-3 lg:p-4 font-sans select-none w-[280px] lg:w-[300px]',
	months: 'flex',
	month: 'w-full',
	month_caption: '',
	nav: 'hidden',
	month_grid: 'w-full',
	weekdays: 'flex gap-1',
	weekday:
		'flex-1 text-center text-[10px] font-medium text-foreground/50 pb-1.5',
	week: 'flex gap-1 mt-1',
	day: 'flex-1 aspect-square',
	day_button:
		'flex h-full w-full items-center justify-center rounded-md bg-transparent text-[12px] text-foreground transition-colors hover:bg-primary/10 focus:outline-none',
	selected: '',
	range_start:
		'[&>button]:bg-primary [&>button]:!text-primary-foreground [&>button]:hover:bg-primary [&>button]:font-semibold',
	range_end:
		'[&>button]:bg-primary [&>button]:!text-primary-foreground [&>button]:hover:bg-primary [&>button]:font-semibold',
	range_middle:
		'[&>button]:bg-primary/40 [&>button]:!text-primary-foreground [&>button]:hover:bg-primary/40',
	today: '[&>button]:font-bold',
	outside: '[&>button]:text-foreground/25 [&>button]:hover:bg-transparent',
	disabled:
		'[&>button]:text-foreground/25 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
}

const pickerModifierClassNames = {
	preview: '[&>button]:bg-primary/15 [&>button]:hover:bg-primary/15',
}

export default function OurHomesClient({ properties }: Props) {
	const [range, setRange] = useState<DateRange | undefined>()
	const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
	const previewMatcher = useMemo<DateRange | []>(() => {
		if (!range?.from || !hoveredDate) return []
		const fromTime = range.from.getTime()
		const hoverTime = hoveredDate.getTime()
		const hasFullRange = range.to && range.to.getTime() !== fromTime
		if (hasFullRange) return []
		if (hoverTime === fromTime) return []
		const DAY = 86400000
		if (hoverTime > fromTime) {
			return { from: new Date(fromTime + DAY), to: hoveredDate }
		}
		return { from: hoveredDate, to: new Date(fromTime - DAY) }
	}, [range?.from, range?.to, hoveredDate])
	const [adults, setAdults] = useState(1)
	const [children, setChildren] = useState(0)
	const [calendarOpen, setCalendarOpen] = useState(false)
	const [availableIds, setAvailableIds] = useState<string[] | null>(null)
	const [isSearching, setIsSearching] = useState(false)
	const barRef = useRef<HTMLDivElement>(null)
	const resultsRef = useRef<HTMLElement>(null)

	useEffect(() => {
		if (!calendarOpen) return
		function onClickOutside(e: MouseEvent) {
			if (barRef.current && !barRef.current.contains(e.target as Node)) {
				setCalendarOpen(false)
			}
		}
		document.addEventListener('mousedown', onClickOutside)
		return () => document.removeEventListener('mousedown', onClickOutside)
	}, [calendarOpen])

	function handleRangeSelect(selected: DateRange | undefined) {
		setRange(selected)
		// Close only when to is strictly after from (first click sets from===to)
		if (
			selected?.from &&
			selected?.to &&
			selected.to.getTime() > selected.from.getTime()
		) {
			setCalendarOpen(false)
		}
	}

	function handleClearSearch() {
		setAvailableIds(null)
		setRange(undefined)
		setAdults(1)
		setChildren(0)
	}

	const displayed = availableIds
		? properties.filter(
				(p) =>
					p.rentalwisePropertyId &&
					availableIds.includes(p.rentalwisePropertyId),
			)
		: properties

	async function handleSearch() {
		if (!range?.from || !range?.to) {
			toast.error('Select check-in and check-out dates')
			return
		}
		setIsSearching(true)
		const result = await searchAvailability({
			checkIn: format(range.from, 'yyyy-MM-dd'),
			checkOut: format(range.to, 'yyyy-MM-dd'),
			guests: adults + children,
		})
		setIsSearching(false)
		if (!result.ok) {
			toast.error(result.error)
			return
		}
		setAvailableIds(result.availableIds)
		setTimeout(() => {
			resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}, 50)
		if (result.availableIds.length > 0) {
			const count = result.availableIds.length
			toast.success(
				`Found ${count} available propert${count === 1 ? 'y' : 'ies'}`,
			)
		}
	}

	return (
		<>
			{/* Availability bar */}
			<div
				ref={barRef}
				className="relative z-30 mx-[6%] mt-[-50px] mb-[32px] flex flex-col items-stretch gap-5 bg-white px-[18px] pt-7 pb-8 lg:mx-[10%] lg:flex-row lg:items-end lg:gap-[40px] lg:px-[32px] lg:pt-8 lg:pb-10"
			>
				{/* Date range trigger */}
				<div className="relative flex-[2]">
					<div className="mb-1.5 flex items-center justify-between">
						<span className={labelTypography}>Check In / Check Out</span>
						{(range?.from || range?.to) && (
							<button
								type="button"
								onClick={handleClearSearch}
								className="text-muted hover:text-foreground font-sans text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors"
							>
								Clear dates
							</button>
						)}
					</div>
					<button
						type="button"
						onClick={() => setCalendarOpen((v) => !v)}
						className="group w-full text-left focus:outline-none"
					>
						<div className="border-muted group-focus:border-foreground flex items-center gap-2 border-b pb-[10px] leading-6 transition-colors">
							<span className="text-foreground font-sans text-[15px] tracking-[0.1em]">
								{range?.from ? (
									format(range.from, 'dd MMM yyyy')
								) : (
									<span className="text-muted">Add dates</span>
								)}
							</span>
							<span className="text-muted font-sans text-[15px]">→</span>
							<span className="text-foreground font-sans text-[15px] tracking-[0.1em]">
								{range?.to ? (
									format(range.to, 'dd MMM yyyy')
								) : (
									<span className="text-muted">Add dates</span>
								)}
							</span>
						</div>
					</button>
					{/* Calendar popover — anchored to this field's width */}
					{calendarOpen && (
						<div className="absolute top-full left-0 z-50 mt-1 overflow-x-auto rounded-xl border border-[color:var(--color-stroke)] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
							<DayPicker
								mode="range"
								selected={range}
								onSelect={handleRangeSelect}
								numberOfMonths={1}
								startMonth={new Date()}
								endMonth={new Date(new Date().getFullYear() + 2, 11)}
								disabled={{ before: new Date() }}
								classNames={pickerClassNames}
								modifiersClassNames={pickerModifierClassNames}
								modifiers={{ preview: previewMatcher }}
								onDayMouseEnter={(date) => setHoveredDate(date)}
								onDayMouseLeave={() => setHoveredDate(null)}
								components={{ MonthCaption: CustomCaption }}
							/>
						</div>
					)}
				</div>

				{/* Adults + Children — side-by-side on mobile, inline at lg */}
				<div className="flex gap-5 lg:contents">
					{/* Adults */}
					<div className="flex flex-1 flex-col">
						<div className="mb-1.5 flex items-center justify-between">
							<span className={labelTypography}>Adults</span>
						</div>
						<div className="border-muted focus-within:border-foreground flex items-center justify-between gap-2 border-b pb-[10px] leading-6 transition-colors">
							<span className="text-foreground font-sans text-[15px] tracking-[0.1em]">
								{adults}
							</span>
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => setAdults((v) => Math.max(1, v - 1))}
									disabled={adults <= 1}
									className={counterBtnClass}
									aria-label="Decrease adults"
								>
									−
								</button>
								<button
									type="button"
									onClick={() => setAdults((v) => Math.min(16, v + 1))}
									disabled={adults >= 16}
									className={counterBtnClass}
									aria-label="Increase adults"
								>
									+
								</button>
							</div>
						</div>
					</div>

					{/* Children */}
					<div className="flex flex-1 flex-col">
						<div className="mb-1.5 flex items-center justify-between">
							<span className={labelTypography}>Children</span>
						</div>
						<div className="border-muted focus-within:border-foreground flex items-center justify-between gap-2 border-b pb-[10px] leading-6 transition-colors">
							<span className="text-foreground font-sans text-[15px] tracking-[0.1em]">
								{children}
							</span>
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => setChildren((v) => Math.max(0, v - 1))}
									disabled={children <= 0}
									className={counterBtnClass}
									aria-label="Decrease children"
								>
									−
								</button>
								<button
									type="button"
									onClick={() => setChildren((v) => Math.min(16, v + 1))}
									disabled={children >= 16}
									className={counterBtnClass}
									aria-label="Increase children"
								>
									+
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Submit */}
				<button
					type="button"
					onClick={handleSearch}
					disabled={isSearching}
					className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2 inline-flex w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-[5px] px-[22px] py-3 text-[12px] font-bold tracking-[0.3em] whitespace-nowrap uppercase transition select-none disabled:opacity-50 lg:mt-0 lg:w-auto"
				>
					{isSearching ? 'SEARCHING…' : 'FIND AVAILABILITY'}
				</button>
			</div>

			{availableIds !== null && (
				<div className="text-muted relative z-20 mx-[6%] my-8 flex items-center gap-2 font-sans text-xs tracking-[0.05em] lg:mx-[10%]">
					<span>
						Showing {displayed.length} of {properties.length} propert
						{displayed.length === 1 ? 'y' : 'ies'}
					</span>
					<span aria-hidden="true">·</span>
					<button
						type="button"
						onClick={handleClearSearch}
						className="hover:text-foreground underline underline-offset-2 transition-colors"
					>
						Clear search
					</button>
				</div>
			)}

			{/* Property listing */}
			<section
				ref={resultsRef}
				className={`relative z-20 transition-opacity lg:px-0 duration-300${isSearching ? 'pointer-events-none opacity-50' : ''}`}
			>
				{availableIds !== null && displayed.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-muted mb-6 font-sans">
							No properties available for the selected dates.
						</p>
						<button
							type="button"
							onClick={handleClearSearch}
							className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-[5px] px-6 py-3 text-sm font-bold tracking-[0.3em] uppercase transition"
						>
							Show all properties
						</button>
					</div>
				) : (
					displayed.map((property, index) => (
						<div key={property._id} className={index > 0 ? 'mt-10' : undefined}>
							<PropertyShowcase
								title={property.title ?? ''}
								slug={property.slug ?? ''}
								tagline={property.tagline ?? null}
								heroImage={property.heroImage ?? null}
								showcaseSecondaryImage={property.showcaseSecondaryImage ?? null}
								showcaseDecorImage={property.showcaseDecorImage ?? null}
								showcaseDecorTop={property.showcaseDecorTop ?? null}
								showcaseDecorRight={property.showcaseDecorRight ?? null}
								showcaseDecorBottom={property.showcaseDecorBottom ?? null}
								showcaseDecorLeft={property.showcaseDecorLeft ?? null}
								showcaseDecorWidth={property.showcaseDecorWidth ?? null}
								showcaseDecorHeight={property.showcaseDecorHeight ?? null}
								showcaseDecorRotation={property.showcaseDecorRotation ?? null}
								showcaseSecondaryDecorImage={
									property.showcaseSecondaryDecorImage ?? null
								}
								showcaseSecondaryDecorTop={
									property.showcaseSecondaryDecorTop ?? null
								}
								showcaseSecondaryDecorRight={
									property.showcaseSecondaryDecorRight ?? null
								}
								showcaseSecondaryDecorWidth={
									property.showcaseSecondaryDecorWidth ?? null
								}
								showcaseSecondaryDecorHeight={
									property.showcaseSecondaryDecorHeight ?? null
								}
								showcaseSecondaryDecorBottom={
									property.showcaseSecondaryDecorBottom ?? null
								}
								showcaseSecondaryDecorLeft={
									property.showcaseSecondaryDecorLeft ?? null
								}
								showcaseSecondaryDecorRotation={
									property.showcaseSecondaryDecorRotation ?? null
								}
								shortDescription={property.shortDescription ?? null}
								pullQuote={property.pullQuote ?? null}
								locationHeadline={property.locationHeadline ?? null}
								cardAmenities={property.cardAmenities ?? null}
								priceFrom={property.priceFrom ?? null}
							/>
						</div>
					))
				)}
			</section>
		</>
	)
}
