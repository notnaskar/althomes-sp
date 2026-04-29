import path from 'path'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@/sanity/lib/live.ts': path.resolve(__dirname, './tests/__mocks__/sanity-live.ts'),
			'@/sanity/lib/live': path.resolve(__dirname, './tests/__mocks__/sanity-live.ts'),
		},
	},
	test: {
		include: ['tests/unit/**/*.test.ts'],
		passWithNoTests: true,
		setupFiles: ['tests/setup.ts'],
	},
})
