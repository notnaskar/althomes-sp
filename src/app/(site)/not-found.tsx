import type { Metadata } from 'next'

export default function NotFound() {
	return (
		<main
			className="flex flex-1 items-center justify-center"
			style={{ paddingTop: 120 }}
		>
			<section className="container py-20 text-center">
				<h1 className="mb-4 text-4xl font-bold">404</h1>
				<p>Page not found</p>
			</section>
		</main>
	)
}

export const metadata: Metadata = {
	title: 'Page Not Found',
	description: 'The page you are looking for does not exist.',
}
