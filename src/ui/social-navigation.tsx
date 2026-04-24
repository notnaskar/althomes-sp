import {
	FaFacebook,
	FaInstagram,
	FaLinkedinIn,
	FaYoutube,
} from 'react-icons/fa6'
import { getSite } from '@/sanity/lib/data'

export default async function (props: React.ComponentProps<'nav'>) {
	const site = await getSite()

	const socials = [
		{ url: site?.instagramUrl, icon: FaInstagram, label: 'Instagram' },
		{ url: site?.facebookUrl, icon: FaFacebook, label: 'Facebook' },
		{ url: site?.linkedinUrl, icon: FaLinkedinIn, label: 'LinkedIn' },
		{ url: site?.youtubeUrl, icon: FaYoutube, label: 'YouTube' },
	].filter((s): s is { url: string; icon: typeof FaInstagram; label: string } =>
		Boolean(s.url),
	)

	if (!socials.length) return null

	return (
		<nav {...props}>
			{socials.map(({ url, icon: Icon, label }) => (
				<a
					key={label}
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={label}
					className="text-current"
				>
					<Icon />
				</a>
			))}
		</nav>
	)
}
