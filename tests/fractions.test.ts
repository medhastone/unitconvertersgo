import assert from "node:assert/strict";
import {
  roundHalfUp,
  gcd,
  formatAsTapeFraction,
  getFractionalInchesGuideData,
  generateContinuousLengthChartRows,
  COMMON_LENGTH_CHART_VALUES,
} from "../lib/conversions/fractions.ts";

let passedTests = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passedTests++;
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    throw err;
  }
}

// 1. Verify roundHalfUp exact boundary behavior
test("roundHalfUp rounds exact .5 ties upward and < .5 downward", () => {
  assert.equal(roundHalfUp(0), 0);
  assert.equal(roundHalfUp(0.499999), 0);
  assert.equal(roundHalfUp(0.5), 1);
  assert.equal(roundHalfUp(1.5), 2);
  assert.equal(roundHalfUp(2.5), 3);
  assert.equal(roundHalfUp(15.5), 16);
  assert.equal(roundHalfUp(31.5), 32);
  assert.equal(roundHalfUp(63.5), 64);
  assert.equal(roundHalfUp(63.499999), 63);
});

// 2. Verify gcd and lowest-terms fraction reduction
test("formatAsTapeFraction reduces dyadic fractions to lowest terms and handles half-up ties", () => {
  // Exact 1/2 inch at 16, 32, 64 denominators -> always reduces to 1/2
  for (const denom of [16, 32, 64] as const) {
    const half = formatAsTapeFraction(0.5, denom);
    assert.ok(half);
    assert.equal(half.whole, 0);
    assert.equal(half.numerator, 1);
    assert.equal(half.denominator, 2);
    assert.equal(half.unreducedNumerator, denom / 2);
    assert.equal(half.display, "1/2");
  }

  // Exact tie halfway between 0/16 and 1/16 -> 1/32 = 0.03125 -> rounds half up to 1/16
  const tie16 = formatAsTapeFraction(1 / 32, 16);
  assert.ok(tie16);
  assert.equal(tie16.whole, 0);
  assert.equal(tie16.unreducedNumerator, 1);
  assert.equal(tie16.numerator, 1);
  assert.equal(tie16.denominator, 16);

  // Exact tie halfway between 1/16 and 2/16 -> 3/32 = 0.09375 -> rounds half up to 2/16 = 1/8
  const tieEighth = formatAsTapeFraction(3 / 32, 16);
  assert.ok(tieEighth);
  assert.equal(tieEighth.whole, 0);
  assert.equal(tieEighth.unreducedNumerator, 2);
  assert.equal(tieEighth.numerator, 1);
  assert.equal(tieEighth.denominator, 8);

  // Carry-over into next whole inch when fractional part >= 1 - (0.5 / maxDenominator)
  const carry64 = formatAsTapeFraction(3 + 127 / 128, 64);
  assert.ok(carry64);
  assert.equal(carry64.whole, 4);
  assert.equal(carry64.numerator, 0);
  assert.equal(carry64.denominator, 1);
  assert.equal(carry64.display, "4");
});

// 3. Verify specific benchmark conversions (cm-to-inches, mm-to-inches, inches-to-cm, feet-to-inches)
test("Verify specific real-world benchmark conversions (10 cm, 15 cm, 25 mm, 5.5 ft)", () => {
  // 10 cm = 3.937007874 in
  // 0.937007874 * 16 = 14.9921 -> 15/16 -> 3 15/16"
  // 0.937007874 * 32 = 29.9842 -> 30/32 -> 15/16 -> 3 15/16"
  // 0.937007874 * 64 = 59.9685 -> 60/64 -> 15/16 -> 3 15/16"
  const tenCmGuide = getFractionalInchesGuideData(10, "centimeter");
  assert.ok(tenCmGuide);
  assert.equal(tenCmGuide.frac16.display, "3 15/16");
  assert.equal(tenCmGuide.frac32.display, "3 15/16");
  assert.equal(tenCmGuide.frac64.display, "3 15/16");

  // 15 cm = 5.905511811 in
  // 0.905511811 * 16 = 14.488 -> 14/16 = 7/8 -> 5 7/8"
  // 0.905511811 * 32 = 28.976 -> 29/32 -> 5 29/32"
  // 0.905511811 * 64 = 57.9527 -> 58/64 = 29/32 -> 5 29/32"
  const fifteenCmGuide = getFractionalInchesGuideData(15, "centimeter");
  assert.ok(fifteenCmGuide);
  assert.equal(fifteenCmGuide.frac16.display, "5 7/8");
  assert.equal(fifteenCmGuide.frac32.display, "5 29/32");
  assert.equal(fifteenCmGuide.frac64.display, "5 29/32");

  // 25 mm = 0.9842519685 in
  // 0.9842519685 * 16 = 15.748 -> 16/16 -> carries over to 1"
  // 0.9842519685 * 32 = 31.496 -> 31/32"
  // 0.9842519685 * 64 = 62.992 -> 63/64"
  const twentyFiveMmGuide = getFractionalInchesGuideData(25, "millimeter");
  assert.ok(twentyFiveMmGuide);
  assert.equal(twentyFiveMmGuide.frac16.display, "1");
  assert.equal(twentyFiveMmGuide.frac32.display, "31/32");
  assert.equal(twentyFiveMmGuide.frac64.display, "63/64");

  // 5.5 ft = 66 in
  const fivePointFiveFtGuide = getFractionalInchesGuideData(5.5, "foot");
  assert.ok(fivePointFiveFtGuide);
  assert.equal(fivePointFiveFtGuide.frac16.display, "66");
  assert.equal(fivePointFiveFtGuide.frac64.display, "66");
});

