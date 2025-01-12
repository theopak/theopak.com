import type { Config } from 'tailwindcss';

const tailwindConfig: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        mono: ['var(--font-BerkeleyMono)'],
      },
    },
  },
};

export default tailwindConfig;
