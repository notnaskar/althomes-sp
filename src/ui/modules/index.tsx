import { createDataAttribute, stegaClean } from 'next-sanity'
import type { BLOG_POST_QUERY_RESULT, ModuleAttributes } from '@/sanity/types'
import AccordionList from './accordion-list'
import BlogIndex from './blog/blog-index'
import BlogPostContent from './blog/blog-post-content'
import BlogPostList from './blog/blog-post-list'
import Breadcrumbs from './breadcrumbs'
import Callout from './callout'
import CardList from './card-list'
import CustomHTML from './custom-html'
import HeroSplit from './hero.split'
import Prose from './prose'
import SearchModule from './search'
import StatList from './stat-list'
import StepList from './step-list'

export type ModuleProps = {
	_type?: string
	_key?: string
	attributes?: ModuleAttributes
} & Record<string, unknown>

type AnyPage = {
	_id: string
	_type: string
	title?: string
	modules?: Array<ModuleProps> | null
}

const MODULES_MAP = {
	'accordion-list': AccordionList,
	'blog-index': BlogIndex,
	'blog-post-content': BlogPostContent,
	'blog-post-list': BlogPostList,
	breadcrumbs: Breadcrumbs,
	callout: Callout,
	'card-list': CardList,
	'custom-html': CustomHTML,
	'hero.split': HeroSplit,
	prose: Prose,
	'search-module': SearchModule,
	'stat-list': StatList,
	'step-list': StepList,
} as const

export default function ({
	page,
	post,
}: {
	page?: AnyPage
	post?: BLOG_POST_QUERY_RESULT
}) {
	const modules = page?.modules ?? []

	const moduleSpecificProps = (module: ModuleProps) => {
		switch (module._type) {
			case 'blog-post-content':
				return { post }
			case 'breadcrumbs':
				return { currentPage: page ?? (post as { title?: string } | undefined) }
			default:
				return {}
		}
	}

	return (
		<>
			{modules?.map((module) => {
				if (!module) return null

				const Module = MODULES_MAP[
					module._type as keyof typeof MODULES_MAP
				] as React.ComponentType

				if (!Module) return null

				const attributes = page
					? {
							id: page._id,
							type: page._type,
							path: `page[_key == "${module._key}"]`,
						}
					: post
						? {
								id: post._id,
								type: post._type,
								path: `post[_key == "${module._key}"]`,
							}
						: {}

				return (
					<Module
						{...module}
						{...moduleSpecificProps(module)}
						data-sanity={createDataAttribute(attributes)}
						key={module._key}
					/>
				)
			})}
		</>
	)
}

export function moduleAttributes({ _key, _type, attributes }: ModuleProps) {
	return {
		id: stegaClean(attributes?.uid) || `module-${_key}`,
		'data-module': _type,
		hidden: attributes?.hidden,
	}
}
