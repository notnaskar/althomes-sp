import { getSite } from '@/sanity/lib/data'
import Logo from '@/ui/logo'
import MenuState from '@/ui/menu-state'

export default async function Header() {
	const site = await getSite()

	return (
		<header
			className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between [padding:44px_90px_0] max-[820px]:[padding:36px_18px_0]"
		>
			{/* Logo — hidden on mobile */}
			<Logo className="flex-shrink-0 max-[820px]:hidden [width:215px] [height:75px] has-[img]:[height:75px]" />

			{/* Right controls */}
			<div className="flex items-center gap-6 max-[820px]:w-full max-[820px]:justify-between max-[820px]:flex-row-reverse">
				{/* Desktop STAY WITH US */}
				{site?.navCtaLink && (
					<a
						href={site.navCtaLink}
						className="max-[820px]:hidden inline-flex items-center justify-center rounded-[5px] font-bold text-[14px] tracking-[0.3em] transition-opacity hover:opacity-90"
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
						className="min-[821px]:hidden inline-flex items-center justify-center rounded-[5px] font-bold text-[14px] tracking-[0.3em]"
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
				{/* Hamburger + menu overlay */}
				{site && <MenuState site={site} />}
			</div>
		</header>
	)
}
