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
	rotate = false,
	className,
}: Props) {
	const pathId = useId()

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
						d="M 50,50 m 0,-40 a 40,40 0 1,1 -0.01,0"
						fill="transparent"
					/>
				</defs>
				<text className={cn(fontClass, textSizeClass, trackingClass, textClass)}>
					<textPath
						href={`#${pathId}`}
						startOffset={textOffset}
						textAnchor="middle"
					>
						{text}
					</textPath>
				</text>
			</svg>
			<div
				className={cn(
					'absolute inset-0 m-auto size-[42%]',
					'[mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]',
					'[-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]',
					arrowColorClass,
				)}
				style={{
					maskImage: `url(${arrowSrc})`,
					WebkitMaskImage: `url(${arrowSrc})`,
				}}
			/>
		</div>
	)
}
