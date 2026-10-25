import type { ContinuousLengthChartRow } from "./fractions";

export interface ChartExportPayload {
  slug: string;
  title: string;
  fromUnitLabel: string;
  toUnitLabel: string;
  fromSymbol: string;
  toSymbol: string;
  formulaSubtitle: string;
  siteName: string;
  pageUrl: string;
  rows: ContinuousLengthChartRow[];
}

/**
 * Renders the continuous conversion chart onto a high-DPI HTML5 Canvas
 * with highlighted common values and a branded footer containing site name + URL.
 */
function renderChartCanvas(payload: ChartExportPayload): HTMLCanvasElement {
  const {
    title,
    fromUnitLabel,
    toUnitLabel,
    fromSymbol,
    toSymbol,
    formulaSubtitle,
    siteName,
    pageUrl,
    rows,
  } = payload;

  const dpr = 2;
  const useTwoColumns = rows.length > 20;
  const colSplit = useTwoColumns ? Math.ceil(rows.length / 2) : rows.length;

  const width = useTwoColumns ? 1240 : 720;
  const headerHeight = 112;
  const tableHeaderHeight = 40;
  const rowHeight = 28;
  const footerHeight = 64;
  const padding = 32;

  const bodyHeight = colSplit * rowHeight;
  const height =
    padding * 2 + headerHeight + tableHeaderHeight + bodyHeight + footerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  // Top Header Banner
  ctx.fillStyle = "#16324F";
  ctx.beginPath();
  ctx.roundRect(padding, padding, width - padding * 2, headerHeight - 16, 12);
  ctx.fill();

  // Header Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    `${title} (1–${rows.length} Continuous Chart)`,
    padding + 24,
    padding + 40
  );

  // Header Subtitle (Formula + Legend)
  ctx.fillStyle = "#99F6E4";
  ctx.font = "600 13px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(formulaSubtitle, padding + 24, padding + 68);

  ctx.fillStyle = "#E2E8F0";
  ctx.font = "600 12px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(
    "★ Highlighted rows = Common shop & ruler values",
    width - padding - 24,
    padding + 68
  );
  ctx.textAlign = "left";

  const tableTop = padding + headerHeight;
  const totalTableWidth = width - padding * 2;
  const paneGap = 20;
  const paneWidth = useTwoColumns
    ? (totalTableWidth - paneGap) / 2
    : totalTableWidth;

  const drawPane = (paneRows: ContinuousLengthChartRow[], startX: number) => {
    // Table Header
    ctx.fillStyle = "#F1F5F9";
    ctx.fillRect(startX, tableTop, paneWidth, tableHeaderHeight);
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      startX,
      tableTop,
      paneWidth,
      tableHeaderHeight + paneRows.length * rowHeight
    );

    const col1X = startX + 14;
    const col2X = startX + paneWidth * 0.26;
    const col3X = startX + paneWidth * 0.62;

    ctx.fillStyle = "#16324F";
    ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${fromUnitLabel} (${fromSymbol})`, col1X, tableTop + 25);
    ctx.fillText(`Decimal (${toSymbol})`, col2X, tableTop + 25);
    ctx.fillText(`Nearest 1/64 (Reduced)`, col3X, tableTop + 25);

    paneRows.forEach((row, idx) => {
      const y = tableTop + tableHeaderHeight + idx * rowHeight;

      if (row.isCommon) {
        ctx.fillStyle = "#E6FAF8";
        ctx.fillRect(startX + 1, y, paneWidth - 2, rowHeight);
      } else if (idx % 2 === 1) {
        ctx.fillStyle = "#F8FAFC";
        ctx.fillRect(startX + 1, y, paneWidth - 2, rowHeight);
      }

      // Row divider
      ctx.strokeStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + paneWidth, y);
      ctx.stroke();

      // Input column
      ctx.fillStyle = row.isCommon ? "#0F766E" : "#16324F";
      ctx.font = row.isCommon
        ? "bold 13px ui-monospace, SFMono-Regular, monospace"
        : "600 13px ui-monospace, SFMono-Regular, monospace";
      ctx.fillText(
        row.isCommon ? `★ ${row.inputLabel}` : row.inputLabel,
        col1X,
        y + 19
      );

      // Decimal column
      ctx.fillStyle = "#0F172A";
      ctx.font = row.isCommon
        ? "bold 13px ui-monospace, SFMono-Regular, monospace"
        : "500 13px ui-monospace, SFMono-Regular, monospace";
      ctx.fillText(row.decimalFormatted, col2X, y + 19);

      // Reduced 1/64 Fraction column
      ctx.fillStyle = "#0D9488";
      ctx.font = "bold 13px ui-monospace, SFMono-Regular, monospace";
      ctx.fillText(row.fraction64Display, col3X, y + 19);
    });
  };

  if (useTwoColumns) {
    const leftRows = rows.slice(0, colSplit);
    const rightRows = rows.slice(colSplit);
    drawPane(leftRows, padding);
    drawPane(rightRows, padding + paneWidth + paneGap);
  } else {
    drawPane(rows, padding);
  }

  // Footer with Site Name and URL
  const footerY = tableTop + tableHeaderHeight + bodyHeight + 18;
  ctx.fillStyle = "#F8FAFC";
  ctx.fillRect(padding, footerY, totalTableWidth, 40);
  ctx.strokeStyle = "#CBD5E1";
  ctx.strokeRect(padding, footerY, totalTableWidth, 40);

  ctx.fillStyle = "#16324F";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    `${siteName} — Verified ${fromUnitLabel} to ${toUnitLabel} Reference Chart`,
    padding + 16,
    footerY + 25
  );

  ctx.fillStyle = "#0D9488";
  ctx.font = "bold 13px ui-monospace, SFMono-Regular, monospace";
  ctx.textAlign = "right";
  ctx.fillText(pageUrl, width - padding - 16, footerY + 25);
  ctx.textAlign = "left";

  return canvas;
}

/**
 * Downloads the continuous chart as a high-DPI PNG image with site name and URL in the footer.
 */
export async function downloadChartAsPng(
  payload: ChartExportPayload
): Promise<void> {
  const canvas = renderChartCanvas(payload);
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `${payload.slug}-chart-1-to-${payload.rows.length}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Wraps a JPEG data URL inside a valid minimal PDF 1.4 binary document so users can download
 * a real .pdf file with zero external library overhead.
 */
