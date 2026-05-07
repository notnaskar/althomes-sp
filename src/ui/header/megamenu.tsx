import { cn } from '@/lib/utils'
import type { Megamenu } from '@/sanity/types'
import HoverDetails from '@/ui/hover-details'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'
import MobileOnlyDetails from './mobile-only-details'

export default function MegamenuNav({
	link,
	items,
	summaryClassName,
}: Megamenu & {
	summaryClassName?: string
}) {
	return (
		<HoverDetails
			name="header"
			className="accordion group/megamenu [--safearea-x:20vw]!"
			safeAreaOnHover
		>
			<summary
				className={cn(
					'h-full group-open/megamenu:max-[820px]:font-bold',
					summaryClassName,
				)}
			>
				{link?.label || (link?.internal as { title?: string })?.title}
			</summary>

			<div className="anim-fade-to-b min-[821px]:bg-background border-stroke inset-x-0 top-full min-[821px]:absolute min-[821px]:max-h-[calc(100vh-var(--header-height))] min-[821px]:overflow-y-auto min-[821px]:border-b min-[821px]:shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
				<div className="section min-[821px]:py-lh gap-x-lh border-stroke max-[820px]:pl-ch min-[821px]:*:mb-lh py-0 max-[820px]:grid max-[820px]:grid-cols-1 max-[820px]:border-l min-[821px]:columns-3xs">
					{items?.map((item) => {
						switch (item._type) {
							case 'link.list':
								return (
									<MobileOnlyDetails
										className="max-[820px]:accordion group/megamenu-linklist break-inside-avoid min-[821px]:details-content:h-[initial]"
										name="megamenu-linklist"
										key={item._key}
									>
										<summary className="text-foreground/50 inline-block py-1 min-[821px]:cursor-default">
											<SanityLink
												link={item.link as unknown as SanityLinkType}
											/>
										</summary>

										<ul className="border-stroke max-[820px]:pl-ch max-[820px]:anim-fade-to-b mb-ch leading-tight max-[820px]:border-l">
											{item.links?.map((link) => {
												return (
													<li key={link._key}>
														<SanityLink
															link={link as unknown as SanityLinkType}
															className="inline-block py-1 text-current [[href]]:hover:underline"
														/>
													</li>
												)
											})}
										</ul>
									</MobileOnlyDetails>
								)

							case 'link':
								return (
									<SanityLink
										link={item as unknown as SanityLinkType}
										className="min-[821px]:text-foreground/50 py-1 text-current hover:underline"
									/>
								)

							default:
								return null
						}
					})}
				</div>
			</div>
		</HoverDetails>
	)
}
