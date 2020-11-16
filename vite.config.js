import path from 'path'

let config = {
  alias: {
    '/src/': path.resolve(__dirname, './src'),
  },
  exclude: ['cosha'],
}

export default config
