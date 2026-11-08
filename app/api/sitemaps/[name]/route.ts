import { NextResponse } from "next/server";
import {
  buildChildSitemapXml,
  getAllChildSitemapNames,
} from "@/lib/sitemap-builder";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllChildSitemapNames().map((name) => ({ name }));
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;
  const cleanName = name.replace(/\.xml$/i, "");
  const xml = buildChildSitemapXml(cleanName);

  if (!xml) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
