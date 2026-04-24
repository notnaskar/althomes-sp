import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
	{ href: '/our-homes', label: 'Our Homes' },
	{ href: '/experiences', label: 'Experiences' },
	{ href: '/the-alt-way', label: 'The Alt Way' },
	{ href: '/blog', label: 'Blog' },
]

const topLevelClassName = cn(
	'grid md:place-content-center md:text-center md:text-balance leading-tight py-[.5ch] md:py-ch',
)

export default function () {
	return (
		<nav className="max-md:header-not-open:hidden max-md:anim-fade-to-b gap-x-lh flex items-stretch [grid-area:navigation] max-md:my-4 max-md:flex-col">
			{NAV_ITEMS.map(({ href, label }) => (
				<Link
					key={href}
					href={href}
					className={cn(topLevelClassName, 'text-current hover:underline')}
				>
					{label}
				</Link>
			))}
		</nav>
	)
}
