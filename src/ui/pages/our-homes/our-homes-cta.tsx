import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

// FALLBACKS:
// ctaButtonLabel → 'THE ALT HOME EXPERIENCES'
// ctaHref → '/experiences'

type SanityImgField = {
	asset?: { _ref?: string; _id?: string } | null
	alt?: string | null
} | null

type Props = {
	ctaQuestion: string | null
	ctaButtonLabel: string | null
	ctaBackground: SanityImgField
	ctaHref?: string | null
	noOverlap?: boolean
}

export default function OurHomesCta({
	ctaQuestion,
	ctaButtonLabel,
	ctaBackground,
	ctaHref,
	noOverlap,
}: Props) {
	return (
		<section
			className={`relative flex min-h-[720px] lg:mt-[-280px] flex-col items-center justify-end overflow-hidden pb-[200px] max-[820px]:min-h-[360px] max-[820px]:pb-20${noOverlap ? '' : ' z-[-1] mt-[-300px]'}`}
		>
			{/* CONTENT: ctaBackground */}
			{ctaBackground?.asset && (
				<Image
					src={urlFor(ctaBackground.asset).width(1440).quality(85).url()}
					alt={ctaBackground.alt ?? ''}
					fill
					sizes="100vw"
					className="object-cover object-top"
					aria-hidden="true"
				/>
			)}

			<div className="relative z-10 flex flex-col items-center gap-6">
				{/* CONTENT: ctaQuestion */}
				{ctaQuestion && (
					<p className="font-heading text-foreground max-w-[642px] text-center text-[30px] leading-[40px] tracking-[0.1em] max-[820px]:px-[18px] max-[820px]:text-[22px] max-[820px]:leading-[32px]">
						{ctaQuestion}
					</p>
				)}
				{/* CONTENT: ctaButtonLabel */}
				<Link
					href={ctaHref ?? '/experiences'}
					className="bg-accent text-accent-foreground inline-flex items-center justify-center rounded-[5px] px-[22px] py-3 text-[12px] font-bold tracking-[0.3em] whitespace-nowrap uppercase"
				>
					{ctaButtonLabel ?? 'THE ALT HOME EXPERIENCES'}
				</Link>
			</div>
		</section>
	)
}
