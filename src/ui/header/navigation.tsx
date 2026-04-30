import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
	{ href: '/our-homes', label: 'Our Homes' },
	{ href: '/experiences', label: 'Experiences' },
	{ href: '/the-alt-way', label: 'The Alt Way' },
	{ href: '/blog', label: 'Blog' },
]

const topLevelClassName = cn(
	'grid min-[821px]:place-content-center min-[821px]:text-center min-[821px]:text-balance leading-tight py-[.5ch] min-[821px]:py-ch',
)

export default function Navigation() {
	return (
		<nav className="max-[820px]:header-not-open:hidden max-[820px]:anim-fade-to-b gap-x-lh flex items-stretch [grid-area:navigation] max-[820px]:my-4 max-[820px]:flex-col">
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
