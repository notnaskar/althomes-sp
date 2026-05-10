import { getAllProperties, getSite } from '@/sanity/lib/data'
import FooterCol from '@/ui/molecules/footer-col'
import SocialLinks from '@/ui/molecules/social-links'

export default async function Footer() {
	const [site, properties] = await Promise.all([getSite(), getAllProperties()])

	const ourHomes = properties && properties.length > 0 && (
		<div>
			<h4 className="mb-3 font-sans text-[12px] font-bold tracking-[0.1em]">
				OUR HOMES
			</h4>
			<ul className="flex flex-col gap-2">
				{properties.map((p) => (
					<li key={p._id}>
						<a
							href={`/our-homes/${p.slug}`}
							className="text-primary-foreground text-[11px] leading-[1.4] tracking-[0.1em] no-underline transition-opacity hover:opacity-75"
						>
							{p.title?.toUpperCase()}
						</a>
					</li>
				))}
			</ul>
		</div>
	)

	const about = site?.footerAboutLinks && site.footerAboutLinks.length > 0 && (
		<FooterCol
			heading="ABOUT"
			links={site.footerAboutLinks.map((l) => ({
				label: l.label ?? '',
				url: l.url ?? '#',
			}))}
		/>
	)

	const policies = site?.footerPolicyLinks &&
		site.footerPolicyLinks.length > 0 && (
			<FooterCol
				heading="POLICIES"
				links={site.footerPolicyLinks.map((l) => ({
					label: l.label ?? '',
					url: l.url ?? '#',
				}))}
			/>
		)

	const brand = (
		<div className="font-stories text-primary-foreground text-[49px] leading-none tracking-[0.1em] max-xl:text-[40px]">
			{site?.footerBrandName ?? site?.title ?? 'AltHomes'}
		</div>
	)

	const connect = (
		<div className="flex flex-col max-xl:items-end">
			<h4 className="self-start font-sans text-[12px] font-bold tracking-[0.1em]">
				CONNECT
			</h4>
			<SocialLinks
				instagram={site?.instagramUrl}
				facebook={site?.facebookUrl}
				linkedin={site?.linkedinUrl}
				youtube={site?.youtubeUrl}
				size={14}
			/>
		</div>
	)

	return (
		<footer className="bg-primary text-primary-foreground">
			{/* Desktop ≥ lg */}
			<div className="hidden flex-wrap gap-16 px-[90px] pt-[37px] pb-[30px] xl:flex">
				<div className="self-start">{brand}</div>
				<div className="ml-auto flex gap-16">
					{ourHomes}
					{about}
					{policies}
				</div>
				{connect}
			</div>

			{/* Mobile < lg */}
			<div className="flex flex-col gap-7 px-[24px] pt-[30px] pb-[30px] xl:hidden">
				{/* Row 1: brand + connect */}
				<div className="flex items-start justify-between gap-4">
					{brand}
					{connect}
				</div>
				{/* Row 2: 3 columns, collapse to 1 col left-aligned below 480px */}
				<div className="grid grid-cols-3 gap-7 max-[480px]:grid-cols-1 max-[480px]:gap-6">
					{ourHomes}
					{about}
					{policies}
				</div>
			</div>
		</footer>
	)
}
