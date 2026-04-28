import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { OUR_HOMES_PAGE_QUERY_RESULT } from '@/sanity/types'

// FALLBACKS:
// heroHeadline → 'Welcome to our homes, find your next escape'

type PageData = NonNullable<OUR_HOMES_PAGE_QUERY_RESULT>

type Props = {
	heroHeadline: string | null
	heroBackground: PageData['heroImage']
}

export default function OurHomesHero({ heroHeadline, heroBackground }: Props) {
	return (
		<section className="relative min-h-[490px] overflow-hidden bg-background">
			{/* CONTENT: heroBackground */}
			{heroBackground?.asset && (
				<div
					className="absolute top-[-157px] left-[16%] w-full max-w-[1200px] h-[646px] pointer-events-none max-[820px]:top-[-43px] max-[820px]:left-0 max-[820px]:h-[336px]"
					aria-hidden="true"
				>
					<Image
						src={urlFor(heroBackground.asset).url()}
						alt=""
						fill
						sizes="100vw"
						loading="eager"
						priority
						className="object-cover"
					/>
				</div>
			)}

			{/* CONTENT: heroHeadline */}
			<div className="relative z-10 pt-[232px] px-[90px] max-[820px]:pt-[167px] max-[820px]:px-[18px]">
				<h1 className="font-heading italic text-[72px] leading-[70px] tracking-[0.1em] text-foreground max-w-[520px] max-[820px]:text-[48px] max-[820px]:leading-[56px]">
					{heroHeadline ?? 'Welcome to our homes, find your next escape'}
				</h1>
			</div>

			{/* STATIC — visual booking bar, no form action */}
			<div className="relative z-10 px-[90px] pt-8 pb-10 flex flex-row items-end gap-[40px] max-[820px]:px-[18px] max-[820px]:pt-7 max-[820px]:pb-8 max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:gap-5">
				<div className="flex flex-col gap-1.5 flex-[2] max-[820px]:flex-none">
					<span className="text-[15px] tracking-[0.1em] text-foreground">
						Check In &nbsp;&nbsp;→&nbsp;&nbsp; Check Out
					</span>
					<div className="h-px bg-[#5F5D5D] w-full" />
				</div>

				<div className="flex flex-col gap-1.5 flex-1 max-[820px]:flex-none">
					<span className="text-[15px] tracking-[0.1em] text-foreground">Guests</span>
					<div className="h-px bg-[#5F5D5D] w-full" />
				</div>

				<div className="flex flex-col gap-1.5 flex-1 max-[820px]:flex-none">
					<span className="text-[15px] tracking-[0.1em] text-foreground">Promo Code</span>
					<div className="h-px bg-[#5F5D5D] w-full" />
				</div>

				<div className="inline-flex items-center justify-center bg-accent text-accent-foreground font-bold text-[12px] tracking-[0.3em] uppercase rounded-[5px] px-[22px] py-3 whitespace-nowrap flex-shrink-0 cursor-default select-none">
					FIND AVAILABILITY
				</div>
			</div>
		</section>
	)
}
