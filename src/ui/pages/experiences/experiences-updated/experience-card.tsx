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
	/** Derived from grid index — even = clockwise, odd = counter-clockwise */
	tilt?: 'cw' | 'ccw'
	/** Shell background color. Accepts any CSS color (hex, rgb, var(...), token). Defaults to `bg-card-shell`. */
	color?: string
}

export default function ExperienceCard({
	title,
	description,
	image,
	tilt = 'cw',
	color,
}: ExperienceCardProps) {
	const tiltClass =
		tilt === 'cw'
			? 'motion-safe:max-[820px]:rotate-[1.5deg]'
			: 'motion-safe:max-[820px]:-rotate-[1.5deg]'

	return (
		<div className={`block w-full ${tiltClass}`}>
			{/* Outer shell */}
			<div
				className={`rounded-[5px] p-[16px] pb-[20px] ${color ? '' : 'bg-card-shell'}`}
				style={color ? { backgroundColor: color } : undefined}
			>
				{/* Image area — fixed aspect ratio matches Figma 327×340 */}
				<div
					className="bg-muted relative w-full overflow-hidden rounded-[5px]"
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
							className="absolute inset-0 h-full w-full object-cover"
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
		</div>
	)
}
