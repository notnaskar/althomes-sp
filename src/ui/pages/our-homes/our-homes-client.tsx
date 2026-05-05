'use client'

import { useEffect, useRef, useState } from 'react'
import { DayPicker, useDayPicker, type DateRange, type MonthCaptionProps } from 'react-day-picker'
import { format } from 'date-fns'
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
	'January','February','March','April','May','June',
	'July','August','September','October','November','December',
]

function CustomCaption({ calendarMonth, displayIndex: _displayIndex, ...rest }: MonthCaptionProps) {
	const { goToMonth, nextMonth, previousMonth, dayPickerProps } = useDayPicker()
	const d = calendarMonth.date
	const month = d.getMonth()
	const year = d.getFullYear()
	const startYear = (dayPickerProps.startMonth ?? new Date()).getFullYear()
	const endYear = (dayPickerProps.endMonth ?? new Date(year + 2, 11)).getFullYear()
	const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

	const selectClass =
		'appearance-none bg-transparent text-xs font-semibold uppercase tracking-[0.1em] text-foreground cursor-pointer focus:outline-none'
	const navBtnClass =
		'flex h-7 w-7 items-center justify-center text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base'

	return (
		<div {...rest} className="flex items-center gap-2 mb-3">
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
						<option key={i} value={i}>{name}</option>
					))}
				</select>
				<select
					value={year}
					onChange={(e) => goToMonth(new Date(Number(e.target.value), month, 1))}
					className={selectClass}
				>
					{years.map((y) => (
						<option key={y} value={y}>{y}</option>
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
	const [searchError, setSearchError] = useState<string | null>(null)
	const [errors, setErrors] = useState<{ dates?: string }>({})
	const barRef = useRef<HTMLDivElement>(null)

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
		setSearchError(null)
		setIsSearching(true)
		const result = await searchAvailability({
			checkIn: format(range.from, 'yyyy-MM-dd'),
			checkOut: format(range.to, 'yyyy-MM-dd'),
			guests: adults + children,
		})
		setIsSearching(false)
		if (!result.ok) {
			setSearchError(result.error)
			return
		}
		setAvailableIds(result.availableIds)
	}

	return (
		<>
			{/* Availability bar */}
			<div
				ref={barRef}
				className="relative bg-white ml-[10%] mr-[10%] mt-[32px] mb-[32px] z-10 flex flex-row items-end gap-[40px] px-[32px] pt-8 pb-10 max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:gap-5 max-[820px]:px-[18px] max-[820px]:pt-7 max-[820px]:pb-8"
			>
				{/* Date range trigger */}
				<div className="relative flex-[2]">
					<button
						type="button"
						onClick={() => setCalendarOpen((v) => !v)}
						className="w-full text-left focus:outline-none group"
					>
						<span className={labelClass}>Check In / Check Out</span>
						<div className="flex items-center gap-2 min-h-[24px]">
							<span className="text-[15px] tracking-[0.1em] font-sans text-foreground">
								{range?.from ? (
									format(range.from, 'dd MMM yyyy')
								) : (
									<span className="text-muted">Add dates</span>
								)}
							</span>
							<span className="text-muted text-[15px] font-sans">→</span>
							<span className="text-[15px] tracking-[0.1em] font-sans text-foreground">
								{range?.to ? (
									format(range.to, 'dd MMM yyyy')
								) : (
									<span className="text-muted">Add dates</span>
								)}
							</span>
						</div>
						<div className="mt-1.5 h-px w-full bg-muted transition-colors group-focus:bg-foreground" />
					</button>
					{(range?.from || range?.to) && (
						<button
							type="button"
							onClick={() => setRange(undefined)}
							className="mt-1 text-[11px] text-muted hover:text-foreground tracking-[0.1em] font-sans uppercase transition-colors"
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
						<div className="absolute top-full left-0 z-50 mt-1 min-w-full rounded-xl border border-[color:var(--color-stroke)] bg-white shadow-xl overflow-x-auto">
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
						<span className="w-4 text-center text-[15px] tracking-[0.1em] font-sans text-foreground">
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
					<div className="h-px w-full bg-muted" />
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
						<span className="w-4 text-center text-[15px] tracking-[0.1em] font-sans text-foreground">
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
					<div className="h-px w-full bg-muted" />
				</div>

				{/* Submit */}
				<button
					type="button"
					onClick={handleSearch}
					disabled={isSearching}
					className="bg-accent text-accent-foreground inline-flex flex-shrink-0 cursor-pointer items-center justify-center rounded-[5px] px-[22px] py-3 text-[12px] font-bold tracking-[0.3em] whitespace-nowrap uppercase transition hover:bg-accent/90 disabled:opacity-50 select-none"
				>
					{isSearching ? 'SEARCHING…' : 'FIND AVAILABILITY'}
				</button>
				{searchError && (
					<p className="mt-1 text-xs text-red-600">{searchError}</p>
				)}

			</div>

			{/* Property listing */}
			<section className="px-[90px] max-[820px]:px-[18px]">
				{availableIds !== null && displayed.length === 0 ? (
					<p className="py-12 text-center text-muted font-sans">
						No properties available for the selected dates. Try different dates.
					</p>
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
