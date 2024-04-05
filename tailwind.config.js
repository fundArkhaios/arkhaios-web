/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Custom two-column layout where the first column is 1/4 and the second is 3/4
        'custom-two-col': '1fr 3fr',
      },
    },
  },
  daisyui: {
    themes: [
      {
        customBlackTheme: {
          "primary": "#e5e7eb",
          "secondary": "#fbcfe8",
          "accent": "#78716c",
          "neutral": "#121000",
          "base-100": "#141416",
          "info": "#312e81",
          "success": "#34d399",
          "warning": "#fde047",
          "error": "#f43f5e",

          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
        },
      },
    ],
  },
  fontFamily: {
    josefin: ["Josefin Sans", "sans-serif"],
  },
  plugins: [require("daisyui")],
};
