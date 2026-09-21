/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Government Portal Color System
        gov: {
          blue: '#00599F',       // Primary Government Blue
          dark: '#033392',       // Secondary Dark Blue
          surface: '#F1F3FA',    // Surface Light Blue-Gray
          lightblue: '#DBEFFD',  // Very Light Blue (Footer & Badges)
          border: '#E3EAF7',     // Standard Border
          accent: '#A3D6FF',     // Light Blue Accent
          orange: '#F47317',     // Accent Orange (Used strictly as accent)
          textPrimary: '#1A1A1A',
          textSecondary: '#464747',
          green: '#107C41'
        },
        flag: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          navy: '#00599F'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '"Segoe UI"',
          'Roboto',
          'Arial',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        marathi: [
          '"Noto Sans Devanagari"',
          '"Mukta"',
          'sans-serif'
        ]
      },
      boxShadow: {
        portal: '0 2px 10px rgba(0, 0, 0, 0.06)',
        'portal-hover': '0 4px 16px rgba(0, 0, 0, 0.10)',
        'portal-card': '0 1px 4px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 89, 159, 0.04)'
      },
      maxWidth: {
        portal: '1440px'
      }
    }
  },
  plugins: []
};
