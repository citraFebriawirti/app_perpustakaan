import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import NextAuthSessionProvider from "@/providers/next-auth-session-provider";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

export const metadata: Metadata = {
  title: "Library Management System",
  description: "A comprehensive library management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <NextAuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
