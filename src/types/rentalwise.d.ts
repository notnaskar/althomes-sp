declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'rw-widget': React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement> & {
					instance?: string
					identifier?: string
					'property-id'?: string
				},
				HTMLElement
			>
			'rw-quote-daterange-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-guests-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-coupon-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-result': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-products': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-total': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-book-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-error': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-no-results': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
			'rw-quote-is-loading': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
		}
	}
}

export {}
