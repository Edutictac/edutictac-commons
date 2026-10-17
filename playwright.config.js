const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  testIgnore: ['**/play.spec.js', '**/moodle-h5p.spec.js'],
  fullyParallel: true,
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:18082', serviceWorkers: 'block' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'python3 scripts/serve-checks.py',
    url: 'http://127.0.0.1:18082',
    reuseExistingServer: false,
    stderr: 'ignore',
  },
});
