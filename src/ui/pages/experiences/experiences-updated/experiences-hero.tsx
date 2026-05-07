import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import HeroDecorImage from '@/ui/molecules/hero-decor-image'

interface SanityImageField {
	asset?: { _ref?: string; _type?: string; _id?: string; url?: string } | null
	alt?: string | null
}

interface ExperiencesHeroProps {
	headline?: string | null
	leadingTagline?: string | null
	heroFlower?: SanityImageField | null
	heroBackground?: SanityImageField | null
}

export default function ExperiencesHero({
	headline = 'The Alt Home\nExperiences',
	leadingTagline = "Things to feel, not just do.\nThese aren't just activities,\nthey are memories in the making.",
	heroFlower,
	heroBackground,
}: ExperiencesHeroProps) {
	const headlineLines = (headline ?? '').split('\n')
	const bgUrl = heroBackground?.asset
		? urlFor(heroBackground.asset).width(1440).quality(85).url()
		: null

	return (
		<section className="bg-background relative mt-[100px] w-full overflow-hidden px-[90px] pt-[80px] pb-[80px] md:px-[18px] md:pb-[56px] lg:min-h-[600px] lg:pt-[60px]">
			{/* Background image */}
			{bgUrl && (
				<Image
					src={bgUrl}
					alt={heroBackground?.alt ?? ''}
					fill
					sizes="100vw"
					priority
					className="object-cover object-top opacity-100"
				/>
			)}

			{/* Decorative flower — bottom-left bleed, desktop only */}
			<div className="pointer-events-none absolute bottom-0 left-0 h-[260px] w-[200px] max-[820px]:hidden">
				<HeroDecorImage
					asset={heroFlower}
					alt=""
					sizes="200px"
					style={{ objectFit: 'contain', objectPosition: 'bottom left' }}
				/>
			</div>

			{/* Two-column editorial grid */}
			<div className="relative grid grid-cols-2 gap-x-[80px] max-[820px]:grid-cols-1 max-[820px]:text-center lg:mx-auto lg:w-[70%]">
				{/* LEFT — display headline */}
				<div className="flex w-fit flex-col justify-center gap-[80px] max-[820px]:gap-[24px]">
					<h1 className="text-foreground font-stories text-[72px] leading-[70px] font-normal tracking-[0.1em] max-[820px]:text-[60px] max-[820px]:leading-[52px] max-[820px]:tracking-[0.09em]">
						{headlineLines.map((line, i) => (
							<span key={i}>
								{line}
								{i < headlineLines.length - 1 && <br />}
							</span>
						))}
					</h1>
				</div>

				{/* RIGHT — leading tagline */}
				<div className="relative flex flex-col justify-start max-[820px]:mt-[28px] max-[820px]:pt-0">
					<p className="text-foreground font-heading text-[30px] leading-[40px] tracking-[0.1em] max-[820px]:text-[19px] max-[820px]:leading-[29px]">
						{(leadingTagline ?? '').split('\n').map((line, i, arr) => (
							<span key={i}>
								{line}
								{i < arr.length - 1 && <br />}
							</span>
						))}
					</p>
				</div>
			</div>
		</section>
	)
}
