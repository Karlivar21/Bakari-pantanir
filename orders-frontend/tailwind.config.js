// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust the paths as per your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'serif'],
      },
      keyframes: {
        'slide-down': {
          '0%': { transform: 'translate(-50%, -100%)', opacity: 0 },
          '100%': { transform: 'translate(-50%, 0)', opacity: 1 },
        }
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out',
      }
    },
  },
  plugins: [],
};
