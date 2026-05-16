/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mdg: {
          navy: '#0A192F',     // Deep, rich professional navy
          blue: '#0070F3',     // Vibrant "Action" blue (like Vercel/Next)
          lime: '#D9F99D',     // Accent for highlights
          slate: '#475569',    // For secondary text
          light: '#F8FAFC',    // Subtle background
        }
      },
      fontFamily: {
        // We want a high-end "Inter" or "Lexend" feel
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}