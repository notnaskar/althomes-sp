import { PortableText } from 'next-sanity'
import type { BlockContent } from '@/sanity/types'
import CircleBadge from '@/ui/atoms/circle-badge'

type Faq = {
	question: string | null
	answer: BlockContent | null
}

export default function PropertyFaqSection({
	faqs,
	badgeText,
}: {
	faqs: Faq[]
	badgeText?: string | null
}) {
	if (!faqs.length) return null

	return (
		<section className="bg-primary text-card-shell relative px-4 py-16 md:px-[90px] md:py-24">
			{/* Circle Badge — absolutely positioned */}
			<div className="absolute -top-10 right-4 rotate-[65deg] md:top-24 md:right-auto md:left-[90px] md:rotate-0 lg:-top-10">
				<CircleBadge
					text={badgeText?.trim() || 'your questions, answered'}
					bgClass="bg-card-shell"
					textClass="fill-foreground"
					textOffset="86%"
				/>
			</div>

			{/* FAQs */}
			<div className="mx-auto max-w-[100%] pt-24 md:mx-0 md:max-w-[100%] md:pt-0 md:pl-[224px] lg:pl-[256px]">
				<div className="divide-card-shell/20 border-card-shell/20 divide-y border-b">
					{faqs.map((faq, i) => (
						<details key={i} className="group py-4 md:py-5">
							<summary className="focus-visible:ring-primary-foreground flex cursor-pointer list-none items-center justify-between gap-4 outline-none focus-visible:rounded-[5px] focus-visible:ring-2">
								<span className="font-sans text-base leading-snug font-semibold tracking-wider md:text-[17px]">
									{faq.question}
								</span>
								<span
									className="shrink-0 text-xl transition-transform duration-300 group-open:rotate-45"
									aria-hidden="true"
								>
									+
								</span>
							</summary>

							<div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
								<div className="overflow-hidden">
									{faq.answer && (
										<div className="text-card-shell/80 pt-4 font-sans text-sm leading-relaxed tracking-wider md:text-[15px] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold">
											<PortableText value={faq.answer} />
										</div>
									)}
								</div>
							</div>
						</details>
					))}
				</div>
			</div>
		</section>
	)
}
