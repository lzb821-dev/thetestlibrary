/*
 * Pre-render static share landing pages under /share/.
 * Each page has a hardcoded og:image + og:title so social crawlers
 * (which do NOT run JavaScript) see the correct preview.
 *
 * Run: node scripts/generate-share-pages.js
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "share");
fs.mkdirSync(OUT, { recursive: true });

const dataCode = fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8")
  + "\nglobalThis.__TESTS = TESTS; globalThis.__VERDICTS = VERDICTS; globalThis.__getVerdict = getVerdict;"
  + " globalThis.__DUO = DUO; globalThis.__getDuoVerdict = getDuoVerdict;"
  + " globalThis.__AURA_TIERS = AURA_TIERS; globalThis.__getAuraTier = getAuraTier;";
const ctx = {};
vm.createContext(ctx);
vm.runInContext(dataCode, ctx);
const TESTS = ctx.__TESTS;
const VERDICTS = ctx.__VERDICTS;
const getVerdict = ctx.__getVerdict;
const DUO = ctx.__DUO;
const getDuoVerdict = ctx.__getDuoVerdict;
const AURA_TIERS = ctx.__AURA_TIERS;
const getAuraTier = ctx.__getAuraTier;

const SITE = "https://thetestlibrary.app";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

function head({ title, description, image, url, page = "share" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="The Test Library">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${esc(url)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}">
  <meta name="theme-color" content="#0c0d0f">
  <link rel="stylesheet" href="../assets/css/style.css">
  <style>
    .share-hero{padding:40px 0 20px}
    .share-verdict{font-size:clamp(36px,10vw,56px);font-weight:800;letter-spacing:-0.03em;line-height:1.05;margin:8px 0 14px}
    .share-verdict.green{color:var(--green)}
    .share-verdict.amber{color:var(--amber)}
    .share-verdict.red{color:var(--red)}
    .share-card-img{width:100%;border-radius:var(--radius);border:1px solid var(--border);display:block;margin:20px 0 24px}
  </style>
</head>
<body data-page="${page}">`;
}

function header() {
  return `<header class="site-header"><div class="header-inner">
    <a class="brand" href="../index.html"><span class="brand-mark">T</span><span>The Test Library</span></a>
    <span class="header-note">No sign-up</span>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap">
    <p>The Test Library — real-life tests, real reactions.</p>
    <p>For entertainment only. Not psychological advice.</p>
    <p class="footer-links"><a href="../about.html">About</a><span>·</span><a href="../privacy.html">Privacy</a><span>·</span><a href="../index.html">All tests</a></p>
  </div></footer>`;
}

function scripts() {
  return `<script src="../assets/js/site.config.js"></script>
<script src="../assets/js/analytics.js"></script>
<script src="../assets/js/data.js"></script>
<script src="../assets/js/app.js"></script>
</body></html>`;
}

function resultPage(test, verdictId) {
  const v = getVerdict(verdictId, test);
  const slug = `${test.id}-${verdictId}`;
  const title = `${v.label} — ${test.name} | The Test Library`;
  const description = `${v.headline} ${test.share.prompt}`;
  const image = `${SITE}/assets/og/${slug}.png`;
  const url = `${SITE}/share/${slug}.html`;

  return `${head({ title, description, image, url })}
${header()}
<main class="wrap">
  <a class="back-link" href="../index.html">← All tests</a>
  <section class="share-hero">
    <div class="eyebrow">A FRIEND SHARED THEIR VERDICT</div>
    <h1 style="font-size:clamp(26px,7vw,36px);letter-spacing:-0.025em;line-height:1.15">${esc(test.name)}</h1>
    <div class="share-verdict ${esc(v.tone)}">${esc(v.label)}</div>
    <p style="font-size:17px;color:var(--text-2)">${esc(v.headline)}</p>
  </section>
  <img class="share-card-img" src="../assets/og/${slug}.png" alt="${esc(v.label)} result card">
  <div class="science-note">
    <h3>What they got</h3>
    <p>${esc(v.description)}</p>
  </div>
  <div class="action-stack">
    <a class="btn btn-primary" id="tryBtn" href="../test.html?id=${encodeURIComponent(test.id)}&from=A%20friend">Find out yours →</a>
    <a class="btn btn-ghost" href="../index.html">Browse all tests</a>
  </div>
  <p class="disclaimer">For fun, not a diagnosis. One test never defines a relationship.</p>
</main>
${footer()}
<script>
  (function(){
    var from = new URLSearchParams(location.search).get('from');
    if (from) {
      var a = document.getElementById('tryBtn');
      if (a) a.href = '../test.html?id=${encodeURIComponent(test.id)}&from=' + encodeURIComponent(from);
      var h = document.querySelector('.share-hero .eyebrow');
      if (h) h.textContent = from.toUpperCase() + ' SHARED THEIR VERDICT';
    }
  })();
</script>
${scripts()}`;
}

function coverPage(test) {
  const slug = `${test.id}-cover`;
  const title = `${test.name} — The Test Library`;
  const description = test.tagline + " " + test.hook;
  const image = `${SITE}/assets/og/${slug}.png`;
  const url = `${SITE}/share/${slug}.html`;

  return `${head({ title, description, image, url })}
${header()}
<main class="wrap">
  <a class="back-link" href="../index.html">← All tests</a>
  <section class="share-hero">
    <div class="eyebrow">REAL-LIFE TEST · ${esc(test.category.toUpperCase())}</div>
    <h1 style="font-size:clamp(30px,8vw,44px);letter-spacing:-0.03em;line-height:1.1">${esc(test.name)}</h1>
    <p style="font-size:17px;color:var(--text-2);margin-top:10px">${esc(test.tagline)}</p>
  </section>
  <img class="share-card-img" src="../assets/og/${slug}.png" alt="${esc(test.name)} test card">
  <div class="science-note">
    <h3>What is it?</h3>
    <p>${esc(test.description)}</p>
  </div>
  <div class="action-stack">
    <a class="btn btn-primary" href="../test.html?id=${encodeURIComponent(test.id)}&from=A%20friend">Try this test →</a>
    <a class="btn btn-ghost" href="../index.html">Browse all tests</a>
  </div>
  <p class="disclaimer">${esc(test.meta.views)} · ${esc(test.meta.time)} · For entertainment only.</p>
</main>
${footer()}
${scripts()}`;
}

/* ---------- Duo mode share pages ---------- */

