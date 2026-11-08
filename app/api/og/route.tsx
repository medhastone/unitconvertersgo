import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
  CATALOGUE_MAP,
  getConversionPair,
} from "@/lib/conversions/catalogue";
import { CATEGORY_MAP, UNIT_MAP } from "@/lib/conversions/units";
import { convertUnits } from "@/lib/conversions/engine";
import { COOKING_INGREDIENTS } from "@/lib/conversions/cooking";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim().toLowerCase();

  let badge = "UNIT CONVERTER";
  let title = "Free Online Unit Converter";
  let subtitle =
    "Instant, standards-verified metric & imperial conversions with formulas and tables.";
  let exampleLabel = "Verified Conversion Formula";
  let exampleEquation = "1 m = 3.28084 ft";

  if (slug === "ah-to-kwh") {
    badge = "CHARGE & BATTERY CONVERTER";
    title = "Ah to kWh Converter (Amp-Hours to Kilowatt-Hours)";
    subtitle =
      "Convert battery capacity in Amp-Hours (Ah) to energy in Kilowatt-Hours (kWh) at 12V, 24V, 36V & 48V.";
    exampleLabel = "Formula: kWh = (Ah × V) ÷ 1,000";
    exampleEquation = "100 Ah at 12V = 1.2 kWh (1,200 Wh)";
  } else {
    const cookingIng = COOKING_INGREDIENTS.find((i) => i.slug === slug);
    if (cookingIng) {
      badge = "COOKING & BAKING CONVERTER";
      title = `${cookingIng.shortName} Cups to Grams Converter`;
      subtitle = cookingIng.description;
      exampleLabel = "USDA & Culinary Weight Standard";
      exampleEquation = `1 US Cup ${cookingIng.shortName} = ${cookingIng.gramsPerUsCup} g`;
    } else {
      const pair = CATALOGUE_MAP.get(slug) || getConversionPair(slug);
      if (pair) {
        const cat = CATEGORY_MAP.get(pair.categoryId);
        const fromUnit = UNIT_MAP.get(pair.fromUnitId);
        const toUnit = UNIT_MAP.get(pair.toUnitId);

        badge = `${(cat?.name || "Unit").toUpperCase()} CONVERTER`;
        title =
          fromUnit && toUnit
            ? `${fromUnit.plural} to ${toUnit.plural} Converter`
            : pair.title;
        subtitle = `Convert ${fromUnit?.plural.toLowerCase() || "units"} (${fromUnit?.symbol || ""}) to ${toUnit?.plural.toLowerCase() || "units"} (${toUnit?.symbol || ""}) instantly with formula & reference table.`;

        if (fromUnit && toUnit) {
          try {
            const oneOut = convertUnits(1, fromUnit.id, toUnit.id, "auto");
            exampleLabel = `Direct Conversion Factor (${fromUnit.symbol} → ${toUnit.symbol})`;
            exampleEquation = `1 ${fromUnit.symbol} = ${oneOut.formattedValue} ${toUnit.symbol}`;
          } catch {
            exampleEquation = `${fromUnit.symbol} → ${toUnit.symbol}`;
          }
        }
      }
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 64px",
          background:
            "linear-gradient(135deg, #0F172A 0%, #16324F 60%, #0D3B4C 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.96)",
              padding: "12px 24px",
              borderRadius: "16px",
              fontSize: "26px",
              fontWeight: 800,
              color: "#16324F",
            }}
          >
            UnitConvertersGo
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              borderRadius: "999px",
              background: "rgba(13, 148, 136, 0.25)",
              border: "2px solid #2DD4BF",
              color: "#5EEAD4",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            {badge}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 34 ? "52px" : "60px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "26px",
              fontWeight: 500,
              color: "#CBD5E1",
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "rgba(15, 23, 42, 0.78)",
            border: "2px solid rgba(45, 212, 191, 0.45)",
            borderRadius: "20px",
            padding: "24px 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#2DD4BF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {exampleLabel}
            </div>
            <div
              style={{
                fontSize: "34px",
                fontWeight: 800,
                color: "#F8FAFC",
              }}
            >
              {exampleEquation}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#2DD4BF",
              }}
            >
              unitconvertersgo.com
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#94A3B8",
              }}
            >
              NIST & SI Verified Standards
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
