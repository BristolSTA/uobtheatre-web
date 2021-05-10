export default (context) => {
  if (!process.env.APP_API_BASE) {
    const { makeServer } = require('@/fakeApi')
    makeServer({ environment: 'development' })
  }
}
