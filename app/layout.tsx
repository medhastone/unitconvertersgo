import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/config";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  title: {
    default: "UnitConvertersGo — High-Precision Universal Unit Converter (UnitConvertersGo.com)",
    template: "%s | UnitConvertersGo",
  },
  description:
    "Fast, accurate, mobile-first unit conversion platform calculating length, mass, temperature, volume, digital storage, and 25 measurement categories in real time.",
  keywords: [
    "unit converter",
    "unitconvertersgo",
    "unitconvertersgo.com",
    "cm to inches",
    "kg to lbs",
    "celsius to fahrenheit",
    "metric to imperial",
    "measurement calculator",
    "online converter",
  ],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_CONFIG.baseUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.webp", type: "image/webp" },
      { url: "/favicon-48x48.webp", sizes: "48x48", type: "image/webp" },
      { url: "/favicon-32x32.webp", sizes: "32x32", type: "image/webp" },
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.webp", "/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.baseUrl,
    siteName: SITE_CONFIG.name,
    title: "UnitConvertersGo — High-Precision Universal Unit Converter",
    description:
      "Fast, accurate unit conversion platform calculating length, mass, temperature, digital storage, and 25 categories in real time.",
    images: [
      {
        url: "/logo.webp",
        width: 2100,
        height: 360,
        alt: "UnitConvertersGo Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UnitConvertersGo — High-Precision Universal Unit Converter",
    description:
      "Fast, accurate unit conversion platform calculating length, mass, temperature, digital storage, and 25 categories in real time.",
    images: ["/logo.webp"],
  },
};

const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('ucg-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved === 'dark' || (!saved && prefersDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_CONFIG.baseUrl}/#webapp`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        description: SITE_CONFIG.description,
        image: `${SITE_CONFIG.baseUrl}/favicon.webp`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.baseUrl}/#organization`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.baseUrl}/logo.webp`,
          width: 2100,
          height: 360,
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} scroll-smooth`}
    >
      <head>
        {/* Favicon links in WebP & ICO formats conforming to Google Search index guidelines */}
        <link rel="icon" type="image/webp" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="48x48" href="/favicon-48x48.webp" />
        <link rel="icon" type="image/webp" sizes="32x32" href="/favicon-32x32.webp" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans antialiased flex flex-col transition-colors duration-150"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0D9488] focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
