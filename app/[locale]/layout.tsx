import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from './context/ThemeContext';

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
    <html lang={locale}>
      <body style={{ margin: '0' }}>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}