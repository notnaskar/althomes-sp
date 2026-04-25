import Link from 'next/link'

interface FooterColProps {
  heading: string
  links: { label: string; url: string }[]
}

export default function FooterCol({ heading, links }: FooterColProps) {
  return (
    <div>
      <h4 className="mb-[14px] font-bold text-[12px] tracking-[0.1em]">{heading}</h4>
      <ul className="flex flex-col gap-[6px] list-none p-0 m-0">
        {links.map((link) => (
          <li key={link.url} className="text-[11px] tracking-[0.1em] leading-[1.4]">
            <Link href={link.url} className="transition-opacity hover:opacity-75">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
