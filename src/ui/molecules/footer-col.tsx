import Link from 'next/link'

interface FooterColProps {
	heading: string
	links: { label: string; url: string }[]
}

export default function FooterCol({ heading, links }: FooterColProps) {
	return (
		<div>
			<h4 className="mb-[14px] text-[12px] font-bold tracking-[0.1em]">
				{heading}
			</h4>
			<ul className="m-0 flex list-none flex-col gap-[6px] p-0">
				{links.map((link) => (
					<li key={link.url}>
						<Link
							href={link.url}
							className="transition-opacity hover:opacity-75"
							style={{
								fontSize: 11,
								letterSpacing: '0.1em',
								lineHeight: 1.4,
								color: '#FCF6EA',
								textDecoration: 'none',
							}}
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
