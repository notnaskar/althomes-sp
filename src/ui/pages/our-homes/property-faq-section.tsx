import { PortableText } from 'next-sanity'
import type { BlockContent } from '@/sanity/types'

type Faq = {
	question: string | null
	answer: BlockContent | null
}

export default function PropertyFaqSection({ faqs }: { faqs: Faq[] }) {
	if (!faqs.length) return null

	return (
		<section className="bg-primary text-card-shell grid grid-cols-1 items-start gap-8 px-4 py-16 md:grid-cols-[192px_1fr] md:gap-16 md:px-[90px] md:py-24 lg:gap-32">
			{/* Left Column: Circle Badge */}
			<div className="flex justify-center md:justify-start">
				<div className="relative flex size-[120px] rotate-90 items-center justify-center md:size-[192px]">
					<svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
						<path
							id="faq-circle-path"
							d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
							fill="transparent"
						/>
						<text className="fill-card-shell font-sans text-[10px] font-semibold tracking-[0.15em] uppercase md:text-[11.5px]">
							<textPath href="#faq-circle-path" startOffset="0%">
								your questions, answered ➔ your questions, answered ➔
							</textPath>
						</text>
					</svg>
				</div>
			</div>

			{/* Right Column: FAQs */}
			<div className="mx-auto w-full max-w-[594px] md:mx-0 md:mt-[68px]">
				<div className="divide-card-shell/20 border-card-shell/20 divide-y border-b">
					{faqs.map((faq, i) => (
						<details key={i} className="group py-4 md:py-5">
							<summary className="focus-visible:ring-primary-foreground flex cursor-pointer list-none items-center justify-between gap-4 outline-none focus-visible:rounded-sm focus-visible:ring-2">
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
