'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PortableText } from 'next-sanity'
import type { BlockContent } from '@/sanity/types'
import ReactIcon from '@/ui/atoms/react-icon'
import { splitAmenityColumns } from './amenity-columns'

type Amenity = { name: string | null; icon: string | null }

type Props = {
  imageUrl: string | null
  amenities: Amenity[]
  houseRulesTeaser: string | null | undefined
  houseRules: BlockContent | null | undefined
}

export default function PropertyAmenitiesSection({
  imageUrl,
  amenities,
  houseRulesTeaser,
  houseRules,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const columns = splitAmenityColumns(amenities)

  return (
    <section className="flex bg-background max-[820px]:flex-col">
      {/* Left: full-height image */}
      <div className="relative w-1/5 self-stretch max-[820px]:h-[300px] max-[820px]:w-full">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 820px) 100vw, 20vw"
          />
        )}
      </div>

      {/* Right: content */}
      <div className="w-4/5 py-[72px] pl-[64px] pr-[90px] max-[820px]:w-full max-[820px]:px-[18px] max-[820px]:py-[48px]">
        <h2 className="mb-[48px] font-heading text-[30px] font-normal leading-[40px] tracking-[0.3em] text-foreground">
          FOR US, IT&rsquo;S COMFORT FIRST
        </h2>

        {amenities.length > 0 && (
          <div className="mb-[48px] flex gap-[32px] max-[820px]:flex-col">
            {columns.map((col, ci) =>
              col.length > 0 ? (
                <div key={ci} className="flex flex-col gap-[16px]">
                  {col.map((amenity, ai) => (
                    <div key={amenity.name ?? ai} className="flex items-center gap-[12px]">
                      <ReactIcon name={amenity.icon} size={24} />
                      <span className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null,
            )}
          </div>
        )}

        {(houseRulesTeaser || houseRules) && (
          <span className="block font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
            {houseRulesTeaser && <span>{houseRulesTeaser} </span>}
            {houseRules && (
              <button
                onClick={() => setModalOpen(true)}
                className="underline underline-offset-2 hover:opacity-70"
              >
                House Rules
              </button>
            )}
          </span>
        )}
      </div>

      {/* House rules modal */}
      {modalOpen && houseRules && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="amenities-modal-title"
            className="relative max-h-[80vh] w-full max-w-[640px] overflow-y-auto bg-background px-[48px] py-[40px]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-[16px] top-[16px] font-sans text-[20px] leading-none text-foreground hover:opacity-70"
              aria-label="Close"
            >
              ×
            </button>
            <h3 id="amenities-modal-title" className="mb-[24px] font-heading text-[24px] leading-[32px] tracking-[0.1em] text-foreground">
              House Rules
            </h3>
            <div className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground [&_p]:mb-[8px] [&_p:last-child]:mb-0">
              <PortableText value={houseRules} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
