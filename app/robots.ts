import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/_next/image", "/_next/static/"],
      disallow: ["/*?*"],
    },
    sitemap: `${SITE_CONFIG.baseUrl}/sitemap.xml`,
  };
}

