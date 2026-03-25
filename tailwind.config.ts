import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["DM Sans", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0a7c4d",
          light:   "#0d9e62",
          dark:    "#065d38",
          50:      "#f0f9f4",
          100:     "#d6f0e4",
        },
        accent: {
          DEFAULT: "#00b4d8",
          dark:    "#0096b5",
          light:   "#90e0ef",
        },
        background:         "var(--bg)",
        foreground:         "var(--fg)",
        card:               "var(--card-bg)",
        border:             "var(--border)",
        muted:              "var(--muted)",
        "muted-foreground": "var(--muted-fg)",
        destructive:        "#ef4444",
      },
      borderRadius: {
        xl:    "1.25rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;