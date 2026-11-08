import { NextResponse } from "next/server";
import { buildSitemapIndexXml } from "@/lib/sitemap-builder";

export const dynamic = "force-static";

export async function GET() {
  const xml = buildSitemapIndexXml();
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
