import type { StringInputProps } from 'sanity'
import { set, unset, PatchEvent } from 'sanity'
import { Card, Flex, Grid, Stack, Text, TextInput } from '@sanity/ui'
import { useState } from 'react'
import { ICON_MAP } from '@/ui/atoms/icon-map'

export default function IconPicker({ value, onChange }: StringInputProps) {
	const [search, setSearch] = useState('')

	const entries = Object.entries(ICON_MAP).filter(([name]) =>
		name.toLowerCase().includes(search.toLowerCase()),
	)

	const CurrentIcon = value ? ICON_MAP[value] : null

	return (
		<Stack space={3}>
			{CurrentIcon && (
				<Flex align="center" gap={3}>
					<CurrentIcon size={28} />
					<Text size={1} muted>
						{value}
					</Text>
				</Flex>
			)}

			<TextInput
				value={search}
				onChange={(e) => setSearch(e.currentTarget.value)}
				placeholder="Search icons (e.g. wifi, pool, bed)…"
			/>

			<div style={{ maxHeight: 280, overflowY: 'auto' }}>
				<Grid columns={8} gap={1}>
					{entries.map(([name, IconComp]) => (
						<Card
							key={name}
							tone={value === name ? 'primary' : 'default'}
							padding={2}
							radius={2}
							style={{ cursor: 'pointer', textAlign: 'center' }}
							onClick={() => onChange(PatchEvent.from(set(name)))}
							title={name}
						>
							<IconComp size={20} />
						</Card>
					))}
				</Grid>
			</div>

			{value && (
				<Text
					size={1}
					style={{ cursor: 'pointer', color: 'var(--card-muted-fg-color)' }}
					onClick={() => onChange(PatchEvent.from(unset()))}
				>
					Clear selection
				</Text>
			)}
		</Stack>
	)
}
