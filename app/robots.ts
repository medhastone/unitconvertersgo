import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Googlebot-Image", "Google-Favicon"],
        allow: [
          "/",
          "/_next/image",
          "/_next/static/",
          "/favicon.ico",
          "/favicon-16x16.png",
          "/favicon-32x32.png",
          "/favicon-48x48.png",
          "/favicon-96x96.png",
          "/favicon-144x144.png",
          "/apple-touch-icon.png",
          "/icon-192.png",
          "/icon-512.png",
          "/icon.webp",
          "/logo.png",
          "/logo.webp",
          "/manifest.webmanifest",
        ],
      },
      {
        userAgent: "*",
        allow: [
          "/",
          "/_next/image",
          "/_next/static/",
          "/favicon.ico",
          "/favicon-16x16.png",
          "/favicon-32x32.png",
          "/favicon-48x48.png",
          "/favicon-96x96.png",
          "/favicon-144x144.png",
          "/apple-touch-icon.png",
          "/icon-192.png",
          "/icon-512.png",
          "/icon.webp",
          "/logo.webp",
          "/logo.png",
          "/manifest.webmanifest",
        ],
        disallow: [
          "/search?*",
          "/embed/",
          "/*?value=*",
          "/*?val=*",
          "/*?q=*",
          "/*?search=*",
          "/*?filter=*",
          "/*?sort=*",
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.baseUrl}/sitemap.xml`,
  };
}


