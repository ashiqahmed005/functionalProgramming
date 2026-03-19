import { defineConfig, defineProject } from 'vitest/config';
import { playwright }                  from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    projects: [
      // ── Unit tests — Node, no browser overhead ─────────────────────────────
      defineProject({
        test: {
          name:        'unit',
          include:     ['src/**/*.test.js'],
          exclude:     ['src/**/*.browser.test.js', 'node_modules/**'],
          environment: 'node',
        },
      }),

      // ── Browser tests — real Chromium via Playwright ───────────────────────
      defineProject({
        test: {
          name:    'browser',
          include: ['src/**/*.browser.test.js'],
          browser: {
            enabled:  true,
            provider: playwright(),
            name:     'chromium',
            headless: true,
          },
        },
      }),
    ],
  },
});
