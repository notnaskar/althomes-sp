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
		<div className="font-stories text-primary-foreground text-[49px] leading-none tracking-[0.1em] max-lg:text-[40px]">
			{site?.footerBrandName ?? site?.title ?? 'AltHomes'}
		</div>
	)

	const connect = (
		<div className="flex flex-col">
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
	)

	return (
		<footer className="bg-primary text-primary-foreground">
			<div className="grid gap-7 px-6 py-[30px] [grid-template-areas:'brand_connect''ourhomes_ourhomes''about_about''policies_policies'] [grid-template-columns:1fr_auto] sm:[grid-template-areas:'brand_._connect''ourhomes_about_policies'] sm:[grid-template-columns:1fr_1fr_1fr] lg:gap-16 lg:px-[90px] lg:pt-[37px] lg:pb-[30px] lg:[grid-template-areas:'brand_._ourhomes_about_policies_connect'] lg:[grid-template-columns:auto_1fr_auto_auto_auto_auto]">
				<div className="[grid-area:brand]">{brand}</div>
				{ourHomes && <div className="[grid-area:ourhomes]">{ourHomes}</div>}
				{about && <div className="[grid-area:about]">{about}</div>}
				{policies && <div className="[grid-area:policies]">{policies}</div>}
				<div className="[grid-area:connect]">{connect}</div>
			</div>
		</footer>
	)
}
