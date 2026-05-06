'use client'

import { useEffect } from 'react'
import './rentalwise-widget.css'

const SCRIPT_SRC = 'https://app.rentalwise.io/public/widget/script.js?v=2'
const STYLE_HREF = 'https://app.rentalwise.io/public/widget/style.css'

type Props = {
	instance: string
	identifier: string
	propertyId: string
}

export default function RentalwiseWidget({ instance, identifier, propertyId }: Props) {
	useEffect(() => {
		if (!document.querySelector('link[data-rw-style]')) {
			const link = document.createElement('link')
			link.rel = 'stylesheet'
			link.href = STYLE_HREF
			link.setAttribute('data-rw-style', '')
			document.head.appendChild(link)
		}
		if (!document.querySelector('script[data-rw-script]')) {
			const script = document.createElement('script')
			script.type = 'module'
			script.src = SCRIPT_SRC
			script.setAttribute('data-rw-script', '')
			document.head.appendChild(script)
		}
	}, [])

	return (
		<rw-widget instance={instance} identifier={identifier} property-id={propertyId} >

			<rw-quote-daterange-input/>
			<rw-quote-guests-input />
			<rw-quote-coupon-input />

			<rw-quote-total />
			<rw-quote-book-button />


			{/* <rw-quote-no-results>
				<p className="font-sans text-[15px] tracking-[0.1em] text-foreground text-center pt-5">
					Please select your dates
				</p>
			</rw-quote-no-results> */}

			{/* <rw-quote-error /> */}
			{/* <rw-quote-is-loading >
				<p className="font-sans text-[15px] tracking-[0.1em] text-muted text-center pt-5">
					Loading quote…
				</p>
			</rw-quote-is-loading> */}
		</rw-widget>
	)
}
