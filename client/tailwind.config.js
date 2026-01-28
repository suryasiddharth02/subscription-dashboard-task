// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Add this line
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
        },
        backgroundColor: {
          dark: {
            primary: '#1a202c',
            secondary: '#2d3748',
            tertiary: '#4a5568',
          }
        },
        textColor: {
          dark: {
            primary: '#f7fafc',
            secondary: '#e2e8f0',
            muted: '#a0aec0',
          }
        }
      },
    },
    plugins: [],
  }