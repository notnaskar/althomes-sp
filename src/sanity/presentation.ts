import { defineLocations, presentationTool } from 'sanity/presentation'
import { ROUTES } from '@/lib/env'

export default presentationTool({
	previewUrl: {
		previewMode: {
			enable: '/api/draft-mode/enable',
		},
	},
	resolve: {
		locations: {
			homePage: defineLocations({
				select: { title: 'heroHeadline' },
				resolve: () => ({ locations: [{ title: 'Home', href: '/' }] }),
			}),
			ourHomesPage: defineLocations({
				select: { title: 'heroHeadline' },
				resolve: () => ({
					locations: [{ title: 'Our Homes', href: '/our-homes' }],
				}),
			}),
			altWayPage: defineLocations({
				select: { title: 'heroHeadline' },
				resolve: () => ({
					locations: [{ title: 'The Alt Way', href: '/the-alt-way' }],
				}),
			}),
			experiencesPage: defineLocations({
				select: { title: 'heroHeadline' },
				resolve: () => ({
					locations: [{ title: 'Experiences', href: '/experiences' }],
				}),
			}),
			joinUsPage: defineLocations({
				select: { title: 'heroHeadline' },
				resolve: () => ({
					locations: [{ title: 'Join Us', href: '/join-us' }],
				}),
			}),
			contactPage: defineLocations({
				select: { title: 'heroHeadline' },
				resolve: () => ({
					locations: [{ title: 'Contact', href: '/contact' }],
				}),
			}),
			page: defineLocations({
				select: {
					title: 'title',
					slug: 'metadata.slug.current',
				},
				resolve: (doc) => ({
					locations: [
						{
							title: doc?.title,
							href: doc?.slug
								? doc.slug === 'index'
									? '/'
									: `/${doc.slug}`
								: '/',
						},
					],
				}),
			}),
			'blog.post': defineLocations({
				select: {
					title: 'metadata.title',
					slug: 'metadata.slug.current',
				},
				resolve: (doc) => ({
					locations: [
						{
							title: doc?.title,
							href: doc?.slug
								? `/${ROUTES.blog}/${doc.slug}`
								: `/${ROUTES.blog}`,
						},
					],
				}),
			}),
		},
	},
})
