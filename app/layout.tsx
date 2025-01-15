import './global.css';
import type { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import LocalFont from 'next/font/local';
import Home from '../components/Home';
import { WindowContextProvider } from '../components/WindowContext';
import { getAllPostsMetadata } from 'lib/api';

const BerkeleyMono = LocalFont({
  src: './TX-02-Variable.woff2',
  variable: '--font-BerkeleyMono',
});

export const metadata: Metadata = {
  formatDetection: {
    address: false,
    date: false,
    email: false,
    telephone: false,
  },
  title: {
    default: 'Theo Pak Homepage',
    template: '%s — Theo Pak',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  initialScale: 1,
  maximumScale: 1,
  themeColor: 'black',
  userScalable: false,
  width: 'device-width',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const posts = await getAllPostsMetadata();
  return (
    <html
      className={`bg-black text-neutral-100 antialiased ${BerkeleyMono.variable}`}
      lang="en"
    >
      <body className="p-4 font-mono text-sm md:h-screen md:overflow-hidden">
        <WindowContextProvider>
          <Home posts={posts} />
          {children}
        </WindowContextProvider>
      </body>
    </html>
  );
}
