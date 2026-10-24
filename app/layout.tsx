import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/config";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  title: {
    default: "UnitConvertersGo — Universal Unit Converter",
    template: "%s | UnitConvertersGo",
  },
  description:
    "Fast, accurate unit conversion platform calculating length, mass, temperature, volume, digital storage, and 78 measurement categories in real time.",
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
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.webp", sizes: "512x512", type: "image/webp" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.baseUrl,
    siteName: SITE_CONFIG.name,
    title: "UnitConvertersGo — Universal Unit Converter",
    description:
      "Fast, accurate unit conversion platform calculating length, mass, temperature, volume, digital storage, and 78 measurement categories in real time.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "UnitConvertersGo — Universal Unit Converter",
    description:
      "Fast, accurate unit conversion platform calculating length, mass, temperature, volume, digital storage, and 78 measurement categories in real time.",
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

  try {
    var extAttrs = [
      'bis_skin_checked',
      'bis_register',
      'bis_id',
      'data-new-gr-c-s-check-loaded',
      'data-gr-ext-installed',
      'cz-shortcut-listen',
      'data-lt-installed',
      'fdprocessedid'
    ];
    function isExtAttr(name) {
      if (!name) return false;
      var lower = name.toLowerCase();
      return (
        extAttrs.indexOf(lower) !== -1 ||
        lower.indexOf('bis_') === 0 ||
        lower.indexOf('__bis_') === 0 ||
        lower.indexOf('data-gr-') === 0 ||
        lower.indexOf('data-new-gr-') === 0 ||
        lower.indexOf('data-lt-') === 0 ||
        lower.indexOf('data-darkreader-') === 0
      );
    }
    var attrDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'attributes');
    if (attrDesc && attrDesc.get) {
      var origAttrGet = attrDesc.get;
      Object.defineProperty(Element.prototype, 'attributes', {
        configurable: true,
        enumerable: true,
        get: function() {
          var map = origAttrGet.call(this);
          if (map && map.length) {
            for (var i = map.length - 1; i >= 0; i--) {
              var item = map[i];
              if (item && isExtAttr(item.name)) {
                this.removeAttribute(item.name);
              }
            }
          }
          return map;
        }
      });
    }
  } catch (e) {}

  try {
    function isHydrationAttrNoise(args) {
      for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        var str = typeof arg === 'string' ? arg : (arg && typeof arg.message === 'string' ? arg.message : '');
        if (str && (
          str.indexOf("A tree hydrated but some attributes of the server rendered HTML didn't match") !== -1 ||
          str.indexOf("https://react.dev/link/hydration-mismatch") !== -1
        )) {
          return true;
        }
      }
      return false;
    }
    function wrapErrorFn(fn) {
      if (typeof fn !== 'function' || fn.__ucgWrapped) return fn;
      var wrapped = function() {
        if (isHydrationAttrNoise(arguments)) return;
        return fn.apply(this, arguments);
      };
      wrapped.__ucgWrapped = true;
      return wrapped;
    }
    var currentError = wrapErrorFn(console.error.bind(console));
    Object.defineProperty(console, 'error', {
      configurable: true,
      enumerable: true,
      get: function() { return currentError; },
      set: function(newFn) { currentError = wrapErrorFn(newFn); }
    });
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
        image: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.baseUrl}/icon-512.png`,
          contentUrl: `${SITE_CONFIG.baseUrl}/icon-512.png`,
          width: 512,
          height: 512,
        },
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
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0D9488] focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
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
      </body>
    </html>
  );
}
