import { Geist } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { preconnect } from 'react-dom'
import Footer from '@/ui/footer'
import Header from '@/ui/header'
import VisualEditing from '@/ui/modules/visual-editing'
import { SanityLive } from '@/sanity/lib/live'
import '@/app.css'

const fontSans = Geist({
	subsets: ['latin'],
})

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	preconnect('https://cdn.sanity.io')

	return (
		<html
			lang="en"
			className={fontSans.className}
			data-scroll-behavior="smooth"
			suppressHydrationWarning
		>
			<NuqsAdapter>
				<body className="bg-background text-foreground antialiased" suppressHydrationWarning>
					<Header />
					<main>{children}</main>
					<Footer />
					<SanityLive />
					<VisualEditing />
				</body>
			</NuqsAdapter>
		</html>
	)
}
