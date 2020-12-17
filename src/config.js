/**
 * CAUTION: You shouldn't need to directly edit this file!
 * Please see https://cli.vuejs.org/guide/mode-and-env.html#environment-variables for details on configuring via environment variables
 *
 * This file is a wrapper around the .env file (located at the base of the project) to provide reasonable defaults in the case of the .env file not existing, or certain properties being excluded
 */

export default {
  application: {
    name: process.env.VUE_APP_NAME ?? 'uobtheatre',
  },
  api: {
    endpoint:
      process.env.VUE_APP_API_BASE && process.env.VUE_APP_API_BASE != ''
        ? process.env.VUE_APP_API_BASE
        : '/api',
  },
  auth: {
    cookie: 'uobtheatre-auth',
  },
};
