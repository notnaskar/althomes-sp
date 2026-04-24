import { getSite } from '@/sanity/lib/data'
import Logo from '@/ui/logo'
import SocialNavigation from '@/ui/social-navigation'
import Navigation from './navigation'

export default async function () {
	const site = await getSite()

	return (
		<footer>
			<div className="section space-y-4">
				<div className="flex justify-between gap-4 max-md:flex-col md:items-start">
					<div className="flex flex-col items-center gap-4 max-md:text-center md:items-start">
						<Logo className="[&_img]:h-[2lh]" />
						<SocialNavigation className="[&_svg]:size-lh link flex items-center gap-4 max-md:justify-center" />
					</div>

					<Navigation />
				</div>

				{site?.title && (
					<div className="text-center text-sm opacity-60">
						© {new Date().getFullYear()} {site.title}. All rights reserved.
					</div>
				)}
			</div>
		</footer>
	)
}
