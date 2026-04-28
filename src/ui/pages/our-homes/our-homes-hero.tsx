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
		<section className="bg-background relative min-h-[490px] overflow-hidden">
			{/* CONTENT: heroBackground */}
			{heroBackground?.asset && (
				<div
					className="pointer-events-none absolute top-[-157px] left-[16%] h-[646px] w-full max-w-[1200px] max-[820px]:top-[-43px] max-[820px]:left-0 max-[820px]:h-[336px]"
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
			<div className="relative z-10 px-[90px] pt-[232px] max-[820px]:px-[18px] max-[820px]:pt-[167px]">
				<h1 className="font-heading text-foreground max-w-[520px] text-[72px] leading-[70px] tracking-[0.1em] italic max-[820px]:text-[48px] max-[820px]:leading-[56px]">
					{heroHeadline ?? 'Welcome to our homes, find your next escape'}
				</h1>
			</div>

			{/* STATIC — visual booking bar, no form action */}
			<div className="relative z-10 flex flex-row items-end gap-[40px] px-[90px] pt-8 pb-10 max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:gap-5 max-[820px]:px-[18px] max-[820px]:pt-7 max-[820px]:pb-8">
				<div className="flex flex-[2] flex-col gap-1.5 max-[820px]:flex-none">
					<span className="text-foreground text-[15px] tracking-[0.1em]">
						Check In &nbsp;&nbsp;→&nbsp;&nbsp; Check Out
					</span>
					<div className="h-px w-full bg-[#5F5D5D]" />
				</div>

				<div className="flex flex-1 flex-col gap-1.5 max-[820px]:flex-none">
					<span className="text-foreground text-[15px] tracking-[0.1em]">
						Guests
					</span>
					<div className="h-px w-full bg-[#5F5D5D]" />
				</div>

				<div className="flex flex-1 flex-col gap-1.5 max-[820px]:flex-none">
					<span className="text-foreground text-[15px] tracking-[0.1em]">
						Promo Code
					</span>
					<div className="h-px w-full bg-[#5F5D5D]" />
				</div>

				<div className="bg-accent text-accent-foreground inline-flex flex-shrink-0 cursor-default items-center justify-center rounded-[5px] px-[22px] py-3 text-[12px] font-bold tracking-[0.3em] whitespace-nowrap uppercase select-none">
					FIND AVAILABILITY
				</div>
			</div>
		</section>
	)
}
