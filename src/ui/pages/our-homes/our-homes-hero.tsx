import Image from 'next/image'
import { FaRightToBracket } from 'react-icons/fa6'
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
		<section className="bg-background relative z-0 min-h-[400px] overflow-x-clip md:min-h-[500px]">
			{/* CONTENT: heroBackground */}
			{heroBackground?.asset && (
				<div className="absolute inset-y-0 right-[-90px] w-full sm:-right-[160px] md:-right-[220px] lg:-right-[190px] lg:w-[90%]">
					<Image
						src={urlFor(heroBackground.asset)
							.width(1440)
							.height(650)
							.quality(100)
							.url()}
						alt=""
						fill
						sizes="(min-width: 1024px) 1440px, 100vw"
						loading="eager"
						priority
						className="top-0 object-cover object-left lg:-right-[100px]"
						style={{ right: 0 }}
					/>
				</div>
			)}

			{/* CONTENT: heroHeadline */}
			<div className="absolute bottom-1/8 left-1/8 z-10 w-[80%] max-w-[480px]">
				<h1 className="font-stories text-foreground pb-6 text-[60px] leading-[60px] tracking-[0.08em] lg:text-[72px] lg:tracking-[0.1em]">
					{heroHeadline ?? 'Welcome to our homes, find your next escape'}
				</h1>
			</div>
		</section>
	)
}
