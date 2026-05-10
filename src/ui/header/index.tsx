import { getSite } from '@/sanity/lib/data'
import Logo from '@/ui/logo'
import MenuState from '@/ui/menu-state'
import HeaderShell from './header-shell'

export default async function Header() {
	const site = await getSite()

	return (
		<HeaderShell>
			{/* Desktop logo — left aligned */}
			<Logo className="[height:75px] [width:215px] flex-shrink-0 has-[img]:[height:75px] max-lg:hidden" />

			{/* Right controls */}
			<div className="flex items-center gap-6 max-lg:contents">
				{/* Desktop STAY WITH US */}
				{site?.navCtaLink && (
					<a
						href={site.navCtaLink}
						className="inline-flex flex-shrink-0 items-center justify-center rounded-[5px] text-[14px] font-bold tracking-[0.3em] transition-opacity hover:opacity-90 max-lg:hidden"
						style={{
							background: '#2F5D50',
							color: '#FCF6EA',
							height: 48,
							padding: '0 24px',
							minWidth: 192,
						}}
					>
						{site.navCtaLabel || 'STAY WITH US'}
					</a>
				)}
				{/* Mobile mini STAY */}
				{site?.navCtaLink && (
					<a
						href={site.navCtaLink}
						className="inline-flex flex-shrink-0 items-center justify-center rounded-[5px] text-[14px] font-bold tracking-[0.3em] lg:hidden"
						style={{
							background: '#2F5D50',
							color: '#FCF6EA',
							width: 70,
							height: 30,
						}}
					>
						STAY
					</a>
				)}
				{/* Mobile logo — shrinks to fit narrow viewports */}
				<Logo className="min-w-0 [height:60px] [max-width:160px] [width:auto] has-[img]:[height:60px] has-[img]:[max-height:60px] lg:hidden" />

				{/* Hamburger + menu overlay */}
				{site && <MenuState site={site} />}
			</div>
		</HeaderShell>
	)
}
