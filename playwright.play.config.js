const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  testMatch: /play\.spec\.js/,
  use: { baseURL: 'http://127.0.0.1:18183', serviceWorkers: 'block' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'PORT=18183 PLAY_DATA_DIR=/tmp/edutictac-play-browser python3 services/play/server.py',
    url: 'http://127.0.0.1:18183/api/health',
    reuseExistingServer: false,
    stderr: 'ignore',
  },
});
