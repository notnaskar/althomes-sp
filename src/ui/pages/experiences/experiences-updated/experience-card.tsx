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
				'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-4',
			].join(' ')}
		>
			{/* Outer beige shell */}
			<div
				className="rounded-[5px] p-[16px] pb-[20px]"
				style={{ backgroundColor: 'rgb(227,213,193)' }}
			>
				{/* Image area — fixed aspect ratio matches Figma 327×340 */}
				<div
					className="relative w-full overflow-hidden rounded-[5px]"
					style={{
						aspectRatio: '327 / 340',
						backgroundColor: 'rgb(217,217,217)',
					}}
				>
					{image?.asset ? (
						<Img
							image={image}
							width={700}
							alt={image.alt ?? title}
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : null}
				</div>

				{/* Title + description */}
				<div className="mt-[16px] px-[4px] text-center">
					<p className="text-foreground font-sans text-[15px] leading-[23px] font-bold tracking-[0.1em]">
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
