/*
 * Inject favicon + PWA manifest links into every HTML page's <head>.
 * Idempotent: pages that already have the marker are left untouched.
 * Run: node scripts/inject-head-links.js
 *
 * Re-run this after `generate-share-pages.js` (which rewrites share pages),
 * so newly regenerated share pages get the tags back.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MARKER = "data-icon-links";

// Root-level pages use relative paths; /share/ pages need one level up.
const REL = (prefix) => `  <link rel="icon" href="${prefix}favicon.ico" sizes="any" ${MARKER}>
  <link rel="icon" type="image/png" sizes="32x32" href="${prefix}favicon-32.png" ${MARKER}>
  <link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png" ${MARKER}>
  <link rel="manifest" href="${prefix}site.webmanifest" ${MARKER}>`;

function collect(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name !== "node_modules" && name !== "assets" && name !== "scripts" && name !== "sites") {
        out.push(...collect(full));
      }
    } else if (name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

let changed = 0;
let skipped = 0;
for (const file of collect(ROOT)) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes(MARKER)) {
    skipped++;
    continue;
  }
  const inShare = path.relative(ROOT, file).startsWith("share" + path.sep);
  const prefix = inShare ? "../" : "";
  if (!html.includes("</head>")) {
    console.warn(`  WARN: no </head> in ${path.relative(ROOT, file)}`);
    continue;
  }
  html = html.replace("</head>", `${REL(prefix)}\n</head>`);
  fs.writeFileSync(file, html, "utf8");
  changed++;
}

console.log(`Injected icon/manifest links: ${changed} changed, ${skipped} already tagged`);
