import { stegaClean } from 'next-sanity'

export default function ({ value }: { value?: string }) {
	if (!value) return null

	return (
		<p className="technical text-foreground/50 text-sm">{stegaClean(value)}</p>
	)
}