// 4. Exhaustively verify every row 1..100 across all core length converter pairs
test("Exhaustively verify continuous chart rows 1..100 for cm-to-inches, mm-to-inches, inches-to-cm, feet-to-inches, meters-to-inches, yards-to-inches", () => {
  const pairs: Array<[string, string]> = [
    ["centimeter", "inch"],
    ["millimeter", "inch"],
    ["inch", "centimeter"],
    ["foot", "inch"],
    ["meter", "inch"],
    ["yard", "inch"],
  ];

  const validDenominators = new Set([1, 2, 4, 8, 16, 32, 64]);

  for (const [fromUnit, toUnit] of pairs) {
    const rows40 = generateContinuousLengthChartRows(fromUnit, toUnit, 40);
    assert.equal(rows40.length, 40, `Expected 40 rows for ${fromUnit}->${toUnit}`);

    const rows100 = generateContinuousLengthChartRows(fromUnit, toUnit, 100);
    assert.equal(rows100.length, 100, `Expected 100 rows for ${fromUnit}->${toUnit}`);

    for (let i = 0; i < rows100.length; i++) {
      const row = rows100[i];
      const expectedN = i + 1;
      assert.equal(row.n, expectedN);
      assert.equal(row.isCommon, COMMON_LENGTH_CHART_VALUES.has(expectedN));

      // Verify guide data for this input n
      const guide = getFractionalInchesGuideData(expectedN, fromUnit);
      assert.ok(guide);

      // Verify all three fractional precisions (1/16, 1/32, 1/64) on the target unit and inches
      for (const [maxDenom, frac, targetValue] of [
        [16, row.fraction16Info, row.decimalValue],
        [64, row.fraction64Info, row.decimalValue],
        [16, guide.frac16, row.inchesDecimal],
        [32, guide.frac32, row.inchesDecimal],
        [64, guide.frac64, row.inchesDecimal],
      ] as const) {
        // 1. Valid reduced power-of-2 denominator
        assert.ok(
          validDenominators.has(frac.denominator),
          `Invalid denominator ${frac.denominator} for ${expectedN} ${fromUnit}`
        );
        assert.ok(frac.denominator <= maxDenom);

        // 2. Reduced to lowest terms (coprime numerator and denominator)
        if (frac.numerator === 0) {
          assert.equal(frac.denominator, 1);
        } else {
          assert.equal(
            gcd(frac.numerator, frac.denominator),
            1,
            `Fraction ${frac.numerator}/${frac.denominator} is not reduced for ${expectedN} ${fromUnit}`
          );
          // Any reduced fraction with power-of-2 denominator > 1 must have an odd numerator
          assert.equal(frac.numerator % 2, 1, `Numerator ${frac.numerator} must be odd`);
          assert.ok(frac.numerator > 0 && frac.numerator < frac.denominator);
        }

        // 3. Verify roundHalfUp mathematical accuracy against targetValue
        const wholeFloor = Math.floor(targetValue + 1e-12);
        const rem = Math.max(0, targetValue - wholeFloor);
        const expectedUnreduced = roundHalfUp(rem * maxDenom);

        if (expectedUnreduced >= maxDenom) {
          assert.equal(frac.whole, wholeFloor + 1);
          assert.equal(frac.numerator, 0);
        } else {
          assert.equal(frac.whole, wholeFloor);
          assert.equal(frac.unreducedNumerator, expectedUnreduced);
          assert.ok(
            Math.abs(frac.exactDecimal - targetValue) <= 0.5 / maxDenom + 1e-9,
            `Rounding error ${frac.error} exceeds half-step for ${expectedN} ${fromUnit} at 1/${maxDenom}`
          );
        }
      }
    }
  }
});

console.log(`\nAll ${passedTests} fraction & continuous chart test suites passed (600+ conversions verified)!`);
