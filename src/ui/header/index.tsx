import { getSite } from '@/sanity/lib/data'
import Logo from '@/ui/logo'
import MenuState from '@/ui/menu-state'

export default async function Header() {
	const site = await getSite()

	return (
		<header className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between [padding:44px_90px_0] max-[820px]:[padding:calc(env(safe-area-inset-top)+36px)_18px_0]">
			{/* Desktop logo — left aligned */}
			<Logo className="[height:75px] [width:215px] flex-shrink-0 has-[img]:[height:75px] max-[820px]:hidden" />

			{/* Right controls */}
			<div className="flex items-center gap-6 max-[820px]:w-full max-[820px]:flex-row-reverse max-[820px]:justify-between">
				{/* Desktop STAY WITH US */}
				{site?.navCtaLink && (
					<a
						href={site.navCtaLink}
						className="inline-flex items-center justify-center rounded-[5px] text-[14px] font-bold tracking-[0.3em] transition-opacity hover:opacity-90 max-[820px]:hidden"
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
						className="inline-flex items-center justify-center rounded-[5px] text-[14px] font-bold tracking-[0.3em] min-[821px]:hidden"
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
				{/* Mobile logo — center-ish via justify-between on row */}
				<Logo className="[height:60px] [width:auto] flex-shrink-0 has-[img]:[height:60px] min-[821px]:hidden" />

				{/* Hamburger + menu overlay */}
				{site && <MenuState site={site} />}
			</div>
		</header>
	)
}