function duoScripts() {
  return `<script src="../assets/js/site.config.js"></script>
<script src="../assets/js/analytics.js"></script>
<script src="../assets/js/data.js"></script>
<script src="../assets/js/duo.js"></script>
</body></html>`;
}

function duoPage(verdictId) {
  const v = getDuoVerdict(verdictId);
  const title = `${v.label} — Green or Red | The Test Library`;
  const description = `${v.headline} ${DUO.share.prompt}`;
  const image = `${SITE}/assets/og/duo-${verdictId}.png`;
  const url = `${SITE}/share/duo-${verdictId}.html`;

  return `${head({ title, description, image, url, page: "duo-share" })}
${header()}
<main class="wrap">
  <a class="back-link" href="../index.html">← All tests</a>
  <section class="share-hero">
    <div class="eyebrow">A TWO-PLAYER VERDICT</div>
    <h1 style="font-size:clamp(26px,7vw,36px);letter-spacing:-0.025em;line-height:1.15">Green or Red</h1>
    <div class="share-verdict ${esc(v.tone)}">${esc(v.label)}</div>
    <p style="font-size:17px;color:var(--text-2)">${esc(v.headline)}</p>
  </section>
  <img class="share-card-img" src="../assets/og/duo-${verdictId}.png" alt="${esc(v.label)} duo result card">
  <div id="duoShare"></div>
  <div class="science-note">
    <h3>The research behind it</h3>
    <p>${esc(v.science)}</p>
  </div>
</main>
${footer()}
${duoScripts()}`;
}

/* ---------- Aura Score share pages ---------- */

function auraScripts() {
  return `<script src="../assets/js/site.config.js"></script>
<script src="../assets/js/analytics.js"></script>
<script src="../assets/js/data.js"></script>
<script src="../assets/js/aura.js"></script>
</body></html>`;
}

function auraPage(tier) {
  const title = `${tier.label} — Aura Score | The Test Library`;
  const description = `${tier.headline} ${tier.description}`;
  const image = `${SITE}/assets/og/aura-${tier.id}.png`;
  const url = `${SITE}/share/aura-${tier.id}.html`;

  return `${head({ title, description, image, url, page: "aura-share" })}
${header()}
<main class="wrap">
  <a class="back-link" href="../index.html">← All tests</a>
  <section class="share-hero">
    <div class="eyebrow">AURA SCORE · THE VERDICT</div>
    <h1 style="font-size:clamp(26px,7vw,36px);letter-spacing:-0.025em;line-height:1.15">Aura Score</h1>
    <div class="share-verdict" style="color:${tier.tone === "green" ? "var(--green)" : tier.tone === "red" ? "var(--red)" : tier.tone === "orange" ? "#fb923c" : "var(--amber)"}">${esc(tier.label)}</div>
    <p style="font-size:17px;color:var(--text-2)">${esc(tier.headline)}</p>
  </section>
  <img class="share-card-img" src="../assets/og/aura-${tier.id}.png" alt="${esc(tier.label)} aura result card">
  <div id="auraShare"></div>
</main>
${footer()}
${auraScripts()}`;
}

let count = 0;
for (const test of TESTS) {
  fs.writeFileSync(path.join(OUT, `${test.id}-cover.html`), coverPage(test));
  count++;
  for (const vid of Object.keys(VERDICTS)) {
    fs.writeFileSync(path.join(OUT, `${test.id}-${vid}.html`), resultPage(test, vid));
    count++;
  }
}
for (const vid of Object.keys(VERDICTS)) {
  fs.writeFileSync(path.join(OUT, `duo-${vid}.html`), duoPage(vid));
  count++;
}
for (const tier of AURA_TIERS) {
  fs.writeFileSync(path.join(OUT, `aura-${tier.id}.html`), auraPage(tier));
  count++;
}
console.log(`Generated ${count} share pages in ${OUT}`);
