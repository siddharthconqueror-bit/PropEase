/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3B4FCD',
          dark: '#2A3BAA',
          light: '#EEF2FF',
        },
        teal: {
          accent: '#0EA5A0',
        },
        amber: {
          accent: '#F59E0B',
        },
        status: {
          success: '#10B981',
          error: '#EF4444',
          info: '#3B82F6',
          warning: '#F59E0B',
        },
        light: {
          bg: '#F8F9FC',
          surface: '#FFFFFF',
          'surface-2': '#F3F4F6',
          text: '#111827',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          border: '#E5E7EB',
          'border-subtle': '#D1D5DB',
        },
        dark: {
          bg: '#0F1117',
          surface: '#1A1D27',
          'surface-2': '#23262F',
          text: '#F1F5F9',
          secondary: '#9CA3AF',
          border: '#2D3143',
          'border-subtle': '#3A3F52',
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'pop': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'sheet': '0 -10px 25px -5px rgba(0, 0, 0, 0.1)',
        'glass': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '4px': '4px',
        '8px': '8px',
        '12px': '12px',
        '16px': '16px',
        '24px': '24px',
      }
    },
  },
  plugins: [],
}
