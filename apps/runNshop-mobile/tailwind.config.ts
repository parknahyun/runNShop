import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4D00',
        secondary: '#1A1A1A',
        success: '#00C853',
        warning: '#FF9800',
        error: '#F44336',
      },
    },
  },
  plugins: [],
}
export default config
