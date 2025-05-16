/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#374151', // dark gray-blue
          light: '#4B5563',   // lighter gray-blue
          dark: '#1F2937',    // darker gray-blue
        },
        secondary: {
          DEFAULT: '#6B7280', // muted gray
          light: '#9CA3AF',   // lighter muted gray
          dark: '#4B5563',    // darker muted gray
        },
        accent: {
          DEFAULT: '#2563EB', // muted blue
          light: '#3B82F6',   // lighter blue
          dark: '#1E40AF',    // darker blue
        },
        error: {
          DEFAULT: '#B91C1C', // muted red
          light: '#EF4444',   // lighter red
          dark: '#7F1D1D',    // darker red
        },
        success: {
          DEFAULT: '#15803D', // muted green
          light: '#22C55E',   // lighter green
          dark: '#14532D',    // darker green
        }
      }
    }
  },
  plugins: [],
}
