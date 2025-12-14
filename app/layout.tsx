import type { Metadata } from "next";
import { Space_Grotesk, Raleway } from "next/font/google";
import "./globals.css";
import { GameProvider } from "./contexts/GameContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { Toaster } from "react-hot-toast";
import WalletButton from "@/components/WalletButton";
import TransactionNotification from "@/components/TransactionNotification";
import {
  ErrorBoundary,
  BlockchainErrorBoundary,
} from "@/components/ErrorBoundary";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "JETEEAH",
  description: "A mobile-first snake game UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${raleway.variable} flex justify-center items-center min-h-screen bg-[#1E293B] text-white`}
      >
        <ErrorBoundary>
          <SocketProvider>
            <GameProvider>
              <BlockchainErrorBoundary>
                <WalletButton />
                <TransactionNotification />
              </BlockchainErrorBoundary>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1E293B',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <div className="w-[395px] max-w-full h-screen  shadow-lg overflow-hidden font-sans">
                {children}
              </div>
            </GameProvider>
          </SocketProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
