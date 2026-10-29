/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090d16',
        surface: '#111827',
        'surface-card': '#1a2234',
        'surface-border': '#2a364f',
        primary: '#3b82f6',
        accent: '#8b5cf6',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        cyber: '#06b6d4',
      },
    },
  },
  plugins: [],
};
