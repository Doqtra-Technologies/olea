import type { Metadata } from "next";
import { DM_Mono, Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Olea Social | Modern Eastern Mediterranean dining in Covent Garden",
    template: "%s | Olea Social",
  },
  description:
    "Olea Social brings the flavours of Turkey, Greece, Spain, Italy and Morocco together on Upper St Martin's Lane, Covent Garden. Restaurant and bar made for sharing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${manrope.variable} ${dmMono.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
