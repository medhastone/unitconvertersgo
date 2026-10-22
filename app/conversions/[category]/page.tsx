import { notFound, permanentRedirect } from "next/navigation";
import { resolveCategoryIdFromUrlSlug, getCategoryUrl } from "@/lib/conversions/url";

interface LegacyConversionsCategoryRouteProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Permanently redirects legacy /conversions/[category] URLs to the canonical
 * clean top-level category hub URL (e.g., /conversions/length -> /length,
 * /conversions/mass -> /weight-and-mass, /conversions/digital_storage -> /data-storage).
 */
export default async function LegacyConversionsCategoryRedirectPage({
  params,
}: LegacyConversionsCategoryRouteProps) {
  const { category } = await params;
  const lower = decodeURIComponent(category).trim().toLowerCase();

  if (lower === "case-converter" || lower === "case_converter" || lower === "case") {
    permanentRedirect("/case-converter");
  }

  const resolvedCategoryId = resolveCategoryIdFromUrlSlug(lower);
  if (resolvedCategoryId) {
    permanentRedirect(getCategoryUrl(resolvedCategoryId));
  }

  notFound();
}
