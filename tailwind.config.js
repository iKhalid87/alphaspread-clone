/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Custom Color Palette for AlphaSpread
      colors: {
        primary: '#1A202C', // Dark background or main text color
        secondary: '#2D3748', // Slightly lighter dark for cards/sections
        accent: {
          DEFAULT: '#4299E1', // A general accent color (e.g., for buttons, links)
          positive: '#48BB78', // Green for positive changes/growth
          negative: '#E53E3E', // Red for negative changes/decline
        },
        gray: {
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
        white: '#FFFFFF',
      },
      // Custom Font Family
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Sets Inter as the default sans-serif font
        // You could add another font here, e.g., serif: ['Merriweather', 'serif'],
      },
      // Custom Spacing (optional, extend as needed)
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      // Custom Box Shadow (optional, for more nuanced shadows)
      boxShadow: {
        'custom-light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // If you need to style forms
    // require('@tailwindcss/typography'), // If you have rich text content
    // require('@tailwindcss/aspect-ratio'), // For responsive aspect ratios
  ],
}
