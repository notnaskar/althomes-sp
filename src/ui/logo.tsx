import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getSite } from '@/sanity/lib/data'
import Img from './img'

export default async function ({ className }: { className?: string }) {
	const site = await getSite()

	return (
		<Link
			href="/"
			className={cn('text-foreground inline-block font-bold', className)}
		>
			{site?.logoImage ? (
				<Img
					image={site.logoImage}
					width={100}
					className="inline-block h-full w-auto object-contain"
					alt={site?.title ?? ''}
				/>
			) : (
				site?.title
			)}
		</Link>
	)
}
