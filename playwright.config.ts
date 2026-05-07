import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests/e2e',
	use: { baseURL: 'http://localhost:3001' },
	webServer: {
		command: 'npm run dev -- -p 3001',
		port: 3001,
		reuseExistingServer: !process.env.CI,
	},
})
