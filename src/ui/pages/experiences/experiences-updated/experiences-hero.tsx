import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface SanityImageField {
	asset?: { _ref?: string; _type?: string; _id?: string; url?: string } | null
	alt?: string | null
}

interface ExperiencesHeroProps {
	headline?: string | null
	leadingTagline?: string | null
	heroBackground?: SanityImageField | null
}

export default function ExperiencesHero({
	headline = 'The Alt Home\nExperiences',
	leadingTagline = "Things to feel, not just do.\nThese aren't just activities,\nthey are memories in the making.",
	heroBackground,
}: ExperiencesHeroProps) {
	const headlineLines = (headline ?? '').split('\n')
	const bgUrl = heroBackground?.asset
		? urlFor(heroBackground.asset).width(1440).quality(85).url()
		: null

	return (
		<section className="bg-background relative z-0 min-h-[600px] overflow-x-clip md:mt-0 md:min-h-[600px]">
			{/* Background image */}
			{bgUrl && (
				<div className="absolute inset-y-0 mt-[250px] w-full justify-self-center overflow-x-visible md:mt-[100px]">
					<Image
						src={bgUrl}
						alt={heroBackground?.alt ?? ''}
						sizes="100vw"
						fill
						priority
						className="object-cover object-top opacity-100"
					/>
				</div>
			)}

			{/* Two-column editorial grid */}
			<div className="absolute right-0 bottom-2/5 left-0 grid items-center gap-x-[80px] md:grid-cols-2 md:text-center lg:mx-auto lg:w-[70%]">
				{/* LEFT — display headline */}
				<div className="flex w-2/3 flex-col gap-[80px] justify-self-center md:gap-[24px]">
					<h1 className="text-foreground font-stories text-center text-[60px] leading-[52px] font-normal tracking-[0.1em] md:text-start md:text-[60px] md:text-[72px] md:leading-[52px] md:tracking-[0.09em] lg:text-[72px] lg:leading-[70px]">
						{headlineLines.map((line, i) => (
							<span key={i}>
								{line}
								{i < headlineLines.length - 1 && <br />}
							</span>
						))}
					</h1>
				</div>

				{/* RIGHT — leading tagline */}
				<div className="relative flex flex-col justify-center md:pt-0">
					<p className="text-foreground font-heading text-center text-[19px] leading-[30px] tracking-[0.1em] md:text-start md:text-[30px] md:leading-[40px]">
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
