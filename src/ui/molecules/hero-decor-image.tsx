import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface HeroDecorImageProps {
	asset?: {
		asset?: { _ref?: string; _id?: string; _type?: string; url?: string } | null
	} | null
	alt?: string
	sizes?: string
	className?: string
	style?: React.CSSProperties
}

export default function HeroDecorImage({
	asset,
	alt = '',
	sizes = '100vw',
	className,
	style,
}: HeroDecorImageProps) {
	if (!asset?.asset) return null
	const url = urlFor(asset.asset).width(1200).auto('format').url()
	return (
		<Image
			src={url}
			alt={alt}
			fill
			sizes={sizes}
			quality={70}
			className={className ?? 'object-contain'}
			style={style}
		/>
	)
}
