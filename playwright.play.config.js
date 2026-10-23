const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  testMatch: ['**/play.spec.js', '**/play-vue.spec.js'],
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:18183', serviceWorkers: 'block' },
  expect: { timeout: 10000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'PORT=18183 PLAY_COMMONS_URL=http://commons.test URL_PREFIX=/play PLAY_DATA_DIR=/tmp/edutictac-play-browser EDUTICTAC_PLAY_ADMIN_TOKEN=test-admin-token python3 services/play/server.py',
    url: 'http://127.0.0.1:18183/play/api/health',
    reuseExistingServer: false,
    stderr: 'ignore',
  },
});
