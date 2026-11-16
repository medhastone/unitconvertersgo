import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import HawkFlyby from "@/components/HawkFlyby";
import { SITE_CONFIG } from "@/lib/config";
import { DEFAULT_OG_IMAGE, SHARED_FAVICON_ICONS } from "@/lib/seo";

const GA_MEASUREMENT_ID = "G-36PCW5PDH6";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  title: {
    default: SITE_CONFIG.homepageTitle,
    template: "%s | UnitConvertersGo",
  },
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  manifest: "/manifest.webmanifest",
  icons: SHARED_FAVICON_ICONS,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_CONFIG.baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.baseUrl,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.homepageTitle,
    description: SITE_CONFIG.description,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.homepageTitle,
    description: SITE_CONFIG.description,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

if (typeof Object !== "undefined" && !("suppressHydrationWarning" in Object.prototype)) {
  try {
    Object.defineProperty(Object.prototype, "suppressHydrationWarning", {
      value: true,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  } catch {}
}

const themeInitScript = `
(function() {
  try {
    Object.defineProperty(Object.prototype, 'suppressHydrationWarning', {
      value: true,
      enumerable: false,
      configurable: true,
      writable: true
    });
  } catch (e) {}

  try {
    var saved = localStorage.getItem('ucg-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved === 'dark' || (!saved && prefersDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

const gaConsentInitScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied'
});
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
(function() {
  var loaded = false;
  function loadDeferredAssets() {
    if (loaded) return;
    loaded = true;
    var events = ['scroll', 'pointerdown', 'touchstart', 'keydown'];
    for (var i = 0; i < events.length; i++) {
      window.removeEventListener(events[i], loadDeferredAssets);
    }
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLink);

    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
    document.head.appendChild(gaScript);
  }
  var events = ['scroll', 'pointerdown', 'touchstart', 'keydown'];
  for (var i = 0; i < events.length; i++) {
    window.addEventListener(events[i], loadDeferredAssets, { passive: true, once: true });
  }
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
        "@type": "Organization",
        "@id": `${SITE_CONFIG.baseUrl}/#organization`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_CONFIG.baseUrl}/#logo`,
          url: `${SITE_CONFIG.baseUrl}/logo.png`,
          contentUrl: `${SITE_CONFIG.baseUrl}/logo.png`,
          width: 2092,
          height: 345,
          caption: SITE_CONFIG.name,
        },
        image: [
          `${SITE_CONFIG.baseUrl}/icon-512.png`,
          `${SITE_CONFIG.baseUrl}/icon-192.png`,
          `${SITE_CONFIG.baseUrl}/favicon-144x144.png`,
          `${SITE_CONFIG.baseUrl}/favicon-96x96.png`,
          `${SITE_CONFIG.baseUrl}/favicon-48x48.png`,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.baseUrl}/#website`,
        url: SITE_CONFIG.baseUrl,
        name: SITE_CONFIG.name,
        publisher: {
          "@id": `${SITE_CONFIG.baseUrl}/#organization`,
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_CONFIG.baseUrl}/#webapp`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.baseUrl,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        description: SITE_CONFIG.description,
        image: `${SITE_CONFIG.baseUrl}/icon-512.png`,
        publisher: {
          "@id": `${SITE_CONFIG.baseUrl}/#organization`,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: gaConsentInitScript }}
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans antialiased flex flex-col transition-colors duration-150"
      >
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0F766E] focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          suppressHydrationWarning
          className="flex-1 focus:outline-hidden"
        >
          {children}
        </main>
        <Footer />
        <HawkFlyby />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
