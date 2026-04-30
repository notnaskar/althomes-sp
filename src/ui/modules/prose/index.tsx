import { PortableText, stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import type { Prose } from '@/sanity/types'
import CustomHTML from '@/ui/modules/custom-html'
import TableOfContents from '@/ui/table-of-contents'
import { moduleAttributes } from '..'
import AnchoredHeading from './anchored-heading'
import Code from './code'
import Image from './image'

export default function ({
	content,
	tableOfContents,
	headings,
	...props
}: Prose & React.ComponentProps<typeof TableOfContents>) {
	const toc = stegaClean(tableOfContents)

	return (
		<section
			className={cn(
				'section',
				toc && 'flex gap-4 max-[820px]:flex-col min-[821px]:items-start',
			)}
			{...moduleAttributes(props)}
		>
			{(toc === 'left' || toc === 'right') && (
				<TableOfContents
					headings={headings}
					className={cn(
						'min-[821px]:sticky-below-header shrink-0 [--offset:1rem] min-[821px]:w-[20ch]',
						toc === 'right' && 'min-[821px]:order-last',
					)}
					open
				/>
			)}

			<article className="prose mx-auto w-full max-w-3xl">
				<PortableText
					value={content ?? []}
					components={{
						block: {
							h1: (node) => <AnchoredHeading as="h1" {...node} />,
							h2: (node) => <AnchoredHeading as="h2" {...node} />,
							h3: (node) => <AnchoredHeading as="h3" {...node} />,
							h4: (node) => <AnchoredHeading as="h4" {...node} />,
							h5: (node) => <AnchoredHeading as="h5" {...node} />,
							h6: (node) => <AnchoredHeading as="h6" {...node} />,
						},
						types: {
							image: Image,
							code: Code,
							'custom-html': ({ value }) => <CustomHTML {...value} />,
						},
					}}
				/>
			</article>
		</section>
	)
}
