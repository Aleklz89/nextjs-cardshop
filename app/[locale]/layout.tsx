import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Providers } from './providers'
import './globals.css'

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };

}
export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {

  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      
      <body>
      <Providers>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}