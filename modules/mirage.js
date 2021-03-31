import path from 'path'

export default function MirageJsModule() {
  if (process.env.USE_MIRAGE || this.options.dev) {
    // eslint-disable-next-line no-console
    console.log('🌍 Installing Mirage')
    this.addPlugin(path.resolve(__dirname, '../plugins/mirage.js'))
  }
}
