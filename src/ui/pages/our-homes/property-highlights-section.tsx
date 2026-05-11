import type { CSSProperties } from 'react'
import Img from '@/ui/img'

type ImageWithAlt =
	| {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			asset?: any
			alt?: string | null
	  }
	| null
	| undefined

type WindDownSlot =
	| {
			title?: string | null
			body?: string | null
			image?: ImageWithAlt
			decorImage?: ImageWithAlt
			secondaryDecorImage?: ImageWithAlt
	  }
	| null
	| undefined

type WakeUpSlot =
	| {
			title?: string | null
			body?: string | null
			image?: ImageWithAlt
	  }
	| null
	| undefined

type HostedSlot =
	| {
			title?: string | null
			body?: string | null
	  }
	| null
	| undefined

type SymphonySlot =
	| {
			title?: string | null
			body?: string | null
			image?: ImageWithAlt
	  }
	| null
	| undefined

type MenuCta =
	| {
			label?: string | null
			url?: string | null
	  }
	| null
	| undefined

type Props = {
	windDown: WindDownSlot
	wakeUp: WakeUpSlot
	hostedWithHeart: HostedSlot
	symphony: SymphonySlot
	menuCta: MenuCta
}

const GRID_CONFIG = {
	desktop: {
		columns: 'repeat(6, 1fr)',
		rows: '420px 380px 360px',
		gap: '48px',
		areas: `
      ".  windText windText diningImg diningImg diningImg"
      "teaImg teaImg wakeText wakeText hostedText hostedText"
      ". symText symText foodImg foodImg foodImg"
    `,
	},
	mobilePaddingX: '18px',
	decor: {
		wrap: { right: '16rem', bottom: '-50px', width: '350px', rotate: '0deg' },
		leaf: { right: '26rem', bottom: '0px', width: '160px', rotate: '0deg' },
		wrapMobile: {
			right: '-30px',
			bottom: '-50px',
			width: '200px',
			rotate: '45deg',
		},
		leafMobile: {
			left: '0px',
			bottom: '0px',
			width: '6rem',
			rotate: '0deg',
		},
	},
} as const

const TITLE_CLASS =
	'font-bold text-[15px] leading-[28px] tracking-[0.2em] font-sans mb-3'
const BODY_CLASS =
	'font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground'

function decorStyle(d: {
	left?: string
	right?: string
	top?: string
	bottom?: string
	width: string
	rotate: string
}) {
	return {
		left: d.left,
		right: d.right,
		top: d.top,
		bottom: d.bottom,
		width: d.width,
		transform: `rotate(${d.rotate})`,
	} as CSSProperties
}

