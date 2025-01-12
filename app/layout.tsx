import './global.css';
import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import LocalFont from 'next/font/local';
import Home from '../components/Home';
import { WindowContextProvider } from '../components/WindowContext';
import { getAllPostsMetadata } from 'lib/api';

const BerkeleyMono = LocalFont({
  src: './TX-02-Variable.woff2',
  variable: '--font-BerkeleyMono',
});

export const metadata: Metadata = {
  title: {
    default: 'Theo Pak Homepage',
    template: '%s — Theo Pak',
  },
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
