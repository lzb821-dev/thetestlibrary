/*
 * Generate sitemap.xml + robots.txt for The Test Library.
 * Run: node scripts/generate-sitemap.js
 *
 * Page list is derived from data.js (single source of truth), so adding a
 * test or an Aura tier automatically adds its share pages to the sitemap.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://thetestlibrary.app";
const TODAY = new Date().toISOString().slice(0, 10);

// Load data.js in a sandbox, same pattern as the other generators.
const dataCode = fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8")
  + "\nglobalThis.__TESTS = TESTS; globalThis.__VERDICTS = VERDICTS; globalThis.__AURA_TIERS = AURA_TIERS;";
const ctx = {};
vm.createContext(ctx);
vm.runInContext(dataCode, ctx);
const { __TESTS: TESTS, __VERDICTS: VERDICTS, __AURA_TIERS: AURA_TIERS } = ctx;
const verdictIds = Object.keys(VERDICTS);

// Each entry: [path, changefreq, priority]
const urls = [];

// Core pages
urls.push(["/", "weekly", "1.0"]);
urls.push(["/test.html", "weekly", "0.9"]);
urls.push(["/duo.html", "weekly", "0.9"]);
urls.push(["/aura.html", "daily", "0.9"]);
urls.push(["/about.html", "monthly", "0.4"]);
urls.push(["/privacy.html", "yearly", "0.2"]);

// Test detail pages (query-string views of test.html)
for (const t of TESTS) {
  urls.push([`/test.html?id=${encodeURIComponent(t.id)}`, "weekly", "0.8"]);
}

// Pre-rendered share pages: cover + each verdict per test, duo verdicts, aura tiers
for (const t of TESTS) {
  urls.push([`/share/${t.id}-cover.html`, "monthly", "0.6"]);
  for (const vid of verdictIds) {
    urls.push([`/share/${t.id}-${vid}.html`, "monthly", "0.6"]);
  }
}
for (const vid of verdictIds) {
  urls.push([`/share/duo-${vid}.html`, "monthly", "0.6"]);
}
for (const tier of AURA_TIERS) {
  urls.push([`/share/aura-${tier.id}.html`, "monthly", "0.6"]);
}

// Deduplicate while preserving order.
const seen = new Set();
const unique = urls.filter(([p]) => {
  if (seen.has(p)) return false;
  seen.add(p);
  return true;
});

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique.map(([p, freq, pri]) => `  <url>
    <loc>${esc(SITE + p)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, "robots.txt"), robots, "utf8");

console.log(`Generated sitemap.xml with ${unique.length} URLs, and robots.txt`);
