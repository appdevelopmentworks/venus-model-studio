import { defineConfig, devices } from '@playwright/test';

/**
 * E2Eはproduction buildに対して実行する(演出・SEO・静的生成を実挙動で確認)。
 * webServerが未起動なら自動で build → start する。
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'reduced-motion',
      use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' }
    },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000/ja',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
