import type { SchemaPluginOptions } from 'sanity'
// documents
import altWayPage from './documents/altWayPage'
import amenity from './documents/amenity'
import blogPost from './documents/blog.post'
import contactPage from './documents/contactPage'
import experience from './documents/experience'
import experiencesPage from './documents/experiencesPage'
import homePage from './documents/homePage'
import joinUsPage from './documents/joinUsPage'
import legalPage from './documents/legalPage'
import ourHomesPage from './documents/ourHomesPage'
import property from './documents/property'
import redirect from './documents/redirect'
import review from './documents/review'
import site from './documents/site'
// modules
import accordionList from './modules/accordion-list'
import blogIndex from './modules/blog-index'
import blogPostContent from './modules/blog-post-content'
import blogPostList from './modules/blog-post-list'
import breadcrumbs from './modules/breadcrumbs'
import callout from './modules/callout'
import cardList from './modules/card-list'
import customHtml from './modules/custom-html'
import heroSplit from './modules/hero.split'
import prose from './modules/prose'
import searchModule from './modules/search-module'
import statList from './modules/stat-list'
import stepList from './modules/step-list'
// objects
import blockContent from './objects/blockContent'
import cta from './objects/cta'
import link from './objects/link'
import linkList from './objects/link.list'
import location from './objects/location'
import megamenu from './objects/megamenu'
import metadata from './objects/metadata'
import moduleAttributes from './objects/module-attributes'
import navLabel from './objects/navLabel'
import seo from './objects/seo'

export const schema: SchemaPluginOptions = {
	types: [
		// documents
		altWayPage,
		amenity,
		blogPost,
		contactPage,
		experience,
		experiencesPage,
		homePage,
		joinUsPage,
		legalPage,
		ourHomesPage,
		property,
		redirect,
		review,
		site,

		// objects
		blockContent,
		cta,
		link,
		linkList,
		location,
		megamenu,
		metadata,
		moduleAttributes,
		navLabel,
		seo,

		// modules
		accordionList,
		blogIndex,
		blogPostContent,
		blogPostList,
		breadcrumbs,
		callout,
		cardList,
		customHtml,
		heroSplit,
		prose,
		searchModule,
		statList,
		stepList,
	],

	templates: (templates) =>
		templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
}

const singletonTypes = [
	'homePage',
	'ourHomesPage',
	'altWayPage',
	'experiencesPage',
	'joinUsPage',
	'contactPage',
	'site',
]
