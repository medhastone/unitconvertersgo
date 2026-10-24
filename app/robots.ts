import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Googlebot-Image", "Google-Favicon"],
        allow: ["/", "/_next/image", "/_next/static/", "/favicon.ico", "/logo.png", "/logo.webp", "/icon.webp"],
      },
      {
        userAgent: "*",
        allow: [
          "/",
          "/_next/image",
          "/_next/static/",
          "/favicon.ico",
          "/favicon-48x48.png",
          "/favicon-96x96.png",
          "/favicon-144x144.png",
          "/apple-touch-icon.png",
          "/icon-192.png",
          "/icon-512.png",
          "/icon.webp",
          "/logo.webp",
          "/logo.png",
        ],
        disallow: [
          "/search?*",
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


