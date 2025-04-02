import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "../contexts/WalletContext";
import { RLNUnifiedProvider } from "../contexts/RLNUnifiedContext2";
import { RLNImplementationProvider } from "../contexts/RLNImplementationContext";
import { KeystoreProvider } from "../contexts/KeystoreContext";
import { Header } from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <RLNImplementationProvider>
            <KeystoreProvider>
              <RLNUnifiedProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                </div>
              </RLNUnifiedProvider>
            </KeystoreProvider>
          </RLNImplementationProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
