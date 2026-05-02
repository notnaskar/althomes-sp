import Link from 'next/link'
import type {
	SanityImageAsset,
	SanityImageCrop,
	SanityImageHotspot,
} from '@/sanity/types'
import Img from '@/ui/img'

interface ExperienceCardImage {
	asset: SanityImageAsset | null
	alt?: string | null
	crop?: SanityImageCrop
	hotspot?: SanityImageHotspot
}

interface ExperienceCardProps {
	title: string
	description?: string | null
	image?: ExperienceCardImage | null
	slug?: string | null
	/** Derived from grid index — even = clockwise, odd = counter-clockwise */
	tilt?: 'cw' | 'ccw'
}

export default function ExperienceCard({
	title,
	description,
	image,
	slug,
	tilt = 'cw',
}: ExperienceCardProps) {
	const tiltClass = tilt === 'cw' ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]'
	const href = slug ? `/experiences/${slug}` : '#'

	return (
		<Link
			href={href}
			aria-label={title}
			className={[
				'group block w-full transition-transform duration-300',
				'motion-safe:' + tiltClass,
				'hover:scale-[1.02] hover:rotate-0',
				'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
			].join(' ')}
		>
			{/* Outer beige shell */}
			<div
				className="rounded-[5px] p-[16px] pb-[20px] bg-[var(--color-card-shell)]"
			>
				{/* Image area — fixed aspect ratio matches Figma 327×340 */}
				<div
					className="relative w-full overflow-hidden rounded-[5px] bg-muted"
					style={{
						aspectRatio: '327 / 340',
					}}
				>
					{image?.asset ? (
						<Img
							image={image}
							width={700}
							alt={image.alt ?? title}
							sizes="(max-width: 820px) 100vw, 360px"
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : null}
				</div>

				{/* Title + description */}
				<div className="mt-[16px] px-[4px] text-center">
					<p className="text-foreground font-heading text-[15px] leading-[23px] tracking-[0.1em]">
						{title}
					</p>
					{description && (
						<p className="text-foreground mt-[6px] font-sans text-[12px] leading-[18px] tracking-[0.1em]">
							{description}
						</p>
					)}
				</div>
			</div>
		</Link>
	)
}
