import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import type { HeroSplit } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Img from '@/ui/img'
import Overline from '@/ui/overline'
import { moduleAttributes } from '.'

export default function HeroSplit({
	overline,
	content = [],
	ctas,
	image,
	...props
}: HeroSplit) {
	return (
		<section
			className="section grid items-center gap-8 max-[820px]:grid-cols-1 min-[821px]:grid-cols-2"
			{...moduleAttributes(props)}
		>
			<figure
				className={cn(
					image?.onRight && 'min-[821px]:order-last',
					image?.afterContent && 'max-[820px]:order-last',
				)}
			>
				<Img
					className="w-full"
					image={image}
					width={600}
					alt={image?.alt ?? ''}
					sizes="(max-width: 820px) 100vw, 50vw"
				/>
			</figure>

			<header className="prose">
				<Overline value={overline} />
				<PortableText value={content} />
				<CTAList ctas={ctas} className="max-[820px]:*:w-full" />
			</header>
		</section>
	)
}
