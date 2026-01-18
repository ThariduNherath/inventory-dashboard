import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Inventory Pro",
  description: "Modern Inventory Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // StackProvider එක html tag එකටත් උඩින් තැබීම වඩාත් ආරක්ෂිතයි
    <StackProvider app={stackClientApp}>
      <html lang="en">
        <body
          className={`${poppins.variable} antialiased`}
          style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
        >
          <StackTheme>
            {children}
          </StackTheme>
        </body>
      </html>
    </StackProvider>
  );
}