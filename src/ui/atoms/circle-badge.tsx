'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

type Props = {
	text: string
	arrowSrc?: string
	arrowColorClass?: string
	bgClass?: string
	textClass?: string
	fontClass?: string
	textSizeClass?: string
	trackingClass?: string
	textOffset?: string
	gapPercent?: number
	paddingPercent?: number
	arrowRotationDeg?: number
	rotate?: boolean
	className?: string
}

export default function CircleBadge({
	text,
	arrowSrc = '/badge-arrow.svg',
	arrowColorClass = 'bg-foreground',
	bgClass = 'bg-card-shell',
	textClass = 'fill-foreground',
	fontClass = 'font-heading',
	textSizeClass = 'text-[9px] md:text-[10.5px]',
	trackingClass = 'tracking-[0.05em]',
	textOffset = '50%',
	gapPercent = 20,
	paddingPercent = 14,
	arrowRotationDeg = 0,
	rotate = false,
	className,
}: Props) {
	const pathId = useId()
	const offsetPercent = Number.parseFloat(textOffset)
	const rotationDeg = Number.isFinite(offsetPercent)
		? (offsetPercent - 50) * 3.6
		: 0
	const clampedGap = Math.min(Math.max(gapPercent, 0), 90)
	const clampedPadding = Math.min(Math.max(paddingPercent, 0), 40)
	const pathRadius = 50 - clampedPadding
	const pathLength = 2 * Math.PI * pathRadius
	const textLength = pathLength * (1 - clampedGap / 100)

	return (
		<div
			className={cn(
				'relative size-[clamp(160px,18vw,190px)] shrink-0 rounded-full',
				bgClass,
				className,
			)}
			aria-hidden="true"
		>
			<svg
				viewBox="0 0 100 100"
				className={cn(
					'absolute inset-0 h-full w-full overflow-visible',
					rotate && 'motion-safe:animate-[spin_30s_linear_infinite]',
				)}
			>
				<defs>
					<path
						id={pathId}
						d={`M 50,50 m 0,-${pathRadius} a ${pathRadius},${pathRadius} 0 1,1 -0.01,0`}
						fill="transparent"
					/>
				</defs>
				<text
					className={cn(fontClass, textSizeClass, trackingClass, textClass)}
					transform={`rotate(${rotationDeg} 50 50)`}
				>
					<textPath
						href={`#${pathId}`}
						startOffset="50%"
						textAnchor="middle"
						textLength={textLength}
						lengthAdjust="spacing"
					>
						{text}
					</textPath>
				</text>
			</svg>
			<div
				className={cn(
					'absolute inset-0 m-auto size-[32%]',
					'[mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]',
					'[-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]',
					arrowColorClass,
				)}
				style={{
					maskImage: `url(${arrowSrc})`,
					WebkitMaskImage: `url(${arrowSrc})`,
					transform: `rotate(${arrowRotationDeg}deg)`,
				}}
			/>
		</div>
	)
}
