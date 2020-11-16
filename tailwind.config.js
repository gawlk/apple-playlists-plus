const defaultConfig = require('tailwindcss/defaultConfig')
// const defaultTheme = require('tailwindcss/defaultTheme')
const tailwindUI = require('@tailwindcss/ui')

module.exports = {
  purge: {
    mode: 'all',
    content: [
      './index.html',
      './src/**/*.html',
      './src/**/*.js',
      './src/**/*.jsx',
      './src/**/*.svelte',
      './src/**/*.ts',
      './src/**/*.tsx',
      './src/**/*.vue',
    ],
  },
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  experimental: 'all',
  theme: {
    screens: {
      xs: '420px',
      ...defaultConfig.theme.screens,
    },
  },
  plugins: [tailwindUI({})],
}
