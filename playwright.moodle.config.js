const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  testMatch: /moodle-h5p\.spec\.js/,
  timeout: 60_000,
  use: {
    browserName: 'chromium',
    baseURL: process.env.MOODLE_URL || 'http://debiandesktop.taildc0f74.ts.net/moodle/',
    serviceWorkers: 'block',
    launchOptions: {
      args: ['--host-resolver-rules=MAP debiandesktop.taildc0f74.ts.net 100.74.151.108'],
    },
  },
  projects: [{ name: 'moodle', use: { ...devices['Desktop Chrome'] } }],
});
