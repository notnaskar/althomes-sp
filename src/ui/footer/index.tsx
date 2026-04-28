import { getAllProperties, getSite } from '@/sanity/lib/data'
import FooterCol from '@/ui/molecules/footer-col'
import SocialLinks from '@/ui/molecules/social-links'

export default async function Footer() {
	const [site, properties] = await Promise.all([getSite(), getAllProperties()])

	return (
		<footer style={{ background: '#2F5D50', color: '#FCF6EA' }}>
			<div
				className="flex flex-wrap gap-16 max-[820px]:flex-col max-[820px]:items-center max-[820px]:gap-7 max-[820px]:text-center"
				style={{ padding: '37px 90px 30px' }}
			>
				{/* Brand */}
				<div className="self-start font-['Playfair_Display'] text-[49px] leading-none tracking-[0.1em] text-white italic max-[820px]:self-auto">
					{site?.footerBrandName ?? site?.title ?? 'AltHomes'}
				</div>

				{/* Nav columns */}
				<div className="ml-auto flex gap-16 max-[820px]:ml-0 max-[820px]:flex-wrap max-[820px]:justify-center max-[820px]:gap-7">
					{/* OUR HOMES */}
					{properties && properties.length > 0 && (
						<div>
							<h4
								className="mb-3 font-bold"
								style={{ fontSize: 12, letterSpacing: '0.1em' }}
							>
								OUR HOMES
							</h4>
							<ul className="flex flex-col gap-1.5">
								{properties.map((p) => (
									<li key={p._id}>
										<a
											href={`/our-homes/${p.slug}`}
											className="transition-opacity hover:opacity-75"
											style={{
												fontSize: 11,
												letterSpacing: '0.1em',
												lineHeight: 1.4,
												color: '#FCF6EA',
												textDecoration: 'none',
											}}
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
				<div className="flex flex-col items-center gap-3">
					<h4
						className="font-bold"
						style={{ fontSize: 12, letterSpacing: '0.1em' }}
					>
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
