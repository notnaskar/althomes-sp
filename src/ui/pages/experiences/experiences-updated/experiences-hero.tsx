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
	supportingTagline?: string | null
	heroFlower?: SanityImageField | null
	heroBackground?: SanityImageField | null
}

export default function ExperiencesHero({
	headline = 'The Alt Home\nExperiences',
	leadingTagline = "Things to feel, not just do.\nThese aren't just activities,\nthey are memories in the making.",
	supportingTagline = 'Access the most memorable experiences in and around our homes.',
	heroFlower,
	heroBackground,
}: ExperiencesHeroProps) {
	const headlineLines = (headline ?? '').split('\n')
	const bgUrl = heroBackground?.asset
		? urlFor(heroBackground.asset).url()
		: null

	return (
		<section className="bg-background relative w-full overflow-hidden px-[90px] pt-[140px] pb-[80px] max-[820px]:px-[18px] max-[820px]:pt-[100px] max-[820px]:pb-[56px]">
			{/* Background image */}
			{bgUrl && (
				<Image
					src={bgUrl}
					alt={heroBackground?.alt ?? ''}
					fill
					sizes="100vw"
					priority
					className="object-cover opacity-60"
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
			<div className="relative grid grid-cols-2 gap-x-[80px] max-[820px]:grid-cols-1 max-[820px]:text-center">
				{/* LEFT — display headline + supporting tagline */}
				<div className="flex flex-col justify-between gap-[80px] max-[820px]:gap-[24px]">
					<h1 className="text-foreground font-heading text-[72px] leading-[70px] font-normal tracking-[0.1em] italic max-[820px]:text-[60px] max-[820px]:leading-[52px] max-[820px]:tracking-[0.09em]">
						{headlineLines.map((line, i) => (
							<span key={i}>
								{line}
								{i < headlineLines.length - 1 && <br />}
							</span>
						))}
					</h1>

					<p className="text-foreground max-w-[432px] font-heading text-[30px] leading-[40px] tracking-[0.1em] italic max-[820px]:max-w-none max-[820px]:text-[19px] max-[820px]:leading-[29px]">
						{supportingTagline}
					</p>
				</div>

				{/* RIGHT — leading tagline + decorative circle motif */}
				<div className="relative flex flex-col justify-start pt-[8px] max-[820px]:mt-[28px] max-[820px]:pt-0">
					<p className="text-foreground font-heading text-[30px] leading-[40px] tracking-[0.1em] italic max-[820px]:text-[19px] max-[820px]:leading-[29px]">
						{(leadingTagline ?? '').split('\n').map((line, i, arr) => (
							<span key={i}>
								{line}
								{i < arr.length - 1 && <br />}
							</span>
						))}
					</p>

					{/* Decorative circle — pure CSS, no asset */}
					<div
						className="absolute right-0 bottom-[-40px] h-[192px] w-[192px] max-[820px]:relative max-[820px]:right-auto max-[820px]:bottom-auto max-[820px]:mt-[32px] max-[820px]:h-[160px] max-[820px]:w-[160px] max-[820px]:self-end"
						aria-hidden="true"
					>
						{/* Red-orange filled circle */}
						<div
							className="absolute inset-0 rounded-full bg-[var(--color-terracotta)]"
						/>
						{/* Cream diamond cut-out — rotated square */}
						<div
							className="bg-background absolute"
							style={{
								width: '45%',
								height: '45%',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%) rotate(45deg)',
							}}
						/>
						{/* White arrow — iconography, not a content placeholder */}
						<svg
							viewBox="0 0 60 60"
							fill="none"
							className="absolute inset-0 h-full w-full text-primary-foreground"
							aria-hidden="true"
						>
							<line
								x1="16"
								y1="30"
								x2="44"
								y2="30"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<polyline
								points="36,22 44,30 36,38"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
							/>
						</svg>
					</div>
				</div>
			</div>
		</section>
	)
}
