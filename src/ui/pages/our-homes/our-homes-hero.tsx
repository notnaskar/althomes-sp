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
		<section className="bg-background relative z-0 min-h-[280px] overflow-x-clip sm:min-h-[340px] md:min-h-[390px]">
			{/* CONTENT: heroBackground */}
			{heroBackground?.asset && (
				<div className="inset-y-0 -right-[80px] left-0 sm:-right-[160px] md:-right-[220px] lg:-right-[290px]">
					<Image
						src={urlFor(heroBackground.asset).width(1440).quality(100).url()}
						alt=""
						fill
						sizes="(min-width: 1024px) 1440px, 100vw"
						loading="eager"
						priority
						className="top-0 -right-[100px] object-cover"
					/>
				</div>
			)}

			{/* CONTENT: heroHeadline */}
			<div className="relative z-10 mx-6 pt-20 sm:mx-8 sm:pt-[110px] md:mx-[100px] md:max-w-[800px] md:pt-[140px] lg:mx-[200px] lg:pt-[167px]">
				<h1 className="font-stories text-foreground max-w-[500px] pb-6 text-[30px] leading-[42px] tracking-[0.08em] sm:pb-8 sm:text-[36px] sm:leading-[50px] md:text-[44px] md:leading-[56px] lg:text-[48px] lg:tracking-[0.1em]">
					{heroHeadline ?? 'Welcome to our homes, find your next escape'}
				</h1>
			</div>
		</section>
	)
}
