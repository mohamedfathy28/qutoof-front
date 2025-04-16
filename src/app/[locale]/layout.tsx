// "use client"
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "intl-tel-input/styles";
import { DirectionProvider } from "./_contexts/DirectionContext";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./_contexts/userContext";
import { WalletContextProvider } from "./_contexts/walletContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
// import { headers } from 'next/headers';
import { Locale, routing } from "../../i18n/routing";
import LayoutWrapper from "./LayoutWrapper";
import { ConfigrationsContextProvider } from "./_contexts/MainConfigContext";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });


  return (
    <html lang={locale} >
      <head />
      <body>
        <NextIntlClientProvider messages={messages}>
          <ConfigrationsContextProvider>
            <DirectionProvider>
              <UserProvider>
                <WalletContextProvider>
                  <LayoutWrapper>{children}</LayoutWrapper>
                </WalletContextProvider>
                <Toaster />
              </UserProvider>
            </DirectionProvider>
          </ConfigrationsContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
