import * as Sentry from '@sentry/nuxt';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sampleRate: 1,
  enableLogs: true,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
      mask: [
        'input[type="password"]',
        'input[type="email"]',
        'input[autocomplete="name"]',
        'input[autocomplete="given-name"]',
        'input[autocomplete="family-name"]',
        '.sentry-mask',
        '[data-sentry-mask]'
      ]
    }),
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: 'trace'
});
