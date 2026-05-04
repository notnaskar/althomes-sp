import { PortableText } from 'next-sanity'
import type { BlockContent } from '@/sanity/types'

type Faq = {
	question: string | null
	answer: BlockContent | null
}

export default function PropertyFaqSection({ faqs }: { faqs: Faq[] }) {
	if (!faqs.length) return null

	return (
		<section className="bg-primary text-card-shell py-16 md:py-24 px-4 md:px-[90px] grid grid-cols-1 md:grid-cols-[192px_1fr] gap-8 md:gap-16 lg:gap-32 items-start">
			{/* Left Column: Circle Badge */}
			<div className="flex justify-center md:justify-start">
				<div className="relative flex items-center justify-center size-[120px] md:size-[192px] rotate-90">
					<svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
						<path
							id="faq-circle-path"
							d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
							fill="transparent"
						/>
						<text className="text-[10px] md:text-[11.5px] uppercase tracking-[0.15em] fill-card-shell font-sans font-semibold">
							<textPath href="#faq-circle-path" startOffset="0%">
								your questions, answered ➔ your questions, answered ➔ 
							</textPath>
						</text>
					</svg>
				</div>
			</div>

			{/* Right Column: FAQs */}
			<div className="w-full max-w-[594px] mx-auto md:mx-0 md:mt-[68px]">
				<div className="divide-y divide-card-shell/20 border-b border-card-shell/20">
					{faqs.map((faq, i) => (
						<details key={i} className="group py-4 md:py-5">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:rounded-sm">
								<span className="font-sans text-base md:text-[17px] font-semibold leading-snug tracking-wider">
									{faq.question}
								</span>
								<span
									className="shrink-0 transition-transform duration-300 group-open:rotate-45 text-xl"
									aria-hidden="true"
								>
									+
								</span>
							</summary>

							<div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
								<div className="overflow-hidden">
									{faq.answer && (
										<div className="pt-4 font-sans text-sm md:text-[15px] leading-relaxed tracking-wider text-card-shell/80 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold">
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
