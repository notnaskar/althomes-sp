'use client'

import { PortableText } from 'next-sanity'
import Image from 'next/image'
import { useState } from 'react'
import type { BlockContent } from '@/sanity/types'
import ReactIcon from '@/ui/atoms/react-icon'
import { splitAmenityColumns } from './amenity-columns'

type Amenity = { name: string | null; icon: string | null }

type Props = {
	imageUrl: string | null
	amenities: Amenity[]
	houseRulesTeaser: string | null | undefined
	houseRules: BlockContent | null | undefined
}

export default function PropertyAmenitiesSection({
	imageUrl,
	amenities,
	houseRulesTeaser,
	houseRules,
}: Props) {
	const [modalOpen, setModalOpen] = useState(false)
	const columns = splitAmenityColumns(amenities)

	return (
		<section className="bg-background flex flex-col lg:flex-row">
			{/* Left: full-height image */}
			<div className="relative h-[280px] w-full self-stretch lg:h-auto lg:w-1/5">
				{imageUrl && (
					<Image
						src={imageUrl}
						alt=""
						fill
						className="object-cover"
						sizes="(max-width: 1023px) 100vw, 20vw"
					/>
				)}
			</div>

			{/* Right: content */}
			<div className="w-full px-[18px] py-[48px] lg:w-4/5 lg:py-[72px] lg:pr-[90px] lg:pl-[64px]">
				<h2 className="font-heading text-foreground mb-[48px] text-[30px] leading-[40px] font-normal tracking-[0.3em]">
					FOR US, IT&rsquo;S COMFORT FIRST
				</h2>

				{amenities.length > 0 && (
					<div className="mb-[48px] flex flex-col gap-[32px] lg:flex-row">
						{columns.map((col, ci) =>
							col.length > 0 ? (
								<div key={ci} className="flex flex-col gap-[16px]">
									{col.map((amenity, ai) => (
										<div
											key={amenity.name ?? ai}
											className="flex items-center gap-[12px]"
										>
											<ReactIcon name={amenity.icon} size={24} />
											<span className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]">
												{amenity.name}
											</span>
										</div>
									))}
								</div>
							) : null,
						)}
					</div>
				)}

				{(houseRulesTeaser || houseRules) && (
					<span className="text-foreground block font-sans text-[15px] leading-[23px] tracking-[0.1em]">
						{houseRulesTeaser && <span>{houseRulesTeaser} </span>}
						{houseRules && (
							<button
								onClick={() => setModalOpen(true)}
								className="underline underline-offset-2 hover:opacity-70"
							>
								House Rules
							</button>
						)}
					</span>
				)}
			</div>

			{/* House rules modal */}
			{modalOpen && houseRules && (
				<div
					className="bg-foreground/60 fixed inset-0 z-50 flex items-center justify-center"
					onClick={() => setModalOpen(false)}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="amenities-modal-title"
						className="bg-background relative max-h-[80vh] w-full max-w-[640px] overflow-y-auto px-[48px] py-[40px]"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={() => setModalOpen(false)}
							className="text-foreground absolute top-[16px] right-[16px] font-sans text-[20px] leading-none hover:opacity-70"
							aria-label="Close"
						>
							×
						</button>
						<h3
							id="amenities-modal-title"
							className="font-heading text-foreground mb-[24px] text-[24px] leading-[32px] tracking-[0.1em]"
						>
							House Rules
						</h3>
						<div className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em] [&_p]:mb-[8px] [&_p:last-child]:mb-0">
							<PortableText value={houseRules} />
						</div>
					</div>
				</div>
			)}
		</section>
	)
}
