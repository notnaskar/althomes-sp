'use client'

import { cn } from '@/lib/utils'
import { useBlogIndexStore } from './blog-index/store'

type BlogCategory = {
	_id?: string
	title?: string
	slug?: { current?: string }
}

export default function ({
	category,
	children,
}: {
	category?: BlogCategory
} & React.ComponentProps<'button'>) {
	const { categoryParam, setCategoryParam } = useBlogIndexStore()
	const slug = category?.slug?.current

	return (
		<button
			className={cn(
				categoryParam === slug || (!categoryParam && !category)
					? 'action'
					: 'ghost',
			)}
			onClick={() => {
				if (categoryParam === slug) {
					setCategoryParam(null)
				} else {
					setCategoryParam(slug ?? null)
				}
			}}
		>
			{children || category?.title}
		</button>
	)
}
