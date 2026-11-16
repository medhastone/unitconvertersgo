import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const STASH_DIR = path.join(ROOT, ".gh-pages-api-stash");

const DYNAMIC_ONLY_DIRS = [
  { src: path.join(ROOT, "app", "api", "og"), stash: path.join(STASH_DIR, "api_og") },
  { src: path.join(ROOT, "app", "api", "contact"), stash: path.join(STASH_DIR, "api_contact") },
  { src: path.join(ROOT, "app", "convert"), stash: path.join(STASH_DIR, "app_convert") },
  { src: path.join(ROOT, "app", "conversions"), stash: path.join(STASH_DIR, "app_conversions") },
];

function stashDynamicRoutes() {
  fs.mkdirSync(STASH_DIR, { recursive: true });
  for (const item of DYNAMIC_ONLY_DIRS) {
    if (fs.existsSync(item.src)) {
      fs.renameSync(item.src, item.stash);
    }
  }
}

function restoreDynamicRoutes() {
  for (const item of DYNAMIC_ONLY_DIRS) {
    if (fs.existsSync(item.stash)) {
      fs.mkdirSync(path.dirname(item.src), { recursive: true });
      fs.renameSync(item.stash, item.src);
    }
  }
  if (fs.existsSync(STASH_DIR)) {
    fs.rmSync(STASH_DIR, { recursive: true, force: true });
  }
}

function copyChildSitemapsToRoot() {
  const sitemapsApiOut = path.join(OUT_DIR, "api", "sitemaps");
  if (!fs.existsSync(sitemapsApiOut)) return 0;

  let copied = 0;
  for (const entry of fs.readdirSync(sitemapsApiOut)) {
    const srcFile = path.join(sitemapsApiOut, entry);
    if (fs.statSync(srcFile).isFile()) {
      const cleanName = entry.replace(/\.body$/, "");
      const destXml = path.join(OUT_DIR, `sitemap-${cleanName}.xml`);
      fs.copyFileSync(srcFile, destXml);
      copied++;
    }
  }
  return copied;
}

function generateStaticRedirectPages(basePath = "") {
  const redirectsPath = path.join(ROOT, "data", "slug-redirects.json");
  if (!fs.existsSync(redirectsPath)) return 0;

  const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf-8"));
  let written = 0;

  for (const r of redirects) {
    if (!r.source || !r.destination || r.source.includes(":")) continue;
    const cleanSource = r.source.replace(/^\/+|\/+$/g, "");
    if (!cleanSource) continue;

    const targetUrl = r.destination.startsWith("http")
      ? r.destination
      : `${basePath}${r.destination}`;
    const canonicalUrl = r.destination.startsWith("http")
      ? r.destination
      : `https://unitconvertersgo.com${r.destination}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Redirecting to ${targetUrl}</title>
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="noindex, follow" />
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${targetUrl}</a>...</p>
</body>
</html>`;

    const htmlFilePath = path.join(OUT_DIR, `${cleanSource}.html`);
    const indexFilePath = path.join(OUT_DIR, cleanSource, "index.html");

    if (!fs.existsSync(htmlFilePath)) {
      fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });
      fs.writeFileSync(htmlFilePath, html, "utf-8");
      written++;
    }
    if (!fs.existsSync(indexFilePath)) {
      fs.mkdirSync(path.dirname(indexFilePath), { recursive: true });
      fs.writeFileSync(indexFilePath, html, "utf-8");
    }
  }
  return written;
}

try {
  console.log("1. Running SEO Title & H1 verification...");
  execSync("npx --yes tsx scripts/check-seo-titles.ts", { stdio: "inherit" });

  console.log("2. Preparing static export for GitHub Pages...");
  stashDynamicRoutes();

  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      GITHUB_PAGES: "true",
    },
  });

  const sitemapsCount = copyChildSitemapsToRoot();
  const redirectsCount = generateStaticRedirectPages("");

  fs.writeFileSync(path.join(OUT_DIR, ".nojekyll"), "", "utf-8");
  if (!fs.existsSync(path.join(OUT_DIR, "CNAME"))) {
    fs.writeFileSync(path.join(OUT_DIR, "CNAME"), "unitconvertersgo.com\n", "utf-8");
  }

  console.log(
    `✅ GitHub Pages static build complete in ./out (${sitemapsCount} child sitemaps, ${redirectsCount} static redirect pages).`
  );
} finally {
  restoreDynamicRoutes();
}