export default function PropertyHighlightsSection({
	windDown,
	wakeUp,
	hostedWithHeart,
	symphony,
	menuCta,
}: Props) {
	const hasAny =
		windDown?.title ||
		wakeUp?.title ||
		hostedWithHeart?.title ||
		symphony?.title
	if (!hasAny) return null

	return (
		<section className="bg-background w-full overflow-hidden py-[72px]">
			{/* Mobile-only: dining table image above heading */}
			{windDown?.image?.asset && (
				<div className="mb-8 lg:hidden">
					<Img
						image={windDown.image}
						width={800}
						sizes="(max-width: 1023px) 100vw, 0px"
						alt={windDown.image.alt ?? ''}
						className="h-auto w-full object-cover"
					/>
				</div>
			)}

			<h2 className="font-heading text-foreground mb-4 px-[18px] text-start text-[19px] leading-[30px] font-normal tracking-[0.3em] md:mb-16 md:text-center md:text-[30px] md:leading-[40px]">
				WHAT&rsquo;S WAITING FOR YOU?
			</h2>

			<div>
				{/* Desktop grid */}
				<div
					className="max-lg:hidden lg:grid"
					style={{
						gridTemplateColumns: GRID_CONFIG.desktop.columns,
						gridTemplateRows: GRID_CONFIG.desktop.rows,
						gridTemplateAreas: GRID_CONFIG.desktop.areas,
						gap: GRID_CONFIG.desktop.gap,
					}}
				>
					<div
						style={{ gridArea: 'windText' }}
						className="flex flex-col justify-end text-right"
					>
						{windDown?.title && (
							<h3 className={TITLE_CLASS}>{windDown.title}</h3>
						)}
						{windDown?.body && <p className={BODY_CLASS}>{windDown.body}</p>}
					</div>

					<div
						style={{ gridArea: 'diningImg' }}
						className="relative h-full w-full overflow-visible"
					>
						{windDown?.image?.asset && (
							<div className="absolute inset-0 w-fit justify-self-end overflow-hidden rounded-[5px]">
								<Img
									image={windDown.image}
									width={900}
									sizes="(max-width: 1023px) 0px, 900px"
									alt={windDown.image.alt ?? ''}
									className="h-full w-full object-contain"
								/>
							</div>
						)}
						{windDown?.decorImage?.asset && (
							<div
								className="pointer-events-none absolute"
								style={decorStyle(GRID_CONFIG.decor.wrap)}
							>
								<Img
									image={windDown.decorImage}
									width={300}
									alt=""
									className="h-auto w-full object-contain"
								/>
							</div>
						)}
						{windDown?.secondaryDecorImage?.asset && (
							<div
								className="pointer-events-none absolute"
								style={decorStyle(GRID_CONFIG.decor.leaf)}
							>
								<Img
									image={windDown.secondaryDecorImage}
									width={300}
									alt=""
									className="h-auto w-full object-contain"
								/>
							</div>
						)}
					</div>

					<div
						style={{ gridArea: 'teaImg' }}
						className="relative h-full w-full overflow-hidden rounded-[5px]"
					>
						{wakeUp?.image?.asset && (
							<Img
								image={wakeUp.image}
								width={500}
								sizes="(max-width: 1023px) 0px, 500px"
								alt={wakeUp.image.alt ?? ''}
								className="h-full w-full object-cover"
							/>
						)}
					</div>

					<div
						style={{ gridArea: 'wakeText' }}
						className="flex flex-col justify-center"
					>
						{wakeUp?.title && <h3 className={TITLE_CLASS}>{wakeUp.title}</h3>}
						{wakeUp?.body && <p className={BODY_CLASS}>{wakeUp.body}</p>}
					</div>

					<div
						style={{ gridArea: 'hostedText' }}
						className="flex flex-col justify-center"
					>
						{hostedWithHeart?.title && (
							<h3 className={TITLE_CLASS}>{hostedWithHeart.title}</h3>
						)}
						{hostedWithHeart?.body && (
							<p className={BODY_CLASS}>{hostedWithHeart.body}</p>
						)}
					</div>

					<div
						style={{ gridArea: 'symText' }}
						className="flex flex-col justify-center gap-12"
					>
						<div>
							{symphony?.title && (
								<h3 className={TITLE_CLASS}>{symphony.title}</h3>
							)}
							{symphony?.body && <p className={BODY_CLASS}>{symphony.body}</p>}
						</div>
						{menuCta?.url && (
							<a
								href={menuCta.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground w-fit font-sans text-[12px] font-semibold tracking-[0.3em] underline underline-offset-2 hover:opacity-70"
							>
								{menuCta.label || "WHAT'S ON THE MENU?"}
							</a>
						)}
					</div>

					<div
						style={{ gridArea: 'foodImg' }}
						className="relative h-full w-full overflow-hidden rounded-[5px]"
					>
						{symphony?.image?.asset && (
							<Img
								image={symphony.image}
								width={900}
								sizes="(max-width: 1023px) 0px, 900px"
								alt={symphony.image.alt ?? ''}
								className="h-full w-full object-cover"
							/>
						)}
					</div>
				</div>

				{/* Mobile stack */}
				<div className="flex-col gap-4 px-[18px] max-lg:flex lg:hidden">
					{/* Wind down text */}
					<div>
						{windDown?.title && (
							<h3 className={TITLE_CLASS}>{windDown.title}</h3>
						)}
						{windDown?.body && <p className={BODY_CLASS}>{windDown.body}</p>}
					</div>

					{/* Tea-leaves collage with mobile decor */}
					{wakeUp?.image?.asset && (
						<div className="relative h-[260px] w-full sm:h-[360px]">
							<div className="absolute right-0 aspect-[2/1] w-[90%] overflow-hidden rounded-[5px] md:inset-0 md:aspect-auto md:w-full">
								<Img
									image={wakeUp.image}
									width={600}
									sizes="(max-width: 1023px) 100vw, 0px"
									alt={wakeUp.image.alt ?? ''}
									className="h-full w-full object-cover"
								/>
							</div>
							{windDown?.decorImage?.asset && (
								<div
									className="pointer-events-none absolute"
									style={decorStyle(GRID_CONFIG.decor.wrapMobile)}
								>
									<Img
										image={windDown.decorImage}
										width={250}
										alt=""
										className="h-auto w-full object-contain"
									/>
								</div>
							)}
							{windDown?.secondaryDecorImage?.asset && (
								<div
									className="pointer-events-none absolute"
									style={decorStyle(GRID_CONFIG.decor.leafMobile)}
								>
									<Img
										image={windDown.secondaryDecorImage}
										width={250}
										alt=""
										className="h-auto w-full object-contain"
									/>
								</div>
							)}
						</div>
					)}

					{/* Wake up text */}
					<div>
						{wakeUp?.title && <h3 className={TITLE_CLASS}>{wakeUp.title}</h3>}
						{wakeUp?.body && <p className={BODY_CLASS}>{wakeUp.body}</p>}
					</div>

					{/* Hosted with heart text */}
					<div>
						{hostedWithHeart?.title && (
							<h3 className={TITLE_CLASS}>{hostedWithHeart.title}</h3>
						)}
						{hostedWithHeart?.body && (
							<p className={BODY_CLASS}>{hostedWithHeart.body}</p>
						)}
					</div>

					{/* Symphony text + CTA */}
					<div className="flex flex-col gap-8">
						<div>
							{symphony?.title && (
								<h3 className={TITLE_CLASS}>{symphony.title}</h3>
							)}
							{symphony?.body && <p className={BODY_CLASS}>{symphony.body}</p>}
						</div>
						{menuCta?.url && (
							<a
								href={menuCta.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground w-fit font-sans text-[12px] font-semibold tracking-[0.3em] underline underline-offset-2 hover:opacity-70"
							>
								{menuCta.label || "WHAT'S ON THE MENU?"}
							</a>
						)}
					</div>

					{/* Food plate image */}
					{symphony?.image?.asset && (
						<div className="relative h-[360px] w-full overflow-hidden rounded-[5px]">
							<Img
								image={symphony.image}
								width={800}
								sizes="(max-width: 1023px) 100vw, 0px"
								alt={symphony.image.alt ?? ''}
								className="h-full w-full object-cover"
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
