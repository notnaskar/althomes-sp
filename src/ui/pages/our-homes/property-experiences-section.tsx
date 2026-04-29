import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import ExperienceCard from '@/ui/pages/experiences/experiences-updated/experience-card'
import type {
  SanityImageAsset,
  SanityImageCrop,
  SanityImageHotspot,
} from '@/sanity/types'

interface BgImage {
  asset?: SanityImageAsset | null
  alt?: string | null
  hotspot?: SanityImageHotspot | null
  crop?: SanityImageCrop | null
}

interface ExperienceItem {
  title?: string | null
  slug?: string | null
  description?: string | null
  image?: {
    asset?: SanityImageAsset | null
    alt?: string | null
  } | null
}

interface PropertyExperiencesSectionProps {
  bgImage?: BgImage | null
  experiences: ExperienceItem[]
  propertyTitle: string
}

export default function PropertyExperiencesSection({
  bgImage,
  experiences,
  propertyTitle,
}: PropertyExperiencesSectionProps) {
  const hasBg = bgImage?.asset != null
  const bgUrl = hasBg ? urlFor(bgImage!).width(1600).url() : null

  return (
    <section
      data-section="experiences"
      className={`relative overflow-hidden px-[90px] py-[80px] max-[820px]:px-[24px] max-[820px]:py-[48px]${!hasBg ? ' bg-background' : ''}`}
    >
      {bgUrl && (
        <Image
          src={bgUrl}
          alt={bgImage?.alt ?? ''}
          fill
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="relative z-10">
        <h2
          className={[
            'font-heading italic text-center tracking-[0.05em] text-[32px] leading-[1.2]',
            'max-[820px]:text-[24px]',
            hasBg ? 'text-white drop-shadow-md' : 'text-foreground',
          ].join(' ')}
        >
          EXPERIENCES NEAR {propertyTitle.toUpperCase()}
        </h2>

        <div className="mt-[48px] flex justify-center gap-[24px] max-[820px]:flex-col max-[820px]:items-center">
          {experiences.slice(0, 3).map((exp, i) => (
            <div key={exp.slug ?? exp.title ?? i} className="w-full max-w-[327px]">
              <ExperienceCard
                title={exp.title ?? ''}
                description={exp.description}
                image={exp.image as Parameters<typeof ExperienceCard>[0]['image']}
                slug={exp.slug}
                tilt={i % 2 === 0 ? 'cw' : 'ccw'}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
