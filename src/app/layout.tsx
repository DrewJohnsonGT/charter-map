import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '~/app/providers';
import { AppContextProvider } from '~/context/useContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'Map of experiences with Relentless Charters',
  title: 'Relentless Charters Map',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.css"
          type="text/css"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <AppContextProvider>{children}</AppContextProvider>
        </Providers>
      </body>
    </html>
  );
}
