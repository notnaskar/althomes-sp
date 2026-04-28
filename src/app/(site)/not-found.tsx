import type { Metadata } from 'next'

export default function NotFound() {
	return (
		<main className="flex-1 flex items-center justify-center" style={{ paddingTop: 120 }}>
			<section className="container py-20 text-center">
				<h1 className="text-4xl font-bold mb-4">404</h1>
				<p>Page not found</p>
			</section>
		</main>
	)
}

export const metadata: Metadata = {
	title: 'Page Not Found',
	description: 'The page you are looking for does not exist.',
}
