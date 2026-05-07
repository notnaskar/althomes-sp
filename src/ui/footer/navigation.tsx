import Link from 'next/link'

const FOOTER_NAV = [
	{ href: '/our-homes', label: 'Our Homes' },
	{ href: '/experiences', label: 'Experiences' },
	{ href: '/the-alt-way', label: 'The Alt Way' },
	{ href: '/join-us', label: 'Join Us' },
	{ href: '/contact', label: 'Contact' },
	{ href: '/blog', label: 'Blog' },
]

export default function () {
	return (
		<nav>
			<ul className="gap-y-lh flex items-start justify-center gap-x-[2lh] max-[820px]:flex-col">
				{FOOTER_NAV.map(({ href, label }) => (
					<li key={href}>
						<Link href={href} className="text-current hover:underline">
							{label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}
