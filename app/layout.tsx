import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Passport Photo Print Template - Create 6x4 Print-Ready Photos",
  description: "Transform one photo into a ready-to-print 6x4 sheet with six passport-sized photos. Completely free, private, and secure. No uploads, no logs, nothing saved. Perfect for passport applications and ID photos.",
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
