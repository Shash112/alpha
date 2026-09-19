/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4FA',
          100: '#D9E3F1',
          500: '#3D5478',
          800: '#152445',
          900: '#0B1736',
        },
        brand: {
          50: '#EAF2FF',
          100: '#DBE8FE',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F4F7FB',
          bg: '#F7F9FC',
          border: '#E4EAF2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(11, 23, 54, 0.03), 0 1px 2px -1px rgba(11, 23, 54, 0.02)',
        'card-hover': '0 4px 12px -2px rgba(11, 23, 54, 0.05), 0 2px 4px -2px rgba(11, 23, 54, 0.03)',
        'dropdown': '0 10px 25px -5px rgba(11, 23, 54, 0.08), 0 8px 10px -6px rgba(11, 23, 54, 0.04)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      }
    },
  },
  plugins: [],
}
