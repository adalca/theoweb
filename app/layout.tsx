import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://theos-clubhouse.openai.site"),
  title: {
    default: "Theo's Clubhouse",
    template: "%s · Theo's Clubhouse",
  },
  description: "A cheerful, kid-friendly home for World Cup, EURO, and Copa América soccer scores.",
  openGraph: {
    title: "Theo's Clubhouse · Soccer Scores",
    description: "Explore every World Cup, EURO, and Copa América match.",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Theo's Clubhouse soccer scores" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theo's Clubhouse · Soccer Scores",
    description: "Explore every World Cup, EURO, and Copa América match.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
