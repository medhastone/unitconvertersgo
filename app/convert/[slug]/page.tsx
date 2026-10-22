import { notFound, permanentRedirect } from "next/navigation";
import { getConversionPair } from "@/lib/conversions/catalogue";
import { getPairUrl } from "@/lib/conversions/url";

interface LegacyConvertPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Legacy /convert/[slug] route — permanently redirects all unit-pair URLs
 * to the canonical hierarchical competitor-style URL: /[category]/[slug].htm
 * (e.g., /convert/cm-to-inches -> /length/cm-to-inches.htm)
 */
export default async function LegacyConvertRedirectPage({
  params,
}: LegacyConvertPageProps) {
  const { slug } = await params;
  const pair = getConversionPair(slug);

  if (!pair) {
    notFound();
  }

  permanentRedirect(getPairUrl(pair));
}
