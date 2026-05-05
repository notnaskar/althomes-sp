import Link from 'next/link'

interface FooterColProps {
	heading: string
	links: { label: string; url: string }[]
}

export default function FooterCol({ heading, links }: FooterColProps) {
	return (
		<div>
			<h4 className="mb-[14px] font-sans text-[12px] font-bold tracking-[0.1em]">
				{heading}
			</h4>
			<ul className="m-0 flex list-none flex-col gap-[6px] p-0">
				{links.map((link) => (
					<li key={link.url}>
						<Link
							href={link.url}
							className="text-[11px] leading-[1.4] tracking-[0.1em] text-white no-underline transition-opacity hover:opacity-75"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
