import { getAllProperties, getSite } from '@/sanity/lib/data'
import FooterCol from '@/ui/molecules/footer-col'
import SocialLinks from '@/ui/molecules/social-links'

export default async function Footer() {
	const [site, properties] = await Promise.all([getSite(), getAllProperties()])

	return (
		<footer className="bg-primary text-primary-foreground">
			<div className="flex flex-wrap gap-16 px-[90px] pt-[37px] pb-[30px] max-[820px]:flex-col max-[820px]:items-center max-[820px]:gap-7 max-[820px]:px-[24px] max-[820px]:pt-[30px] max-[820px]:text-center">
				{/* Brand */}
				<div className="font-stories text-primary-foreground self-start text-[49px] leading-none tracking-[0.1em] max-[820px]:self-auto">
					{site?.footerBrandName ?? site?.title ?? 'AltHomes'}
				</div>

				{/* Nav columns */}
				<div className="ml-auto flex gap-16 max-[820px]:ml-0 max-[820px]:flex-wrap max-[820px]:justify-center max-[820px]:gap-7">
					{/* OUR HOMES */}
					{properties && properties.length > 0 && (
						<div>
							<h4 className="mb-3 font-sans text-[12px] font-bold tracking-[0.1em]">
								OUR HOMES
							</h4>
							<ul className="flex flex-col gap-2">
								{properties.map((p) => (
									<li key={p._id}>
										<a
											href={`/our-homes/${p.slug}`}
											className="text-[11px] leading-[1.4] tracking-[0.1em] text-primary-foreground no-underline transition-opacity hover:opacity-75"
										>
											{p.title?.toUpperCase()}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}

					{site?.footerAboutLinks && site.footerAboutLinks.length > 0 && (
						<FooterCol
							heading="ABOUT"
							links={site.footerAboutLinks.map((l) => ({
								label: l.label ?? '',
								url: l.url ?? '#',
							}))}
						/>
					)}

					{site?.footerPolicyLinks && site.footerPolicyLinks.length > 0 && (
						<FooterCol
							heading="POLICIES"
							links={site.footerPolicyLinks.map((l) => ({
								label: l.label ?? '',
								url: l.url ?? '#',
							}))}
						/>
					)}
				</div>

				{/* Connect */}
				<div className="flex flex-col items-start gap-3">
					<h4 className="font-sans text-[12px] font-bold tracking-[0.1em]">
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
			</div>
		</footer>
	)
}
