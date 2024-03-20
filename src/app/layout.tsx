import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "./footer";
import { ThemeProvider } from "./dashboard/_components/theme-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Drive",
  description: "File Drive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <ConvexClientProvider>
            <Toaster />
            <Header />
            {children}
            <Footer />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}