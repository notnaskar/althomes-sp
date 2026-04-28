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
          <li key={link.url}>
            <Link
              href={link.url}
              className="transition-opacity hover:opacity-75"
              style={{ fontSize: 11, letterSpacing: '0.1em', lineHeight: 1.4, color: '#FCF6EA', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
