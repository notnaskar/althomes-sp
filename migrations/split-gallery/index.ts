import { defineMigration, at, setIfMissing, unset } from 'sanity/migrate'

/**
 * Copies legacy `gallery` array on every property doc into the new
 * `posterImages` AND `sliderGallery` fields (initial seed — trim
 * `sliderGallery` per property afterwards), then unsets `gallery`.
 *
 * Run with:
 *   npx sanity migration run split-gallery --no-dry-run
 */
export default defineMigration({
	title: 'Split gallery into posterImages + sliderGallery',
	documentTypes: ['property'],
	migrate: {
		document(doc) {
			const legacy = (doc as { gallery?: unknown }).gallery
			if (!Array.isArray(legacy) || legacy.length === 0) return
			return [
				at('posterImages', setIfMissing(legacy)),
				at('sliderGallery', setIfMissing(legacy)),
				at('gallery', unset()),
			]
		},
	},
})
