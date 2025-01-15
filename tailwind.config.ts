import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const tailwindConfig: Config = {
  content: ['./app/**/*.{ts,tsx,mdx,mdx}', './components/**/*.{ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        mono: ['var(--font-BerkeleyMono)', ...defaultTheme.fontFamily.mono],
      },
    },
  },
};

export default tailwindConfig;
