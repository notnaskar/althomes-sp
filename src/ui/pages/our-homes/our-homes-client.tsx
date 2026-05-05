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

const labelClass =
	'block text-xs font-semibold uppercase tracking-[0.1em] mb-1 text-muted font-sans'

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
	root: 'p-5 font-sans select-none',
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
		'mx-auto flex h-8 w-8 items-center justify-center text-sm text-foreground transition-all rounded-full hover:bg-accent/40 focus:outline-none',
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
				className="relative z-10 mt-[32px] mr-[10%] mb-[32px] ml-[10%] flex flex-row items-end gap-[40px] bg-white px-[32px] pt-8 pb-10 max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:gap-5 max-[820px]:px-[18px] max-[820px]:pt-7 max-[820px]:pb-8"
			>
				{/* Date range trigger */}
				<div className="relative flex-[2]">
					<button
						type="button"
						onClick={() => setCalendarOpen((v) => !v)}
						className="group w-full text-left focus:outline-none"
					>
						<span className={labelClass}>Check In / Check Out</span>
						<div className="flex min-h-[24px] items-center gap-2">
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
						<div className="bg-muted group-focus:bg-foreground mt-1.5 h-px w-full transition-colors" />
					</button>
					{(range?.from || range?.to) && (
						<button
							type="button"
							onClick={handleClearSearch}
							className="text-muted hover:text-foreground mt-1 font-sans text-[11px] tracking-[0.1em] uppercase transition-colors"
						>
							Clear dates
						</button>
					)}
					{errors.dates && (
						<p className="mt-1 text-xs text-[color:var(--color-terracotta)]">
							{errors.dates}
						</p>
					)}

					{/* Calendar popover — anchored to this field's width */}
					{calendarOpen && (
						<div className="absolute top-full left-0 z-50 mt-1 min-w-full overflow-x-auto rounded-xl border border-[color:var(--color-stroke)] bg-white shadow-xl">
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

				{/* Adults */}
				<div className="flex flex-1 flex-col gap-2 max-[820px]:flex-none">
					<span className={labelClass}>Adults</span>
					<div className="flex items-center gap-3">
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
							onClick={() => setAdults((v) => v + 1)}
							className={counterBtnClass}
							aria-label="Increase adults"
						>
							+
						</button>
					</div>
					<div className="bg-muted h-px w-full" />
				</div>

				{/* Children */}
				<div className="flex flex-1 flex-col gap-2 max-[820px]:flex-none">
					<span className={labelClass}>Children</span>
					<div className="flex items-center gap-3">
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
							onClick={() => setChildren((v) => v + 1)}
							className={counterBtnClass}
							aria-label="Increase children"
						>
							+
						</button>
					</div>
					<div className="bg-muted h-px w-full" />
				</div>

				{/* Submit */}
				<button
					type="button"
					onClick={handleSearch}
					disabled={isSearching}
					className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex flex-shrink-0 cursor-pointer items-center justify-center rounded-[5px] px-[22px] py-3 text-[12px] font-bold tracking-[0.3em] whitespace-nowrap uppercase transition select-none disabled:opacity-50"
				>
					{isSearching ? 'SEARCHING…' : 'FIND AVAILABILITY'}
				</button>
			</div>

			{availableIds !== null && (
				<div className="ml-[10%] mr-[10%] mb-2 flex items-center gap-2 font-sans text-xs text-muted tracking-[0.05em]">
					<span>
						Showing {displayed.length} of {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
					</span>
					<span>·</span>
					<button
						type="button"
						onClick={handleClearSearch}
						className="underline underline-offset-2 hover:text-foreground transition-colors"
					>
						Clear search
					</button>
				</div>
			)}

			{/* Property listing */}
			<section
				ref={resultsRef}
				className={`px-[90px] max-[820px]:px-[18px] transition-opacity duration-300${isSearching ? ' opacity-50 pointer-events-none' : ''}`}
			>
				{availableIds !== null && displayed.length === 0 ? (
					<div className="py-12 text-center">
						<p className="mb-6 font-sans text-muted">
							No properties available for the selected dates.
						</p>
						<button
							type="button"
							onClick={handleClearSearch}
							className="rounded-[5px] bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-accent-foreground transition hover:bg-accent/90"
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
								showcaseDecorWidth={property.showcaseDecorWidth ?? null}
								showcaseDecorHeight={property.showcaseDecorHeight ?? null}
								showcaseDecorRotation={property.showcaseDecorRotation ?? null}
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
