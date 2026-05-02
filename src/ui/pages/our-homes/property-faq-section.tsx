import { PortableText } from 'next-sanity'
import type { BlockContent } from '@/sanity/types'

type Faq = {
	question: string | null
	answer: BlockContent | null
}

export default function PropertyFaqSection({ faqs }: { faqs: Faq[] }) {
	if (!faqs.length) return null

	return (
		<section className="bg-background py-16 px-[90px] max-[820px]:px-[18px]">
			<h2 className="mb-10 font-heading text-[30px] tracking-[0.3em] text-foreground">
				Frequently Asked Questions
			</h2>

			<div className="max-w-3xl divide-y divide-stroke">
				{faqs.map((faq, i) => (
					<details key={i} className="group py-4">
						<summary className="flex cursor-pointer list-none items-center justify-between gap-4">
							<span className="font-sans text-[15px] font-semibold leading-[23px] tracking-[0.1em] text-foreground">
								{faq.question}
							</span>
							<span
								className="shrink-0 text-foreground transition-transform duration-300 group-open:rotate-45"
								aria-hidden="true"
							>
								+
							</span>
						</summary>

						<div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
							<div className="overflow-hidden">
								{faq.answer && (
									<div className="pt-4 font-sans text-[14px] leading-[22px] tracking-[0.05em] text-foreground/80 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold">
										<PortableText value={faq.answer} />
									</div>
								)}
							</div>
						</div>
					</details>
				))}
			</div>
		</section>
	)
}
