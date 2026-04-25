'use client'
import { useLayoutEffect } from 'react'

export function ThemeProvider({ vars }: { vars: Record<string, string> }) {
	useLayoutEffect(() => {
		const root = document.documentElement
		Object.entries(vars).forEach(([key, value]) => {
			root.style.setProperty(key, value)
		})
	})
	return null
}
