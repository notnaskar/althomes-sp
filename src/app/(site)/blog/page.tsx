import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getSite } from '@/sanity/lib/data'
import Img from '@/ui/img'

export default async function BlogIndexPage() {
	const posts = await getAllPosts()

	return (
		<main className="flex-1">
			<section className="container py-20">
				<h1 className="mb-12 text-center text-4xl font-bold">Blog</h1>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{posts?.map((post) => (
						<Link
							key={post._id}
							href={`/blog/${post.metadata?.slug?.current}`}
							className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
						>
							{post.metadata?.image && (
								<div className="aspect-video overflow-hidden">
									<Img
										image={post.metadata.image}
										width={600}
										alt={post.title || ''}
										className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
									/>
								</div>
							)}
							<div className="p-6">
								<h2 className="text-xl font-bold transition group-hover:text-yellow-600">
									{post.title}
								</h2>
								{post.publishDate && (
									<p className="mt-2 text-sm text-gray-500">
										{new Date(post.publishDate).toLocaleDateString()}
									</p>
								)}
							</div>
						</Link>
					))}
				</div>
			</section>
		</main>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const site = await getSite()

	return {
		title: `Blog | AltHomes`,
		description: site?.seo?.metaDescription,
	}
}
