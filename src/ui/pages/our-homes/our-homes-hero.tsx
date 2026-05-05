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
		<section className="bg-background relative z-0 min-h-[490px] overflow-hidden">
			{/* CONTENT: heroBackground */}
			{heroBackground?.asset && (
				<div
					className="max-w-100% pointer-events-none absolute top-[-157px] left-[15%] h-[646px] w-full max-[820px]:top-[-43px] max-[820px]:left-0 max-[820px]:h-[336px]"
					aria-hidden="true"
				>
					<Image
						src={urlFor(heroBackground.asset).width(1440).quality(85).url()}
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
				<h1 className="font-stories text-foreground max-w-[60%] pb-[32px] text-[72px] leading-[70px] tracking-[0.1em] max-[820px]:text-[48px] max-[820px]:leading-[56px]">
					{heroHeadline ?? 'Welcome to our homes, find your next escape'}
				</h1>
			</div>
		</section>
	)
}
