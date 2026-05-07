import { stegaClean } from 'next-sanity'
import Contact from './contact'

type Form = { endpoint?: string; identifier?: string }

export default function ({ form }: { form?: Form }) {
	if (!form) return null

	switch (stegaClean(form.identifier)) {
		case 'contact':
			return <Contact form={form} />

		default:
			return null
	}
}