function buildPdfBlobFromJpegDataUrl(
  jpegDataUrl: string,
  pixelWidth: number,
  pixelHeight: number
): Blob {
  const base64 = jpegDataUrl.split(",")[1] || "";
  const binaryStr = atob(base64);
  const imgBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    imgBytes[i] = binaryStr.charCodeAt(i);
  }

  // Fit to US Letter / A4 width (612 pt wide) with proportional height
  const pdfPageWidth = 612;
  const pdfPageHeight = Math.round((pixelHeight / pixelWidth) * pdfPageWidth);

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let byteLength = 0;

  const pushStr = (str: string) => {
    const encoded = encoder.encode(str);
    chunks.push(encoded);
    byteLength += encoded.byteLength;
  };

  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    byteLength += bytes.byteLength;
  };

  pushStr("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  // 1: Catalog
  offsets.push(byteLength);
  pushStr("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // 2: Pages
  offsets.push(byteLength);
  pushStr("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  // 3: Page
  offsets.push(byteLength);
  pushStr(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im0 4 0 R >> >> /MediaBox [0 0 ${pdfPageWidth} ${pdfPageHeight}] /Contents 5 0 R >>\nendobj\n`
  );

  // 4: Image XObject
  offsets.push(byteLength);
  pushStr(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pixelWidth} /Height ${pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.byteLength} >>\nstream\n`
  );
  pushBytes(imgBytes);
  pushStr("\nendstream\nendobj\n");

  // 5: Page Content Stream
  const contentStream = `q\n${pdfPageWidth} 0 0 ${pdfPageHeight} 0 0 cm\n/Im0 Do\nQ\n`;
  offsets.push(byteLength);
  pushStr(
    `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`
  );

  const xrefOffset = byteLength;
  pushStr(`xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`);
  for (const off of offsets) {
    pushStr(`${String(off).padStart(10, "0")} 00000 n \n`);
  }
  pushStr(
    `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  );

  return new Blob(chunks as BlobPart[], { type: "application/pdf" });
}

/**
 * Downloads the continuous chart as a standalone PDF file with site name and URL in the footer.
 */
export async function downloadChartAsPdf(
  payload: ChartExportPayload
): Promise<void> {
  const canvas = renderChartCanvas(payload);
  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const pdfBlob = buildPdfBlobFromJpegDataUrl(
    jpegDataUrl,
    canvas.width,
    canvas.height
  );

  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.download = `${payload.slug}-chart-1-to-${payload.rows.length}.pdf`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Prints the continuous conversion chart using a dedicated print-friendly stylesheet
 * inside a hidden iframe (avoiding window.open) with the site name and URL in the footer.
 */
export async function printConversionChart(
  payload: ChartExportPayload
): Promise<void> {
  const {
    title,
    fromUnitLabel,
    fromSymbol,
    toSymbol,
    formulaSubtitle,
    siteName,
    pageUrl,
    rows,
  } = payload;

  const colSplit = Math.ceil(rows.length / 2);
  const leftRows = rows.slice(0, colSplit);
  const rightRows = rows.slice(colSplit);

  const renderTableHtml = (subset: ContinuousLengthChartRow[]) => `
    <table>
      <thead>
        <tr>
          <th>${fromUnitLabel} (${fromSymbol})</th>
          <th>Decimal (${toSymbol})</th>
          <th>Nearest 1/64 (Reduced)</th>
        </tr>
      </thead>
      <tbody>
        ${subset
          .map(
            (r) => `
          <tr class="${r.isCommon ? "common-row" : ""}">
            <td class="col-input">${r.isCommon ? "★ " : ""}${r.inputLabel}</td>
            <td class="col-dec">${r.decimalFormatted}</td>
            <td class="col-frac">${r.fraction64Display}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title} Chart (1–${rows.length}) — ${siteName}</title>
  <style>
    @page { size: portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 0;
      font-size: 11px;
    }
    .header {
      border-bottom: 2px solid #16324F;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header h1 {
      margin: 0;
      font-size: 18px;
      color: #16324F;
    }
    .header p {
      margin: 3px 0 0 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      color: #0F766E;
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 10.5px;
    }
    th {
      background: #F1F5F9;
      color: #16324F;
      text-align: left;
      padding: 5px 7px;
      border: 1px solid #CBD5E1;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 10px;
      text-transform: uppercase;
    }
    td {
      padding: 3.5px 7px;
      border: 1px solid #E2E8F0;
    }
    tr.common-row td {
      background: #E6FAF8;
      font-weight: 700;
    }
    .col-input { color: #16324F; font-weight: 600; }
    .col-frac { color: #0D9488; font-weight: 700; }
    .footer {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1.5px solid #CBD5E1;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: #16324F;
    }
    .footer-url {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      color: #0D9488;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${title} (1–${rows.length} Continuous Chart)</h1>
      <p>${formulaSubtitle}</p>
    </div>
    <div style="font-size: 10px; color: #475569;">★ Highlighted = Common Values</div>
  </div>
  <div class="grid">
    <div>${renderTableHtml(leftRows)}</div>
    <div>${renderTableHtml(rightRows)}</div>
  </div>
  <div class="footer">
    <span>${siteName} — Printable Reference Chart</span>
    <span class="footer-url">${pageUrl}</span>
  </div>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 250);
  }
}
