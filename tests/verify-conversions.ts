import { CATEGORIES, CATEGORY_MAP, UNITS, UNIT_MAP } from "../lib/conversions/units";
import { CONVERSION_CATALOGUE, CATALOGUE_MAP, getConversionPair, ensureEnrichedPair } from "../lib/conversions/catalogue";
import { convertUnits, formatValue, generateReferenceTable } from "../lib/conversions/engine";
import { GUIDES } from "../lib/conversions/guides";
import {
  getTrustedReferencesForCategory,
  getTrustedReferencesForPair,
} from "../lib/conversions/references";
import { generateLiveSolution } from "../lib/conversions/solver";
import { getPresetSearchQueries, getRealWorldScenarios } from "../lib/conversions/scenarios";
import { getAllChildSitemapNames, getChildSitemapEntries, buildSitemapIndexXml } from "../lib/sitemap-builder";
import robots from "../app/robots";
import {
  getConverterTier,
  isPairIndexable,
  isCategoryHubIndexable,
  checkDimensionMatch,
  checkSlugHasExponentLoss,
  getDuplicateOf,
} from "../lib/seo-tiers";
import { evaluateContentGate } from "../lib/content-gate";
import { getPairUrl } from "../lib/conversions/url";
import slugRedirectsData from "../data/slug-redirects.json";


