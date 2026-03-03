/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        brand: {
          emerald: '#10B981',
          'light-emerald': '#ECFDF5',
          amber: '#F59E0B',
          midnight: '#0F172A',
          dark: '#1E293B',
          surface: '#F8FAFC',
          indigo: '#4F46E5', // Keep temporarily for compatibility
          pink: '#E91E63',   // Keep temporarily for compatibility
          'dark-blue': '#0F172A', // Map to midnight
        }
      },
    },
  },
  plugins: [],
}

