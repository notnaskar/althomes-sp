import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { Playfair_Display, Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'
import { getSite } from '@/sanity/lib/data'
import { urlFor } from '@/sanity/lib/image'
import { SanityLive } from '@/sanity/lib/live'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import VisualEditing from '@/ui/modules/visual-editing'
import { ThemeProvider } from '@/ui/theme-provider'
import '@/app.css'

// ISR safety net: re-render every 30min if no webhook revalidation arrived.
// Webhook (POST /api/revalidate) handles instant invalidation on Sanity publish.
export const revalidate = 1800

const playfairDisplay = Playfair_Display({
	subsets: ['latin'],
	variable: '--font-playfair-display',
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
	playfairDisplay.variable,
	poppins.variable,
	aDayWithoutSun.variable,
].join(' ')

function sanitizeHex(v: string | undefined): string | undefined {
	if (!v) return undefined
	return /^#[0-9A-Fa-f]{3,6}$/.test(v.trim()) ? v.trim() : undefined
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const isDraft = (await draftMode()).isEnabled
	const site = await getSite()
	const c = site?.colours

	const rawVars: Record<string, string | undefined> = {
		'--color-primary': sanitizeHex(c?.primary),
		'--color-primary-foreground': sanitizeHex(c?.primaryForeground),
		'--color-accent': sanitizeHex(c?.accent),
		'--color-accent-foreground': sanitizeHex(c?.accentForeground),
		'--color-background': sanitizeHex(c?.background),
		'--color-foreground': sanitizeHex(c?.foreground),
		'--color-muted': sanitizeHex(c?.muted),
		'--color-stroke': sanitizeHex(c?.border),
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
			<head>
				<link
					rel="preconnect"
					href="https://cdn.sanity.io"
					crossOrigin=""
				/>
				<link rel="dns-prefetch" href="https://cdn.sanity.io" />
			</head>
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
					<Toaster position="top-center" richColors />
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
