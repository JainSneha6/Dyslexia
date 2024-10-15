/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        crazyCardAnimation: 'crazyCardAnimation 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) both',
      },
      keyframes: {
        crazyCardAnimation: {
          '0%': {
            opacity: 0,
            transform: 'rotateY(90deg) translateY(100%)',
          },
          '50%': {
            opacity: 0.5,
            transform: 'rotateY(45deg) translateY(-20%)',
          },
          '100%': {
            opacity: 1,
            transform: 'rotateY(0) translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}