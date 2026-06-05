/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wf-black': '#0a0a0a',
        'wf-ivory': '#f5f0e8',
        'wf-cream': '#faf7f2',
        'wf-gold': '#c9a962',
        'wf-gold-light': '#d4b978',
        'wf-gray': '#1a1a1a',
        'wf-gray-light': '#2a2a2a',
        'wf-gray-dark': '#0d0d0d',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}