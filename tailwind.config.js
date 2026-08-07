/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FDFBF7',
          100: '#F7F1E5',
          200: '#EADBC8',
          300: '#DAC0A3',
          400: '#C89D7C',
          500: '#A06B49',
          600: '#874D29',
          700: '#6B391A',
          800: '#4A2511',
          900: '#2D1509',
          950: '#1A0B04',
        },
        amber: {
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
        },
        espresso: {
          light: '#3C2A21',
          DEFAULT: '#1A120B',
          dark: '#0F0906',
        },
        card: {
          light: 'rgba(255, 255, 255, 0.85)',
          dark: 'rgba(30, 24, 20, 0.85)',
        }
      },
      fontFamily: {
        sans: ['Kantumruy Pro', 'Battambang', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'coffee': '0 10px 25px -5px rgba(135, 77, 41, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulseSlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
    },
  },
  plugins: [],
};
