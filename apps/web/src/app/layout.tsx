import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CSE DIU Alumni',
    template: '%s | CSE DIU Alumni',
  },
  description:
    'The official alumni platform for the Department of Computer Science & Engineering, Dhaka International University.',
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
