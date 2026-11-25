/*
 * Inject JSON-LD structured data into every HTML page.
 * Run: node scripts/generate-jsonld.js
 *
 * Schema types:
 *   home page      -> WebSite + ItemList of all tests
 *   test.html      -> WebPage (single test app)
 *   duo/aura       -> WebPage + BreadcrumbList
 *   share/*.html   -> WebPage + BreadcrumbList
 *   about/privacy  -> WebPage + BreadcrumbList
 *
 * Idempotent: pages already carrying the data-jsonld marker are skipped.
 * Re-run after generate-share-pages.js, which rewrites the share pages.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://thetestlibrary.app";
const MARKER = "data-jsonld";

// Load data.js for the home-page ItemList.
const dataCode = fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8")
  + "\nglobalThis.__TESTS = TESTS; globalThis.__DUO = DUO; globalThis.__AURA = {name:'Aura Score'};";
const ctx = {};
vm.createContext(ctx);
vm.runInContext(dataCode, ctx);
const { __TESTS: TESTS } = ctx;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

const ORG = {
  "@type": "Organization",
  "name": "The Test Library",
  "url": SITE + "/",
};

function wrap(graph) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
  return `  <script type="application/ld+json" ${MARKER}>\n${json}\n  </script>`;
}

function breadcrumb(items) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map(([name, url], i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": name,
      "item": SITE + url,
    })),
  };
}

function schemaFor(relPath) {
  const name = path.basename(relPath);

  if (name === "index.html") {
    return wrap([
      {
        "@type": "WebSite",
        "@id": SITE + "/#website",
        "url": SITE + "/",
        "name": "The Test Library",
        "description": "The viral relationship tests from TikTok in one place. Run them in real life, record what happened, get a verdict you can share.",
        "publisher": { "@id": SITE + "/#organization" },
        "inLanguage": "en",
      },
      ORG,
      {
        "@type": "ItemList",
        "name": "Real-life tests",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": TESTS.length + 2,
        "itemListElement": [
          ...TESTS.map((t, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": SITE + "/test.html?id=" + encodeURIComponent(t.id),
            "name": t.name,
          })),
          { "@type": "ListItem", "position": TESTS.length + 1, "url": SITE + "/duo.html", "name": "Green or Red" },
          { "@type": "ListItem", "position": TESTS.length + 2, "url": SITE + "/aura.html", "name": "Aura Score" },
        ],
      },
    ]);
  }

  if (name === "test.html") {
    return wrap([
      {
        "@type": "WebPage",
        "@id": SITE + "/test.html#webpage",
        "url": SITE + "/test.html",
        "name": "Real-life relationship tests | The Test Library",
        "description": "Run a viral relationship test in real life and share your verdict.",
        "publisher": { "@id": SITE + "/#organization" },
        "isPartOf": { "@id": SITE + "/#website" },
        "inLanguage": "en",
      },
      breadcrumb([["Home", "/"], ["Tests", "/test.html"]]),
    ]);
  }

  // Everything else: a simple WebPage + breadcrumb.
  const titles = {
    "duo.html": "Green or Red — Two-Player Test",
    "aura.html": "Aura Score — Read the room",
    "about.html": "About The Test Library",
    "privacy.html": "Privacy Policy",
  };

  let pageName = titles[name];
  let crumbs = [["Home", "/"], [pageName || name, "/" + name]];

  if (relPath.startsWith("share" + path.sep)) {
    const stem = name.replace(/\.html$/, "");
    const test = TESTS.find((t) => stem.startsWith(t.id + "-"));
    if (test) {
      const isCover = stem === test.id + "-cover";
      const verdict = stem.endsWith("-green") ? "GREEN FLAG"
        : stem.endsWith("-red") ? "RED FLAG"
        : stem.endsWith("-complicated") ? "IT'S COMPLICATED" : null;
      const label = isCover ? test.name : (verdict ? `${verdict} — ${test.name}` : stem.replace(/-/g, " "));
      pageName = `${label} | The Test Library`;
      crumbs = [["Home", "/"], ["Tests", "/test.html"], [label, "/share/" + name]];
    } else if (stem.startsWith("duo-")) {
      pageName = "Green or Red verdict | The Test Library";
      crumbs = [["Home", "/"], ["Green or Red", "/duo.html"], ["Verdict", "/share/" + name]];
    } else if (stem.startsWith("aura-")) {
      pageName = "Aura Score verdict | The Test Library";
      crumbs = [["Home", "/"], ["Aura Score", "/aura.html"], ["Verdict", "/share/" + name]];
    }
  }

  return wrap([
    {
      "@type": "WebPage",
      "@id": SITE + "/" + relPath.split(path.sep).join("/") + "#webpage",
      "url": SITE + "/" + relPath.split(path.sep).join("/"),
      "name": pageName || "The Test Library",
      "publisher": { "@id": SITE + "/#organization" },
      "isPartOf": { "@id": SITE + "/#website" },
      "inLanguage": "en",
    },
    breadcrumb(crumbs),
  ]);
}

function collect(dir, base = "") {
  const out = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!["node_modules", "assets", "scripts", "sites"].includes(entry)) {
        out.push(...collect(full, base ? `${base}/${entry}` : entry));
      }
    } else if (entry.endsWith(".html")) {
      out.push(base ? `${base}/${entry}` : entry);
    }
  }
  return out;
}

let changed = 0;
let skipped = 0;
for (const relPath of collect(ROOT)) {
  const file = path.join(ROOT, relPath);
  let html = fs.readFileSync(file, "utf8");
  if (html.includes(MARKER)) {
    skipped++;
    continue;
  }
  if (!html.includes("</head>")) {
    console.warn("  WARN: no </head> in", relPath);
    continue;
  }
  html = html.replace("</head>", `${schemaFor(relPath)}\n</head>`);
  fs.writeFileSync(file, html, "utf8");
  changed++;
}

console.log(`Injected JSON-LD: ${changed} changed, ${skipped} already tagged`);
