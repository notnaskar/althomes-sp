import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import {
	Cormorant_Garamond,
	DM_Sans,
	Geist,
	Inter,
	JetBrains_Mono,
	Libre_Baskerville,
	Lora,
	Playfair_Display,
	Plus_Jakarta_Sans,
	Poppins,
	Space_Mono,
} from 'next/font/google'
import localFont from 'next/font/local'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { preconnect } from 'react-dom'
import { Toaster } from 'sonner'
import { getSite } from '@/sanity/lib/data'
import { urlFor } from '@/sanity/lib/image'
import { SanityLive } from '@/sanity/lib/live'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import VisualEditing from '@/ui/modules/visual-editing'
import { ThemeProvider } from '@/ui/theme-provider'
import '@/app.css'

// ISR safety net: re-render every 5min if no webhook revalidation arrived.
// Webhook (POST /api/revalidate) handles instant invalidation on Sanity publish.
export const revalidate = 300

const geist = Geist({
	subsets: ['latin'],
	variable: '--font-geist',
	display: 'swap',
})
const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: 'swap',
})
const dmSans = DM_Sans({
	subsets: ['latin'],
	variable: '--font-dm-sans',
	display: 'swap',
})
const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ['latin'],
	variable: '--font-plus-jakarta-sans',
	display: 'swap',
})
const playfairDisplay = Playfair_Display({
	subsets: ['latin'],
	variable: '--font-playfair-display',
	display: 'swap',
})
const lora = Lora({
	subsets: ['latin'],
	variable: '--font-lora',
	display: 'swap',
})
const libreBaskerville = Libre_Baskerville({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-libre-baskerville',
	display: 'swap',
})
const cormorantGaramond = Cormorant_Garamond({
	subsets: ['latin'],
	weight: ['400', '600', '700'],
	variable: '--font-cormorant-garamond',
	display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains-mono',
	display: 'swap',
})
const spaceMono = Space_Mono({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-space-mono',
	display: 'swap',
})
const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-poppins',
	display: 'swap',
})

const aDayWithoutSun = localFont({
	src: '../fonts/a-day-without-sun.otf',
	variable: '--font-a-day-without-sun',
	weight: '400',
	style: 'normal',
	display: 'swap',
})

const ALL_FONT_CLASSES = [
	geist.variable,
	inter.variable,
	dmSans.variable,
	plusJakartaSans.variable,
	playfairDisplay.variable,
	lora.variable,
	libreBaskerville.variable,
	cormorantGaramond.variable,
	jetbrainsMono.variable,
	spaceMono.variable,
	poppins.variable,
	aDayWithoutSun.variable,
].join(' ')

const FONT_VAR_MAP: Record<string, string> = {
	geist: 'var(--font-geist)',
	inter: 'var(--font-inter)',
	'dm-sans': 'var(--font-dm-sans)',
	'plus-jakarta-sans': 'var(--font-plus-jakarta-sans)',
	'playfair-display': 'var(--font-playfair-display)',
	lora: 'var(--font-lora)',
	'libre-baskerville': 'var(--font-libre-baskerville)',
	'cormorant-garamond': 'var(--font-cormorant-garamond)',
	'jetbrains-mono': 'var(--font-jetbrains-mono)',
	'space-mono': 'var(--font-space-mono)',
	poppins: 'var(--font-poppins)',
}

function sanitizeHex(v: string | undefined): string | undefined {
	if (!v) return undefined
	return /^#[0-9A-Fa-f]{3,6}$/.test(v.trim()) ? v.trim() : undefined
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	preconnect('https://cdn.sanity.io')

	const isDraft = (await draftMode()).isEnabled
	const site = await getSite()
	const c = site?.colours
	const f = site?.fonts

	const rawVars: Record<string, string | undefined> = {
		'--color-primary': sanitizeHex(c?.primary),
		'--color-primary-foreground': sanitizeHex(c?.primaryForeground),
		'--color-accent': sanitizeHex(c?.accent),
		'--color-accent-foreground': sanitizeHex(c?.accentForeground),
		'--color-background': sanitizeHex(c?.background),
		'--color-foreground': sanitizeHex(c?.foreground),
		'--color-muted': sanitizeHex(c?.muted),
		'--color-stroke': sanitizeHex(c?.border),
		'--font-sans': f?.body ? FONT_VAR_MAP[f.body] : undefined,
		'--font-heading': f?.heading ? FONT_VAR_MAP[f.heading] : undefined,
		'--font-mono': f?.mono ? FONT_VAR_MAP[f.mono] : undefined,
	}

	const themeVars = Object.fromEntries(
		Object.entries(rawVars).filter(
			(e): e is [string, string] => e[1] !== undefined,
		),
	)

	const themeCSS = Object.keys(themeVars).length
		? `:root{${Object.entries(themeVars)
				.map(([k, v]) => `${k}:${v};`)
				.join('')}}`
		: ''

	return (
		<html
			lang="en"
			className={ALL_FONT_CLASSES}
			data-scroll-behavior="smooth"
			suppressHydrationWarning
		>
			<NuqsAdapter>
				<body
					className="bg-background text-foreground antialiased"
					suppressHydrationWarning
				>
					{themeCSS && <style>{themeCSS}</style>}
					<ThemeProvider vars={themeVars} />
					<Header />
					<main>{children}</main>
					<Footer />
					{isDraft && <SanityLive />}
					<Toaster position="bottom-right" richColors />
					<VisualEditing />
				</body>
			</NuqsAdapter>
		</html>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const site = await getSite()
	const favicon = site?.favicon
	return {
		icons: favicon?.asset
			? { icon: urlFor(favicon).url() }
			: { icon: '/favicon.ico' },
	}
}
