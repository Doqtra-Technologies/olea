import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { brand } from "@/lib/brand";
import "./globals.css";

// Brand typefaces (2026 identity). Clever Medium for headlines, Documan Light and Medium for everything else.
// Each file covers a weight range, so the browser never fakes a weight the brand doesn't have.
const clever = localFont({
  src: "./fonts/Clever-Medium.woff2",
  variable: "--font-clever",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  // The supplied Clever file has no à, é, ç, ö, ü and the like (U+00C0–00FF), and fakes them badly from
  // combining marks. Leaving those ranges out hands such letters to the fallback serif, which draws them properly.
  declarations: [{ prop: "unicode-range", value: "U+0000-00BF, U+0100-02FF, U+0370-10FFFF" }],
});

const documan = localFont({
  src: [
    { path: "./fonts/Documan-Light.woff2", weight: "100 400" },
    { path: "./fonts/Documan-Medium.woff2", weight: "500 900" },
  ],
  variable: "--font-documan",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.oleasocial.co.uk"),
  title: {
    default: "Olea Social | Modern Eastern Mediterranean dining in Covent Garden",
    template: "%s | Olea Social",
  },
  description:
    "Olea Social brings the flavours of Turkey, Greece, Spain, Italy and Morocco together on Upper St Martin's Lane, Covent Garden. Restaurant and bar made for sharing.",
};

export const viewport: Viewport = {
  themeColor: brand.grove,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${clever.variable} ${documan.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
