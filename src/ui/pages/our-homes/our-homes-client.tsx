'use client'

import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
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

const labelClass = `block ${labelTypography} mb-1.5`

const counterBtnClass =
	'flex h-7 w-7 items-center justify-center rounded-full border border-muted text-foreground text-sm font-semibold transition hover:border-foreground hover:bg-accent hover:text-accent-foreground select-none'

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

function CustomCaption({
	calendarMonth,
	displayIndex: _displayIndex,
	...rest
}: MonthCaptionProps) {
	const { goToMonth, nextMonth, previousMonth, dayPickerProps } = useDayPicker()
	const d = calendarMonth.date
	const month = d.getMonth()
	const year = d.getFullYear()
	const startYear = (dayPickerProps.startMonth ?? new Date()).getFullYear()
	const endYear = (
		dayPickerProps.endMonth ?? new Date(year + 2, 11)
	).getFullYear()
	const years = Array.from(
		{ length: endYear - startYear + 1 },
		(_, i) => startYear + i,
	)

	const selectClass =
		'appearance-none bg-transparent text-xs font-semibold uppercase tracking-[0.1em] text-foreground cursor-pointer focus:outline-none'
	const navBtnClass =
		'flex h-7 w-7 items-center justify-center text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base'

	return (
		<div {...rest} className="mb-3 flex items-center gap-2">
			<button
				type="button"
				onClick={() => previousMonth && goToMonth(previousMonth)}
				disabled={!previousMonth}
				className={navBtnClass}
				aria-label="Previous month"
			>
				←
			</button>
			<div className="flex flex-1 items-center justify-center gap-2">
				<select
					value={month}
					onChange={(e) => goToMonth(new Date(year, Number(e.target.value), 1))}
					className={selectClass}
				>
					{MONTH_NAMES.map((name, i) => (
						<option key={i} value={i}>
							{name}
						</option>
					))}
				</select>
				<select
					value={year}
					onChange={(e) =>
						goToMonth(new Date(Number(e.target.value), month, 1))
					}
					className={selectClass}
				>
					{years.map((y) => (
						<option key={y} value={y}>
							{y}
						</option>
					))}
				</select>
			</div>
			<button
				type="button"
				onClick={() => nextMonth && goToMonth(nextMonth)}
				disabled={!nextMonth}
				className={navBtnClass}
				aria-label="Next month"
			>
				→
			</button>
		</div>
	)
}

const pickerClassNames = {
	root: 'p-3 lg:p-5 font-sans select-none',
	months: 'flex',
	month: 'w-full',
	month_caption: '',
	nav: 'hidden',
	month_grid: 'w-full border-collapse',
	weekdays: 'flex',
	weekday:
		'flex-1 text-center text-[10px] font-semibold tracking-widest text-muted pb-2 uppercase',
	week: 'flex',
	day: 'flex-1 relative',
	day_button:
		'mx-auto flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center text-sm text-foreground transition-all rounded-full hover:bg-accent/40 focus:outline-none',
	selected: '',
	range_start:
		'bg-accent/20 rounded-l-full [&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:font-semibold',
	range_end:
		'bg-accent/20 rounded-r-full [&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:font-semibold',
	range_middle:
		'bg-accent/20 [&>button]:rounded-none [&>button]:hover:rounded-none [&>button]:hover:bg-accent/40',
	today: '[&>button]:font-bold [&>button]:underline',
	outside: '[&>button]:text-muted [&>button]:hover:bg-transparent',
	disabled:
		'[&>button]:text-muted/40 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
}

export default function OurHomesClient({ properties }: Props) {
	const [range, setRange] = useState<DateRange | undefined>()
	const [adults, setAdults] = useState(1)
	const [children, setChildren] = useState(0)
	const [calendarOpen, setCalendarOpen] = useState(false)
	const [availableIds, setAvailableIds] = useState<string[] | null>(null)
	const [isSearching, setIsSearching] = useState(false)
	const [errors, setErrors] = useState<{ dates?: string }>({})
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
		setErrors({})
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
			setErrors({ dates: 'Select check-in and check-out dates' })
			return
		}
		setErrors({})
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
						<div className="border-muted group-focus:border-foreground flex h-6 items-center gap-2 border-b pb-[10px] leading-6 transition-colors">
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
					{errors.dates && (
						<p className="mt-1 text-xs text-[color:var(--color-terracotta)]">
							{errors.dates}
						</p>
					)}

					{/* Calendar popover — anchored to this field's width */}
					{calendarOpen && (
						<div className="absolute top-full left-0 z-50 mt-1 w-full max-w-[calc(100vw-3rem)] overflow-x-auto rounded-xl border border-[color:var(--color-stroke)] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] lg:w-auto lg:max-w-none lg:min-w-full">
							<DayPicker
								mode="range"
								selected={range}
								onSelect={handleRangeSelect}
								numberOfMonths={1}
								startMonth={new Date()}
								endMonth={new Date(new Date().getFullYear() + 2, 11)}
								disabled={{ before: new Date() }}
								classNames={pickerClassNames}
								components={{ MonthCaption: CustomCaption }}
							/>
						</div>
					)}
				</div>

				{/* Adults + Children — side-by-side on mobile, inline at lg */}
				<div className="flex gap-5 lg:contents">
					{/* Adults */}
					<div className="flex flex-1 flex-col">
						<span className={labelClass}>Adults</span>
						<div className="border-muted flex items-center gap-3 border-b pb-[10px] leading-6">
							<button
								type="button"
								onClick={() => setAdults((v) => Math.max(1, v - 1))}
								className={counterBtnClass}
								aria-label="Decrease adults"
							>
								−
							</button>
							<span className="text-foreground w-4 text-center font-sans text-[15px] tracking-[0.1em]">
								{adults}
							</span>
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

					{/* Children */}
					<div className="flex flex-1 flex-col">
						<span className={labelClass}>Children</span>
						<div className="border-muted flex items-center gap-3 border-b pb-[10px] leading-6">
							<button
								type="button"
								onClick={() => setChildren((v) => Math.max(0, v - 1))}
								className={counterBtnClass}
								aria-label="Decrease children"
							>
								−
							</button>
							<span className="text-foreground w-4 text-center font-sans text-[15px] tracking-[0.1em]">
								{children}
							</span>
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
				<div className="text-muted relative z-20 mb-2 flex items-center gap-2 px-[18px] font-sans text-xs tracking-[0.05em] lg:px-[90px]">
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
