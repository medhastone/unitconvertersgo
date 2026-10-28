# UnitConvertersGo Chrome Extension Page Plan (`/chrome-extension`)

## Overview
Create a dedicated, SEO-optimized **Chrome Extension** landing page at `/chrome-extension` with an interactive browser toolbar popup simulator, an interactive right-click context menu demonstration, a downloadable Manifest V3 unpacked extension package, complete feature and 31-category breakdowns, privacy/permission guarantees, and sitewide navigation links in the Navbar, Footer, and Sitemap.

---

## Key Features & Architecture

### 1. Chrome Extension Page & SEO (`app/chrome-extension/page.tsx`)
- **Metadata & Structured Data**:
  - Standardized SEO title, meta description with CTA, canonical URL (`/chrome-extension`), OpenGraph/Twitter social card metadata, and JSON-LD (`BreadcrumbList` + `SoftwareApplication` with `applicationCategory: "BrowserApplication"` and free offer schema).
- **Hero Section**:
  - Clear headline, tagline, and exact product overview: *"UnitConvertersGo is a fast, simple unit calculator for your browser toolbar. Pick two units, type a number, and see the answer instantly. No sign-up and no internet connection needed."*
  - Primary **Add to Chrome** CTA button alongside a **Download Unpacked Extension** action and `Alt+U` shortcut callout.

### 2. Interactive Toolbar Popup Simulator & Right-Click Demo (`components/ChromeExtensionPageClient.tsx`)
- **Live Browser Extension Popup Simulator**:
  - **Quick Search Box**: Type natural queries such as `"5 km to miles"`, `"72 f in c"`, or `"10 kg to lbs"` for instant answers.
  - **Category & Unit Picker**: Choose a category, enter any number, and pick source/target units with live calculation as you type.
  - **One-Click Copy**: Copy the formatted result to the clipboard immediately.
  - **Last 5 Conversions History**: Automatically remembers and displays your last 5 conversions with one-click reload.
  - **Popup Theme & Decimal Controls**: Toggle the simulated popup between Light and Dark themes and adjust decimal places (`Auto`, `2`, `4`, `6`).
  - **Website Deep-Link**: Every conversion result includes a direct link to the matching detailed page on `unitconvertersgo.com` (opening in a new tab).
- **Interactive Right-Click Context Menu Demo**:
  - Lets visitors click or highlight sample webpage snippets (e.g., `"10 kg"`, `"5 km"`, `"72 °F"`, `"250 mL"`) to preview the browser right-click context menu converting the selected value in place.
- **Unpacked Extension Package Download**:
  - Allows users or reviewers to download a ready-to-load Manifest V3 Chrome extension bundle (`manifest.json`, `popup.html`, `popup.js`, `background.js`) directly from the page.

### 3. Content Sections (Matching Provided Copy & Structure)
- **Supported Units (31 Categories)**:
  - Structured into the 6 core groups with direct links to corresponding converters on `unitconvertersgo.com`:
    - **Everyday**: length, weight, temperature, volume, area, speed, time
    - **Technology**: data storage, data transfer rate, frequency
    - **Home and kitchen**: cups, tablespoons, teaspoons, fluid ounces, gallons (US and UK)
    - **Engineering**: pressure, energy, power, force, torque, flow, density, acceleration
    - **Electrical**: current, voltage, resistance, capacitance, inductance, charge
    - **Also**: angle, fuel economy, illumination, dry volume and more
- **Features Breakdown**:
  - Live results as you type, Quick search box (`"5 km to miles"` / `"72 f in c"`), Right-click selected value conversion (`"10 kg"`), One-click copy, Last 5 conversions memory, Light/dark theme + adjustable decimals, and `Alt+U` keyboard shortcut.
- **How to Use (3-Step Visual Guide)**:
  - Step 1: Click the extension icon (or press `Alt+U`).
  - Step 2: Choose a category, enter a value, and pick your units.
  - Step 3: Or select text on any page, right-click, and choose the UnitConvertersGo option.
- **Website Link & Privacy Section**:
  - Explains the deep-link from each result to the matching page on `unitconvertersgo.com`.
  - Details the offline-first architecture, zero personal data collection, and the only two required permissions (`contextMenus` for the right-click menu and `storage` for local settings).

### 4. Sitewide Navigation & Sitemap Integration
- **Navbar (`components/Navbar.tsx`)**: Add a **Chrome Extension** link to both the desktop navigation bar and the mobile navigation drawer.
- **Footer (`components/Footer.tsx`)**: Add **Chrome Extension** to the **Explore & Support** column.
- **XML & HTML Sitemaps (`app/sitemap.ts`, `components/SitemapDirectoryClient.tsx`)**: Register `/chrome-extension` so search engines and users can discover it easily.

---

## Verification Plan
- Run `lint_applet` and `compile_applet` to ensure zero TypeScript, ESLint, or build issues.
- Verify interactive popup simulator, natural query parser (`"5 km to miles"`, `"72 f in c"`), right-click preview, unpacked download, and navigation links across desktop and mobile layouts.
