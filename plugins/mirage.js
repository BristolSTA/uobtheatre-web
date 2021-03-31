export default (context) => {
  if (context.isDev) {
    if (!process.env.APP_API_BASE) {
      const { makeServer } = require('@/fakeApi')
      makeServer({ environment: 'development' })
    }
  }
}
