import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import {  WalletProvider, RLNImplementationProvider, KeystoreProvider, RLNProvider } from "../contexts/index";
import { Header } from "../components/Header";
import { AppStateProvider } from "../contexts/AppStateContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waku Keystore Management",
  description: "Manage your Waku RLN keystores securely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <AppStateProvider>
          <WalletProvider>
            <RLNImplementationProvider>
              <KeystoreProvider>
                <RLNProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                      {children}
                    </main>
                  </div>
                </RLNProvider>
              </KeystoreProvider>
            </RLNImplementationProvider>
          </WalletProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}