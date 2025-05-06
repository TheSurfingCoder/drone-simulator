/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ← This tells Tailwind to scan your app code!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
