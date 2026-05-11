import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import type { ALT_WAY_PAGE_QUERY_RESULT } from '@/sanity/types'
import Img from '@/ui/img'

type SanityImg = NonNullable<
	NonNullable<ALT_WAY_PAGE_QUERY_RESULT>['promiseBackground']
>

type Props = {
	ctaQuestion: string | null
	ctaButtonLabel: string | null
	ctaHref?: string | null
	ctaBackground?: SanityImg | null
	ctaDecorLeft?: SanityImg | null
	ctaDecorRight?: SanityImg | null
	noOverlap?: boolean
}

export default function TheAltWayCta({
	ctaQuestion,
	ctaButtonLabel,
	ctaHref,
	ctaBackground,
	ctaDecorLeft,
	ctaDecorRight,
	noOverlap,
}: Props) {
	return (
		<section
			className={cn(
				'relative flex min-h-[300px] flex-col items-center justify-end overflow-hidden pb-32 md:pb-[190px] lg:min-h-[600px]',
				!noOverlap && 'z-[1]',
			)}
		>
			{ctaBackground?.asset ? (
				<Image
					src={urlFor(ctaBackground).width(1440).quality(85).url()}
					alt={ctaBackground.alt ?? ''}
					fill
					sizes="100vw"
					className="object-center object-cover"
					aria-hidden="true"
				/>
			) : (
				<div className="bg-muted absolute inset-0" />
			)}

			{ctaDecorLeft && (
				<div className="absolute bottom-[-60px] -left-50 z-20 w-[60%] md:w-[40%]">
					<Img
						image={ctaDecorLeft}
						width={280}
						alt={ctaDecorLeft.alt ?? ''}
						className="h-auto w-full object-contain"
					/>
				</div>
			)}

			{ctaDecorRight && (
				<div className="absolute top-[15%] right-[5%] z-20 w-[80px] md:top-[25%] md:right-[15%] md:w-[140px]">
					<Img
						image={ctaDecorRight}
						width={140}
						alt={ctaDecorRight.alt ?? ''}
						className="h-auto w-full object-contain"
					/>
				</div>
			)}

			<div className="relative z-10 mx-[18px] flex max-w-[800px] flex-col items-center gap-6 rounded-[5px] md:p-12">
				{ctaQuestion && (
					<p className="font-heading text-foreground text-center text-[24px] leading-[34px] tracking-[0.1em] md:text-[30px] md:leading-[40px]">
						{ctaQuestion}
					</p>
				)}
				<Link
					href={ctaHref ?? '/our-homes'}
					className="bg-accent text-accent-foreground inline-flex items-center justify-center rounded-[5px] px-[22px] py-4 text-[12px] font-bold tracking-[0.3em] whitespace-nowrap uppercase"
				>
					{ctaButtonLabel ?? 'EXPLORE ALL ALT HOMES'}
				</Link>
			</div>
		</section>
	)
}
