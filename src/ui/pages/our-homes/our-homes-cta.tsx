import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { OUR_HOMES_PAGE_QUERY_RESULT } from '@/sanity/types'

// FALLBACKS:
// ctaButtonLabel → 'THE ALT HOME EXPERIENCES'

type PageData = NonNullable<OUR_HOMES_PAGE_QUERY_RESULT>

type Props = {
	ctaQuestion: string | null
	ctaButtonLabel: string | null
	ctaBackground: PageData['ctaBackground']
}

export default function OurHomesCta({ ctaQuestion, ctaButtonLabel, ctaBackground }: Props) {
	return (
		<section className="relative min-h-[520px] flex flex-col items-center justify-end pb-[190px] overflow-hidden max-[820px]:min-h-[360px] max-[820px]:pb-20">
			{/* CONTENT: ctaBackground */}
			{ctaBackground?.asset && (
				<Image
					src={urlFor(ctaBackground.asset).url()}
					alt={ctaBackground.alt ?? ''}
					fill
					sizes="100vw"
					className="object-cover object-bottom"
					aria-hidden="true"
				/>
			)}

			<div className="relative z-10 flex flex-col items-center gap-6">
				{/* CONTENT: ctaQuestion */}
				{ctaQuestion && (
					<p className="font-heading italic text-[30px] leading-[40px] tracking-[0.1em] text-foreground text-center max-w-[642px] max-[820px]:text-[22px] max-[820px]:leading-[32px] max-[820px]:px-[18px]">
						{ctaQuestion}
					</p>
				)}
				{/* CONTENT: ctaButtonLabel */}
				<Link
					href="/experiences"
					className="inline-flex items-center justify-center bg-accent text-accent-foreground font-bold text-[12px] tracking-[0.3em] uppercase rounded-[5px] px-[22px] py-3 whitespace-nowrap"
				>
					{ctaButtonLabel ?? 'THE ALT HOME EXPERIENCES'}
				</Link>
			</div>
		</section>
	)
}
