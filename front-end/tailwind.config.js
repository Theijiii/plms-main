module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: [
          "Montserrat",
          "Segoe UI",
          "Arial",
          "Helvetica Neue",
          "sans-serif",
        ],
        poppins: [
          "Poppins",
          "Segoe UI",
          "Arial",
          "Helvetica Neue",
          "sans-serif",
        ],
      },

      colors: {
        primary: '#4CAF50',
        secondary: '#4A90E2',
        accent: '#FDA811',
        background: '#FBFBFB',
      },

      // 🖼️ Add your custom background here
      backgroundImage: {
        'user-bg': "url('/BG.jpg')",
      },
    },
  },
  plugins: [],
};
