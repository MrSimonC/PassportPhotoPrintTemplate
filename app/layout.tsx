import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Passport Photo Print Template",
  description: "Photo template to print off a passport photo by uploading it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
