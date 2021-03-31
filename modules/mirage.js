import path from 'path'

export default function MirageJsModule() {
  if (process.env.USE_MIRAGE || this.options.dev) {
    console.log('🌍 Installing Mirage')
    this.addPlugin(path.resolve(__dirname, '../plugins/mirage.js'))
  }
}