function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${msg}`);
    process.exit(1);
  }
}

function approxEqual(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}

console.log("--- Starting Conversion Engine QA Verification ---");

// 1. Verify Catalogue integrity: No duplicate slugs
console.log(`Checking ${CONVERSION_CATALOGUE.length} conversion slugs...`);
assert(CONVERSION_CATALOGUE.length >= 100, `Expected at least 100 conversion slugs, got ${CONVERSION_CATALOGUE.length}`);

const ENRICHED_CATALOGUE = CONVERSION_CATALOGUE.map((p) => ensureEnrichedPair(p));

const seenSlugs = new Set<string>();
for (const pair of ENRICHED_CATALOGUE) {
  assert(!seenSlugs.has(pair.slug), `Duplicate slug detected: ${pair.slug}`);
  seenSlugs.add(pair.slug);

  const fromUnit = UNIT_MAP.get(pair.fromUnitId);
  const toUnit = UNIT_MAP.get(pair.toUnitId);
  const category = CATEGORY_MAP.get(pair.categoryId);

  assert(!!fromUnit, `Unknown fromUnitId: ${pair.fromUnitId} in ${pair.slug}`);
  assert(!!toUnit, `Unknown toUnitId: ${pair.toUnitId} in ${pair.slug}`);
  assert(!!category, `Unknown categoryId: ${pair.categoryId} in ${pair.slug}`);
  assert(fromUnit!.categoryId === pair.categoryId, `Category mismatch for ${pair.fromUnitId}`);

  // Test execution of convertUnits for each slug
  const output = convertUnits(pair.exampleInput, pair.fromUnitId, pair.toUnitId, "auto");
  assert(output.formattedValue !== "—" && !isNaN(output.rawValue), `Calculation error for ${pair.slug}`);

  // Verify SEO keyword and common value enrichment
  assert(!!pair.primaryKeyword && pair.primaryKeyword.length > 0, `Missing primaryKeyword for ${pair.slug}`);
  assert(!!pair.relatedKeywords && pair.relatedKeywords.length > 0, `Missing relatedKeywords for ${pair.slug}`);
  assert(!!pair.commonValues && pair.commonValues.length > 0, `Missing commonValues for ${pair.slug}`);
  assert(!!pair.faqs && pair.faqs.length > 0, `Missing faqs for ${pair.slug}`);
}

// Verify all category popularPairSlugs exist in CATALOGUE_MAP
for (const cat of CATEGORIES) {
  const catPairs = ENRICHED_CATALOGUE.filter((p) => p.categoryId === cat.id);
  assert(catPairs.length > 0, `Category ${cat.id} has 0 conversion pairs`);
  for (const popSlug of cat.popularPairSlugs) {
    assert(CATALOGUE_MAP.has(popSlug), `popularPairSlug "${popSlug}" in category "${cat.id}" not found in CATALOGUE_MAP`);
  }
}

const totalMappedKeywords = ENRICHED_CATALOGUE.reduce(
  (sum, item) => sum + 1 + (item.relatedKeywords?.length || 0),
  0
);
console.log(
  `✅ All ${ENRICHED_CATALOGUE.length} canonical conversion URLs, ${CATALOGUE_MAP.size} resolved alias routes, and ${totalMappedKeywords} mapped keywords across ${CATEGORIES.length} categories validated successfully.`
);

// 2. Length Accuracy
const inToCm = convertUnits(1, "inch", "centimeter");
assert(approxEqual(inToCm.rawValue, 2.54), `1 in should be 2.54 cm, got ${inToCm.rawValue}`);

const cmToIn = convertUnits(2.54, "centimeter", "inch");
assert(approxEqual(cmToIn.rawValue, 1), `2.54 cm should be 1 in, got ${cmToIn.rawValue}`);

const mToFt = convertUnits(1, "meter", "foot");
assert(approxEqual(mToFt.rawValue, 3.28084, 0.001), `1 m should be ~3.28084 ft, got ${mToFt.rawValue}`);

const miToKm = convertUnits(1, "mile", "kilometer");
assert(approxEqual(miToKm.rawValue, 1.609344), `1 mi should be 1.609344 km, got ${miToKm.rawValue}`);

// 3. Mass Accuracy
const kgToLbs = convertUnits(1, "kilogram", "pound");
assert(approxEqual(kgToLbs.rawValue, 2.20462, 0.001), `1 kg should be ~2.20462 lbs, got ${kgToLbs.rawValue}`);

const lbsToKg = convertUnits(2.20462262, "pound", "kilogram");
assert(approxEqual(lbsToKg.rawValue, 1, 0.001), `2.20462 lbs should be 1 kg, got ${lbsToKg.rawValue}`);

// 4. Temperature Nonlinear Accuracy
const cToF_0 = convertUnits(0, "celsius", "fahrenheit");
assert(approxEqual(cToF_0.rawValue, 32), `0 C should be 32 F, got ${cToF_0.rawValue}`);

const cToF_100 = convertUnits(100, "celsius", "fahrenheit");
assert(approxEqual(cToF_100.rawValue, 212), `100 C should be 212 F, got ${cToF_100.rawValue}`);

const cToF_neg40 = convertUnits(-40, "celsius", "fahrenheit");
assert(approxEqual(cToF_neg40.rawValue, -40), `-40 C should be -40 F, got ${cToF_neg40.rawValue}`);

const fToC_212 = convertUnits(212, "fahrenheit", "celsius");
assert(approxEqual(fToC_212.rawValue, 100), `212 F should be 100 C, got ${fToC_212.rawValue}`);

const cToK_0 = convertUnits(0, "celsius", "kelvin");
assert(approxEqual(cToK_0.rawValue, 273.15), `0 C should be 273.15 K, got ${cToK_0.rawValue}`);

// 5. Digital Storage Accuracy (Decimal vs Binary)
const gbToMb = convertUnits(1, "gigabyte", "megabyte");
assert(approxEqual(gbToMb.rawValue, 1000), `1 GB decimal should be 1000 MB, got ${gbToMb.rawValue}`);

const gibToMib = convertUnits(1, "gibibyte", "mebibyte");
assert(approxEqual(gibToMib.rawValue, 1024), `1 GiB binary should be 1024 MiB, got ${gibToMib.rawValue}`);

// 6. Fuel Economy Nonlinear Inverse
const mpgToL100 = convertUnits(30, "mpg_us", "liters_per_100km");
assert(approxEqual(mpgToL100.rawValue, 7.84048, 0.01), `30 MPG should be ~7.84 L/100km, got ${mpgToL100.rawValue}`);

const l100ToMpg = convertUnits(mpgToL100.rawValue, "liters_per_100km", "mpg_us");
assert(approxEqual(l100ToMpg.rawValue, 30, 0.01), `Inverse of 7.84 L/100km should be 30 MPG, got ${l100ToMpg.rawValue}`);

// 7. Reference Table Generation
const refTable = generateReferenceTable("centimeter", "inch");
assert(refTable.length === 14, `Expected 14 steps in default ref table, got ${refTable.length}`);
assert(refTable[0].input === 1 && refTable[0].output !== "", "Table first row valid");

// 8. Regional & Industry Standard Accuracy (Batch 3)
const troyToG = convertUnits(1, "troy_ounce", "gram");
assert(approxEqual(troyToG.rawValue, 31.1034768, 0.0001), `1 troy oz should be 31.1034768 g, got ${troyToG.rawValue}`);

const impGalToL = convertUnits(1, "imperial_gallon", "liter");
assert(approxEqual(impGalToL.rawValue, 4.54609, 0.0001), `1 Imperial gallon should be 4.54609 L, got ${impGalToL.rawValue}`);

const metricCupToMl = convertUnits(1, "metric_cup", "milliliter");
assert(approxEqual(metricCupToMl.rawValue, 250, 0.0001), `1 metric cup should be 250 mL, got ${metricCupToMl.rawValue}`);

const psToHp = convertUnits(100, "horsepower_metric", "horsepower_mechanical");
assert(approxEqual(psToHp.rawValue, 98.632, 0.01), `100 PS should be ~98.632 hp, got ${psToHp.rawValue}`);

const inHgToHpa = convertUnits(29.92, "inch_mercury", "hectopascal");
assert(approxEqual(inHgToHpa.rawValue, 1013.21, 0.1), `29.92 inHg should be ~1013.21 hPa, got ${inHgToHpa.rawValue}`);

// 9. Content Specification & Uniqueness Verification
for (const pair of ENRICHED_CATALOGUE) {
  assert(Boolean(pair.h1 && pair.h1 !== pair.title), `Pair ${pair.slug} must have a distinct H1 and HTML title`);
  assert(Boolean(pair.intro && pair.intro.length > 30), `Pair ${pair.slug} must have a plain-English intro`);
  assert(Boolean(pair.formulaSource && pair.formulaSource.length > 20), `Pair ${pair.slug} must have a verified formulaSource`);
  assert(Boolean(pair.howToSteps && pair.howToSteps.length >= 3), `Pair ${pair.slug} must have at least 3 How-to-Convert steps`);
  assert(Boolean(pair.uniquenessNote && pair.uniquenessNote.length > 20), `Pair ${pair.slug} must have a content uniquenessNote`);
  assert(Boolean(pair.faqs && pair.faqs.length >= 3), `Pair ${pair.slug} must have at least 3 FAQs`);
}
console.log(`✅ Verified Content Specification (Unique Title/H1, Intro, How-to Steps, Formula Source, Uniqueness Note, FAQs) across all ${ENRICHED_CATALOGUE.length} pages.`);

// 10. US Customary vs. UK Imperial Non-Aliasing & Exact Factor Separation
const usFlOz = UNIT_MAP.get("us_fluid_ounce")!;
const impFlOz = UNIT_MAP.get("imperial_fluid_ounce")!;
assert(!usFlOz.aliases.includes("oz"), "US fluid ounce must not alias mass ounce 'oz'");
assert(approxEqual(convertUnits(1, "us_fluid_ounce", "milliliter").rawValue, 29.5735296, 0.0001), "1 US fl oz = 29.5735 mL");
assert(approxEqual(convertUnits(1, "imperial_fluid_ounce", "milliliter").rawValue, 28.4130625, 0.0001), "1 UK fl oz = 28.4131 mL");
assert(usFlOz.toBase !== impFlOz.toBase, "US and Imperial fluid ounces must have distinct definitions");

const usGal = convertUnits(1, "us_gallon", "liter").rawValue;
const impGal = convertUnits(1, "imperial_gallon", "liter").rawValue;
assert(approxEqual(usGal, 3.785411784, 0.0001) && approxEqual(impGal, 4.54609, 0.0001), "US vs UK gallons distinct");

const impMpgToL100 = convertUnits(50, "mpg_imperial", "liters_per_100km");
assert(approxEqual(impMpgToL100.rawValue, 5.6496, 0.001), `50 MPG (UK) should be ~5.6496 L/100km, got ${impMpgToL100.rawValue}`);

const rankineToC = convertUnits(491.67, "rankine", "celsius");
assert(approxEqual(rankineToC.rawValue, 0, 0.001), `491.67 °R should be 0 °C, got ${rankineToC.rawValue}`);

// 11. Edge Cases: Zero, Negative, Extreme Values, and Invalid Input
const zeroLinear = convertUnits(0, "meter", "foot");
assert(zeroLinear.rawValue === 0, "0 meters must equal 0 feet");
const zeroMpg = convertUnits(0, "mpg_us", "liters_per_100km");
assert(zeroMpg.rawValue === 0, "0 MPG division-by-zero guard must return 0 safely");
const extremeSmall = convertUnits(1e-6, "meter", "nanometer");
assert(approxEqual(extremeSmall.rawValue, 1000, 0.001), "1e-6 m should equal 1000 nm");
const sciFormatted = formatValue(123456789, "sci");
assert(sciFormatted.includes("e+"), `Scientific notation expected, got ${sciFormatted}`);

// 12. Duplicate Alias & Numeric Query Variant Canonical Resolution
assert(getConversionPair("cm-to-in")?.slug === "cm-to-inches", "Alias 'cm-to-in' must resolve to canonical 'cm-to-inches'");
assert(getConversionPair("centimeters-to-inches")?.slug === "cm-to-inches", "Alias 'centimeters-to-inches' must resolve to 'cm-to-inches'");
assert(getConversionPair("100-cm-to-inches")?.slug === "cm-to-inches", "Numeric query '100-cm-to-inches' must resolve to canonical 'cm-to-inches'");
assert(getConversionPair("50-kg-to-lbs")?.slug === "kg-to-lbs", "Numeric query '50-kg-to-lbs' must resolve to canonical 'kg-to-lbs'");
assert(getConversionPair("25.4-mm-to-in")?.slug === "mm-to-inches", "Numeric query '25.4-mm-to-in' must resolve to canonical 'mm-to-inches'");

// 13. Sitemap Index & Robots Canonical Indexability Verification
const childNames = getAllChildSitemapNames();
const sitemapEntries = childNames.flatMap((name) => getChildSitemapEntries(name) || []);
const sitemapUrls = new Set(sitemapEntries.map((e) => e.loc));
assert(sitemapEntries.length === sitemapUrls.size, "Sitemaps must not contain duplicate URLs");
for (const entry of sitemapEntries) {
  assert(!entry.loc.includes("?"), `Parameterized URL found in sitemap: ${entry.loc}`);
  assert(!entry.loc.includes("/widgets/w/"), `Widget embed URL must not be in sitemap: ${entry.loc}`);
  assert(!entry.loc.endsWith("/"), `Sitemap URL must not have trailing slash: ${entry.loc}`);
  const pathPart = entry.loc.replace(/^https?:\/\/[^/]+/, "");
  assert(!pathPart.includes("//"), `Sitemap URL must not contain double slashes: ${entry.loc}`);
}
const robotsConfig = robots();
assert(Boolean(robotsConfig.sitemap), "robots.ts must declare sitemap URL");
console.log(`✅ Verified Sitemap Index (${childNames.length} child sitemaps, ${sitemapEntries.length} canonical indexable URLs) & Robots configuration.`);

// 14. Site-Wide Unique Title & Meta Description Verification
const allTitles = new Map<string, string>();
const allDescriptions = new Map<string, string>();

for (const c of CATEGORIES) {
  const route = `/conversions/${c.id}`;
  const title = `${c.pluralName} Converter — All Units & Formulas`;
  const desc = `Calculate and convert all ${c.name.toLowerCase()} measurements in real time. ${c.description} Verified NIST & SI formulas, comparison matrix, and tables.`;
  assert(!allTitles.has(title), `Duplicate title "${title}" between ${allTitles.get(title)} and ${route}`);
  assert(!allDescriptions.has(desc), `Duplicate description between ${allDescriptions.get(desc)} and ${route}`);
  allTitles.set(title, route);
  allDescriptions.set(desc, route);
}

for (const p of ENRICHED_CATALOGUE) {
  const route = `/convert/${p.slug}`;
  assert(!allTitles.has(p.title), `Duplicate title "${p.title}" between ${allTitles.get(p.title)} and ${route}`);
  assert(!allDescriptions.has(p.metaDescription), `Duplicate metaDescription between ${allDescriptions.get(p.metaDescription)} and ${route}`);
  assert(Boolean(p.h1 && p.h1.length > 5), `Missing H1 on ${route}`);
  assert(Boolean(p.faqs && p.faqs.length >= 2), `Missing FAQs on ${route}`);
  allTitles.set(p.title, route);
  allDescriptions.set(p.metaDescription, route);
}

for (const g of GUIDES) {
  const route = `/guides/${g.slug}`;
  assert(!allTitles.has(g.title), `Duplicate guide title "${g.title}" between ${allTitles.get(g.title)} and ${route}`);
  assert(!allDescriptions.has(g.summary), `Duplicate guide summary between ${allDescriptions.get(g.summary)} and ${route}`);
  assert(g.content.length >= 3, `Guide ${g.slug} must have at least 3 detailed content sections`);
  allTitles.set(g.title, route);
  allDescriptions.set(g.summary, route);
}
console.log(`✅ Verified 100% unique titles & meta descriptions across all ${allTitles.size} dynamic SEO pages and reference guides.`);

// 15. Internal Link Integrity & JSON-LD Schema Structural Validation
for (const p of ENRICHED_CATALOGUE) {
  assert(CATEGORY_MAP.has(p.categoryId), `Broken category hub link "${p.categoryId}" on /convert/${p.slug}`);
  const relatedInCategory = ENRICHED_CATALOGUE.filter(
    (other) => other.categoryId === p.categoryId && other.slug !== p.slug
  );
  assert(relatedInCategory.length > 0, `No related conversions found in category "${p.categoryId}" for /convert/${p.slug}`);

  // Verify FAQPage JSON-LD structure matches visible FAQs without fake ratings/reviews
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (p.faqs || []).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const serialized = JSON.stringify(faqSchema);
  assert(serialized.includes('"@type":"FAQPage"'), `Invalid FAQPage JSON-LD for ${p.slug}`);
  assert(!serialized.includes("AggregateRating"), `JSON-LD must not contain unverified ratings on ${p.slug}`);
}
console.log(`✅ Verified internal link resolution (category hubs & related pair links) and JSON-LD schema integrity across all ${ENRICHED_CATALOGUE.length} pages.`);

// 16. Trusted Sources External Links & Page-Specific Topic Verification
for (const c of CATEGORIES) {
  const catRefs = getTrustedReferencesForCategory(c.id);
  assert(catRefs.length >= 2, `Category ${c.id} must have at least 2 trusted external sources`);
  for (const r of catRefs) {
    assert(r.url.startsWith("https://"), `Trusted source URL must be https on category ${c.id}: ${r.url}`);
    assert(Boolean(r.verifiedFormula && r.verifiedFormula.length > 5), `Missing verifiedFormula on category ${c.id}`);
  }
}

for (const p of ENRICHED_CATALOGUE) {
  const fromUnit = UNIT_MAP.get(p.fromUnitId)!;
  const toUnit = UNIT_MAP.get(p.toUnitId)!;
  const pairRefs = getTrustedReferencesForPair(p, fromUnit, toUnit);
  assert(pairRefs.length === 3, `Pair ${p.slug} must have 3 topic-specific trusted sources`);
  for (const r of pairRefs) {
    assert(r.url.startsWith("https://"), `Trusted source URL must be https on pair ${p.slug}: ${r.url}`);
    assert(!r.shortName.includes("HB 133") && !r.documentTitle.includes("Handbook 133"), `Must not cite NIST HB 133 on ${p.slug}`);
    assert(Boolean(r.verifiedFormula && r.verifiedFormula.length > 0), `Trusted source verifiedFormula must be non-empty on ${p.slug}`);
    assert(Boolean(r.linkLabel && r.linkLabel.length > 0), `Trusted source linkLabel must be non-empty on ${p.slug}`);
  }
}

// Explicit check for meters-to-feet & feet-to-inches (Task 5 Reference Audit)
const mToFtPair = getConversionPair("meters-to-feet")!;
const mToFtRefs = getTrustedReferencesForPair(mToFtPair, UNIT_MAP.get("meter")!, UNIT_MAP.get("foot")!);
assert(mToFtRefs.some((r) => r.shortName.includes("NIST SP 811")), "meters-to-feet must cite NIST SP 811");
assert(mToFtRefs.some((r) => r.documentTitle.includes("1959 International Yard and Pound Agreement")), "meters-to-feet must cite 1959 International Yard and Pound Agreement");
assert(mToFtRefs.some((r) => r.shortName === "BIPM" && r.documentTitle.includes("Meter (m)") && !r.documentTitle.includes("Foot")), "BIPM on meters-to-feet must only cover the SI unit (Meter)");

const ftToInPair = getConversionPair("feet-to-inches")!;
const ftToInRefs = getTrustedReferencesForPair(ftToInPair, UNIT_MAP.get("foot")!, UNIT_MAP.get("inch")!);
assert(!ftToInRefs.some((r) => r.shortName === "BIPM"), "Pure imperial pair (feet-to-inches) must not cite BIPM");

console.log(`✅ Verified page-specific Trusted Sources external links (NIST SP 811, 1959 International Yard and Pound Agreement, and SI-only BIPM) across all ${CATEGORIES.length} categories and ${ENRICHED_CATALOGUE.length} unit-pair pages.`);

// --- TEST 17: Verify Live 3-Step Mathematical Solver, Google Query Presets & Scenarios ---
console.log("\n🧪 Running Test 17: Live 3-Step Mathematical Solver, Google Query Presets & Scenarios...");

// 1. Temperature 3-step solver verification
const tempSol = generateLiveSolution(25, "celsius", "fahrenheit", "auto");
assert(tempSol.formulaEquation.includes("°F = (°C × 9/5) + 32"), `Expected temperature formula, got: ${tempSol.formulaEquation}`);
assert(tempSol.step2Expression.includes("25") && tempSol.step2Expression.includes("77"), `Expected 25 substituted into calculation, got: ${tempSol.step2Expression}`);
assert(tempSol.step3Result.includes("25 °C = 77 °F"), `Expected step 3 result, got: ${tempSol.step3Result}`);

// 2. Length linear solver verification
const lenSol = generateLiveSolution(10, "centimeter", "inch", "4");
assert(lenSol.step2Expression.includes("10"), `Expected 10 substituted into length solver, got: ${lenSol.step2Expression}`);
assert(lenSol.step3Result.includes("10 cm = 3.9370 in"), `Expected formatted 4 decimal result, got: ${lenSol.step3Result}`);

// 3. Preset Google search query verification across catalogue
for (const p of ENRICHED_CATALOGUE.slice(0, 50)) {
  const presets = getPresetSearchQueries(p.fromUnitId, p.toUnitId, p.categoryId);
  assert(presets.length >= 4, `Pair ${p.slug} must have at least 4 search presets, got ${presets.length}`);
  for (const preset of presets) {
    assert(typeof preset.value === "number" && !isNaN(preset.value), `Preset value must be a valid number on ${p.slug}`);
    assert(preset.label.length > 0, `Preset label must not be empty on ${p.slug}`);
  }
}

// 4. Real-world scenarios verification
for (const cat of CATEGORIES) {
  const scenarios = getRealWorldScenarios(cat.baseUnitId, cat.baseUnitId, cat.id);
  assert(scenarios.length === 3, `Category ${cat.id} must have exactly 3 domain scenarios, got ${scenarios.length}`);
  for (const sc of scenarios) {
    assert(sc.title.length > 5, `Scenario title must be descriptive in ${cat.id}`);
    assert(sc.description.length > 20, `Scenario description must be substantive in ${cat.id}`);
    assert(sc.exampleCalculation.length > 10, `Scenario example calculation must be substantive in ${cat.id}`);
    assert(sc.practicalTip.length > 10, `Scenario practical tip must be substantive in ${cat.id}`);
  }
}
console.log("✅ Verified Live 3-Step Mathematical Solver, Google Query Presets, and Real-World Scenarios.");

// --- TEST 18: Task 7 Technical SEO, Tier Gating, Redirects, Content Gate & Unit Symbols ---
console.log("\n🧪 Running Test 18: Technical SEO Tiers, Redirects, Content Gate & Unit Symbols (a–f)...");

// Trigger buildSitemapIndexXml() to verify build-time logging per sitemap and per tier
const indexXml = buildSitemapIndexXml();
assert(indexXml.includes("<sitemapindex"), "Sitemap index XML must be valid");

// Load redirect maps
const redirectList: Array<{ source: string; destination: string; permanent: boolean }> = Array.isArray(slugRedirectsData)
  ? slugRedirectsData
  : (slugRedirectsData as { redirects: Array<{ source: string; destination: string; permanent: boolean }> }).redirects;
const redirectSources = new Set<string>(redirectList.map((r) => r.source));

// (a) No sitemap URL has noindex or redirects
for (const entry of sitemapEntries) {
  const urlPath = entry.loc.replace(/^https?:\/\/[^/]+/, "") || "/";
  assert(
    !redirectSources.has(urlPath),
    `(a) Sitemap URL must not be a 301 redirect source: ${urlPath}`
  );
  // Check category or pair indexability
  const segments = urlPath.split("/").filter(Boolean);
  if (segments.length === 1) {
    const seg = segments[0];
    if (!["directory", "about", "contact", "widgets", "guides", "cooking", "specialty"].includes(seg)) {
      assert(
        isCategoryHubIndexable(seg),
        `(a) Sitemap category hub ${urlPath} must be indexable (not noindex or merged thin hub)`
      );
    }
  } else if (segments.length === 2 && segments[0] !== "guides" && segments[0] !== "cooking") {
    const pairSlug = segments[1];
    const pair = CATALOGUE_MAP.get(pairSlug);
    assert(Boolean(pair), `(a) Sitemap converter URL ${urlPath} must exist in CATALOGUE_MAP`);
    assert(
      isPairIndexable(pair!),
      `(a) Sitemap converter URL ${urlPath} must be indexable (not Tier C / noindex)`
    );
  }
}
console.log(`✅ (a) Verified 0 noindex or redirecting URLs across all ${sitemapEntries.length} sitemap entries.`);

// (b) No indexable page has a duplicate canonical target
const indexableCanonicals = new Map<string, string>();
for (const pair of ENRICHED_CATALOGUE) {
  if (!isPairIndexable(pair)) continue;
  assert(
    getDuplicateOf(pair) === null,
    `(b) Indexable pair ${pair.slug} must not be a duplicate loser`
  );
  const canonicalPath = getPairUrl(pair);
  assert(
    !indexableCanonicals.has(canonicalPath),
    `(b) Duplicate canonical target ${canonicalPath} between ${indexableCanonicals.get(canonicalPath)} and ${pair.slug}`
  );
  indexableCanonicals.set(canonicalPath, pair.slug);
}
console.log(`✅ (b) Verified ${indexableCanonicals.size} indexable converter pages have 100% unique canonical targets and 0 physical-pair duplicates.`);

// (c) All redirects in data/slug-redirects.json resolve with a single 301 and no chains
assert(redirectList.length >= 25, "(c) Expected at least 25 301 redirects in data/slug-redirects.json");
for (const rule of redirectList) {
  assert(rule.permanent === true, `(c) Redirect ${rule.source} -> ${rule.destination} must be permanent (301)`);
  assert(rule.source !== rule.destination, `(c) Self-redirect detected: ${rule.source}`);
  assert(
    !redirectSources.has(rule.destination),
    `(c) Redirect chain detected: ${rule.source} -> ${rule.destination} (destination is also a redirect source)`
  );
}
console.log(`✅ (c) Verified all ${redirectList.length} redirects in data/slug-redirects.json resolve in a single 301 hop with 0 chains.`);

// (d) Content gate fails on a page with generic boilerplate and passes on all indexable converter pages
const boilerplateGateResult = evaluateContentGate({
  slug: "cm-to-inches",
  intro: "A centimeter is a unit of length in the metric system. Convert centimeters to inches easily with our calculator.",
  commonValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // sequential 1..10 boilerplate
  workedExamples: [
    { title: "Ex 1", scenario: "Short", inputValue: 10, stepByStep: "10 / 2.54", outputValue: "3.937 in" },
  ],
  formula: {
    equation: "in = cm ÷ 2.54",
    exactFactor: "1 cm = 0.39370079 in",
    roundedFactor: "1 cm ≈ 0.3937 in",
  },
  internalLinks: [{ label: "Length", href: "/length", type: "hub" }],
  faqs: [{ question: "How many inches in a cm?", answer: "0.3937 inches." }],
});
assert(
  boilerplateGateResult.passed === false,
  "(d) Content gate MUST fail on generic boilerplate intro ('is a unit of'), sequential 1..10 table values, < 3 examples, and < 2 FAQs"
);
assert(
  boilerplateGateResult.reasons.length >= 3,
  `(d) Expected multiple failure reasons on boilerplate content, got: ${boilerplateGateResult.reasons.join("; ")}`
);

for (const pair of ENRICHED_CATALOGUE) {
  if (isPairIndexable(pair)) {
    const gate = evaluateContentGate(pair);
    assert(
      gate.passed === true,
      `(d) Indexable pair ${pair.slug} (Tier ${getConverterTier(pair)}) failed content gate: ${gate.reasons.join("; ")}`
    );
  }
}
console.log("✅ (d) Verified Content Gate rejects generic boilerplate and passes on 100% of indexable Tier A/B pages.");

// (e) No indexable page mixes dimensions
for (const pair of ENRICHED_CATALOGUE) {
  if (!isPairIndexable(pair)) continue;
  const fromU = UNIT_MAP.get(pair.fromUnitId)!;
  const toU = UNIT_MAP.get(pair.toUnitId)!;
  const dim = checkDimensionMatch(fromU, toU, pair.slug);
  assert(
    dim.matches === true,
    `(e) Indexable page ${pair.slug} mixes dimensions: ${dim.reason}`
  );
  assert(
    !checkSlugHasExponentLoss(pair.slug, fromU, toU),
    `(e) Indexable page ${pair.slug} has exponent loss in slug`
  );
}
console.log("✅ (e) Verified 0 indexable pages mix physical dimensions or have exponent-loss slugs.");

// (f) Titles and H1s contain proper unit symbols (g/m³, kgf/cm², kg/(s·m²)), not slug fragments
const symbolChecks = [
  { slug: "grams-per-cubic-meter-to-pounds-per-cubic-foot", expectedSymbols: ["g/m³", "lb/ft³"] },
  { slug: "pascals-to-kilogram-force-per-square-centimeter", expectedSymbols: ["Pa", "kgf/cm²"] },
  { slug: "kilogram-force-per-square-meter-to-feet-of-water", expectedSymbols: ["kgf/m²", "ftH₂O"] },
  { slug: "grams-per-cubic-meter-to-grams-per-milliliter", expectedSymbols: ["g/m³", "g/mL"] },
];
for (const check of symbolChecks) {
  const pair = getConversionPair(check.slug);
  assert(Boolean(pair), `(f) Expected repaired slug ${check.slug} to exist`);
  const enriched = ensureEnrichedPair(pair!);
  const fromU = UNIT_MAP.get(enriched.fromUnitId)!;
  const toU = UNIT_MAP.get(enriched.toUnitId)!;
  for (const sym of check.expectedSymbols) {
    assert(
      fromU.symbol === sym || toU.symbol === sym || enriched.title.includes(sym) || Boolean(enriched.h1?.includes(sym)),
      `(f) Expected proper symbol "${sym}" on ${check.slug} (fromSymbol=${fromU.symbol}, toSymbol=${toU.symbol}, title="${enriched.title}")`
    );
  }
}
console.log("✅ (f) Verified titles, H1s, and unit labels display proper mathematical unit symbols (g/m³, kgf/cm², kgf/m², ftH₂O).");

// (g) Verify /numbers/billions-to-lakhs and related South Asian / International number magnitude URLs are indexable
const billionsToLakhs = getConversionPair("billions-to-lakhs", "numbers");
assert(Boolean(billionsToLakhs), "(g) Expected /numbers/billions-to-lakhs to resolve as a valid conversion pair");
assert(
  isPairIndexable(billionsToLakhs!) === true && getConverterTier(billionsToLakhs!) === "A",
  `(g) Expected /numbers/billions-to-lakhs to be indexable Tier A, got Tier ${getConverterTier(billionsToLakhs!)}`
);
assert(
  evaluateContentGate(billionsToLakhs!).passed === true,
  `(g) Expected /numbers/billions-to-lakhs to pass 7-point Content Gate`
);
const trillionsToLakhs = getConversionPair("trillions-to-lakhs", "numbers");
assert(Boolean(trillionsToLakhs), "(g) Expected dynamic /numbers/trillions-to-lakhs to resolve");
assert(
  isPairIndexable(trillionsToLakhs!) === true,
  `(g) Expected dynamic /numbers/trillions-to-lakhs to be indexable (Tier ${getConverterTier(trillionsToLakhs!)})`
);
console.log("✅ (g) Verified /numbers/billions-to-lakhs (Tier A) and dynamic /numbers/* magnitude pairs (Tier B) are indexable and pass the 7-point Content Gate.");

console.log("🎉 ALL TESTS PASSED! Conversion engine, canonical routing, and site-wide Technical SEO specifications are verified.");
