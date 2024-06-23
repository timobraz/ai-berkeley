import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "green-dots": "url('https://i.ibb.co/fdy1mbD/Group-4.jpg')",
        dots2: "url('/dots2.png')",
        dots3: "url('/dots3.png')",
        dots4: "url('/dots4.png')",
        dots5: "url('/dots5.png')",
      },
      borderWidth: {
        "3": "3px",
      },
      fontFamily: {
        satoshi: ["var(--font-satoshi)"],
      },
    },
  },
  plugins: [],
};
export default config;
