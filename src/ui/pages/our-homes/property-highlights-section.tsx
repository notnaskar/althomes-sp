import type { CSSProperties } from 'react'
import Img from '@/ui/img'

type ImageWithAlt = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset?: any
  alt?: string | null
} | null | undefined

type WindDownSlot = {
  title?: string | null
  body?: string | null
  image?: ImageWithAlt
  decorImage?: ImageWithAlt
  secondaryDecorImage?: ImageWithAlt
} | null | undefined

type WakeUpSlot = {
  title?: string | null
  body?: string | null
  image?: ImageWithAlt
} | null | undefined

type HostedSlot = {
  title?: string | null
  body?: string | null
} | null | undefined

type SymphonySlot = {
  title?: string | null
  body?: string | null
  image?: ImageWithAlt
} | null | undefined

type MenuCta = {
  label?: string | null
  url?: string | null
} | null | undefined

type Props = {
  windDown: WindDownSlot
  wakeUp: WakeUpSlot
  hostedWithHeart: HostedSlot
  symphony: SymphonySlot
  menuCta: MenuCta
}

const GRID_CONFIG = {
  desktop: {
    columns: '1fr 1fr 1fr',
    rows: '420px 380px 360px',
    gap: '48px',
    areas: `
      "windText  diningImg  diningImg"
      "teaImg    wakeText   hostedText"
      "symText   foodImg    foodImg"
    `,
  },
  mobilePaddingX: '18px',
  decor: {
    wrap: { left: '-30px', top: '60px', width: '180px', rotate: '0deg' },
    leaf: { right: '-20px', top: '20px', width: '160px', rotate: '15deg' },
    wrapMobile: { left: '-20px', top: '40px', width: '140px', rotate: '0deg' },
    leafMobile: { right: '-10px', top: '120px', width: '110px', rotate: '15deg' },
  },
} as const

const TITLE_CLASS =
  'font-heading text-[20px] leading-[28px] tracking-[0.2em] text-foreground mb-3'
const BODY_CLASS =
  'font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground'

function decorStyle(d: { left?: string; right?: string; top?: string; width: string; rotate: string }) {
  return {
    left: d.left,
    right: d.right,
    top: d.top,
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
    <section className="w-full overflow-hidden bg-background py-[72px]">
      {/* Mobile-only: dining table image above heading */}
      {windDown?.image?.asset && (
        <div className="lg:hidden mb-8">
          <Img
            image={windDown.image}
            width={800}
            alt={windDown.image.alt ?? ''}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <h2
        className="mb-16 px-[18px] text-center font-heading text-[30px] font-normal leading-[40px] tracking-[0.3em] text-foreground"
      >
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
          <div style={{ gridArea: 'windText' }} className="flex flex-col justify-center text-right">
            {windDown?.title && <h3 className={TITLE_CLASS}>{windDown.title}</h3>}
            {windDown?.body && <p className={BODY_CLASS}>{windDown.body}</p>}
          </div>

          <div style={{ gridArea: 'diningImg' }} className="relative h-full w-full overflow-visible">
            {windDown?.image?.asset && (
              <div className="absolute inset-0 overflow-hidden rounded-[5px]">
                <Img
                  image={windDown.image}
                  width={900}
                  alt={windDown.image.alt ?? ''}
                  className="h-full w-full object-cover"
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

          <div style={{ gridArea: 'teaImg' }} className="relative h-full w-full overflow-hidden rounded-[5px]">
            {wakeUp?.image?.asset && (
              <Img
                image={wakeUp.image}
                width={500}
                alt={wakeUp.image.alt ?? ''}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div style={{ gridArea: 'wakeText' }} className="flex flex-col justify-center">
            {wakeUp?.title && <h3 className={TITLE_CLASS}>{wakeUp.title}</h3>}
            {wakeUp?.body && <p className={BODY_CLASS}>{wakeUp.body}</p>}
          </div>

          <div style={{ gridArea: 'hostedText' }} className="flex flex-col justify-center">
            {hostedWithHeart?.title && <h3 className={TITLE_CLASS}>{hostedWithHeart.title}</h3>}
            {hostedWithHeart?.body && <p className={BODY_CLASS}>{hostedWithHeart.body}</p>}
          </div>

          <div style={{ gridArea: 'symText' }} className="flex flex-col justify-center gap-12">
            <div>
              {symphony?.title && <h3 className={TITLE_CLASS}>{symphony.title}</h3>}
              {symphony?.body && <p className={BODY_CLASS}>{symphony.body}</p>}
            </div>
            {menuCta?.url && (
              <a
                href={menuCta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground underline underline-offset-2 hover:opacity-70"
              >
                {menuCta.label || "WHAT'S ON THE MENU?"}
              </a>
            )}
          </div>

          <div style={{ gridArea: 'foodImg' }} className="relative h-full w-full overflow-hidden rounded-[5px]">
            {symphony?.image?.asset && (
              <Img
                image={symphony.image}
                width={900}
                alt={symphony.image.alt ?? ''}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Mobile stack */}
        <div className="flex flex-col gap-12 px-[18px] lg:hidden">
          {/* Wind down text */}
          <div>
            {windDown?.title && <h3 className={TITLE_CLASS}>{windDown.title}</h3>}
            {windDown?.body && <p className={BODY_CLASS}>{windDown.body}</p>}
          </div>

          {/* Tea-leaves collage with mobile decor */}
          {wakeUp?.image?.asset && (
            <div className="relative h-[360px] w-full">
              <div className="absolute inset-0 overflow-hidden rounded-[5px]">
                <Img
                  image={wakeUp.image}
                  width={600}
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
            {hostedWithHeart?.title && <h3 className={TITLE_CLASS}>{hostedWithHeart.title}</h3>}
            {hostedWithHeart?.body && <p className={BODY_CLASS}>{hostedWithHeart.body}</p>}
          </div>

          {/* Symphony text + CTA */}
          <div className="flex flex-col gap-8">
            <div>
              {symphony?.title && <h3 className={TITLE_CLASS}>{symphony.title}</h3>}
              {symphony?.body && <p className={BODY_CLASS}>{symphony.body}</p>}
            </div>
            {menuCta?.url && (
              <a
                href={menuCta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground underline underline-offset-2 hover:opacity-70"
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
