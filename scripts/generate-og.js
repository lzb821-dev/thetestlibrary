/*
 * Generate static OG images (1200x630) for The Test Library.
 * Run: node scripts/generate-og.js
 * Requires: @napi-rs/canvas  (npm i -D @napi-rs/canvas)
 *
 * Two kinds of images:
 *   cover  — one per test, for test.html
 *   result — one per test x verdict, for share/<test>-<verdict>.html
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createCanvas } = require("@napi-rs/canvas");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "assets", "og");
fs.mkdirSync(OUT, { recursive: true });

// Load data.js without executing app.js
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

const W = 1200, H = 630;
const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const PALETTE = {
  green: { bg: "#0d1f14", panel: "#14301f", accent: "#4ade80", border: "#2a5c3b" },
  amber: { bg: "#1c170b", panel: "#332810", accent: "#fbbf24", border: "#6b531a" },
  red: { bg: "#1f0e0e", panel: "#331919", accent: "#f87171", border: "#6b2a2a" },
  gold: { bg: "#1c1708", panel: "#332a10", accent: "#fbbf24", border: "#6b531a" },
  orange: { bg: "#1f120a", panel: "#331e10", accent: "#fb923c", border: "#6b3d1a" },
  cover: { bg: "#0c0d0f", panel: "#16181c", accent: "#c4b5fd", border: "#3a3f47" },
};

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function wrap(c, text, x, y, maxW, lineH, maxLines) {
  const words = String(text).split(/\s+/);
  let line = "", n = 0;
  for (let i = 0; i < words.length; i++) {
    const t = line ? line + " " + words[i] : words[i];
    if (c.measureText(t).width > maxW && line) {
      c.fillText(line, x, y + n * lineH);
      line = words[i]; n++;
      if (n >= maxLines - 1) break;
    } else line = t;
  }
  if (line) c.fillText(line, x, y + n * lineH);
  return y + n * lineH;
}

function base(p) {
  const canvas = createCanvas(W, H);
  const c = canvas.getContext("2d");
  c.fillStyle = p.bg;
  c.fillRect(0, 0, W, H);
  // subtle grid dots
  c.fillStyle = "rgba(255,255,255,0.035)";
  for (let x = 40; x < W; x += 40) for (let y = 40; y < H; y += 40) {
    c.fillRect(x, y, 2, 2);
  }
  c.fillStyle = p.panel;
  roundRect(c, 36, 36, W - 72, H - 72, 28);
  c.fill();
  c.strokeStyle = p.border;
  c.lineWidth = 2;
  c.stroke();
  return { canvas, c };
}

function brand(c, accent) {
  c.fillStyle = accent;
  roundRect(c, 76, 76, 40, 40, 10);
  c.fill();
  c.fillStyle = p_dark(accent);
  c.font = `700 24px ${FONT}`;
  c.textAlign = "center";
  c.fillText("T", 96, 104);
  c.textAlign = "left";
  c.fillStyle = "#f2f3f5";
  c.font = `600 22px ${FONT}`;
  c.fillText("THE TEST LIBRARY", 132, 104);
}

function p_dark(hex) { return hex === "#c4b5fd" ? "#0c0d0f" : "#0c0d0f"; }

function drawCover(test) {
  const p = PALETTE.cover;
  const { canvas, c } = base(p);
  brand(c, p.accent);

  c.fillStyle = "#a6abb4";
  c.font = `700 16px ${FONT}`;
  c.fillText("REAL-LIFE TEST  /  " + test.category.toUpperCase(), 76, 190);

  c.fillStyle = "#f2f3f5";
  c.font = `750 66px ${FONT}`;
  const afterTitle = wrap(c, test.name, 76, 265, W - 160, 74, 2);

  c.fillStyle = p.accent;
  c.fillRect(76, afterTitle + 22, 110, 5);

  c.fillStyle = "#c9cdd4";
  c.font = `400 30px ${FONT}`;
  wrap(c, test.tagline, 76, afterTitle + 82, W - 170, 40, 2);

  c.fillStyle = p.accent;
  c.font = `700 26px ${FONT}`;
  c.fillText(test.hook, 76, H - 92);

  c.fillStyle = "#6f757e";
  c.font = `500 19px ${FONT}`;
  c.fillText("thetestlibrary.app", 76, H - 56);

  const file = path.join(OUT, `${test.id}-cover.png`);
  fs.writeFileSync(file, canvas.toBuffer("image/png"));
  console.log("wrote", path.basename(file));
}

function drawResult(test, verdictId) {
  const v = getVerdict(verdictId, test);
  const p = PALETTE[v.tone];
  const { canvas, c } = base(p);
  brand(c, p.accent);

  c.fillStyle = "#a6abb4";
  c.font = `700 16px ${FONT}`;
  c.fillText("MY VERDICT  /  " + test.name.toUpperCase(), 76, 190);

  c.fillStyle = p.accent;
  c.font = `800 62px ${FONT}`;
  c.fillText(v.label, 76, 275);

  c.fillStyle = "#f2f3f5";
  c.font = `700 48px ${FONT}`;
  const afterHead = wrap(c, v.headline, 76, 350, W - 160, 58, 2);

  c.fillStyle = "#c9cdd4";
  c.font = `400 26px ${FONT}`;
  wrap(c, v.description, 76, afterHead + 48, W - 170, 36, 3);

  c.fillStyle = p.accent;
  c.font = `700 27px ${FONT}`;
  c.fillText(test.share.prompt, 76, H - 92);

  c.fillStyle = "#6f757e";
  c.font = `500 19px ${FONT}`;
  c.fillText("thetestlibrary.app", 76, H - 56);

  const file = path.join(OUT, `${test.id}-${verdictId}.png`);
  fs.writeFileSync(file, canvas.toBuffer("image/png"));
  console.log("wrote", path.basename(file));
}

/* ---------- Duo mode: Green or Red ---------- */

function drawDuoCover() {
  const p = PALETTE.cover;
  const { canvas, c } = base(p);
  brand(c, p.accent);

  c.fillStyle = "#a6abb4";
  c.font = `700 16px ${FONT}`;
  c.fillText("TWO-PLAYER TEST  /  RELATIONSHIP", 76, 190);

  c.fillStyle = "#f2f3f5";
  c.font = `750 72px ${FONT}`;
  c.fillText("Green or Red", 76, 282);

  c.fillStyle = p.accent;
  c.fillRect(76, 316, 110, 5);

  c.fillStyle = "#c9cdd4";
  c.font = `400 30px ${FONT}`;
  c.fillText(DUO.tagline, 76, 384);

  c.fillStyle = p.accent;
  c.font = `700 27px ${FONT}`;
  c.fillText(DUO.hook, 76, H - 92);

  c.fillStyle = "#6f757e";
  c.font = `500 19px ${FONT}`;
  c.fillText("thetestlibrary.app", 76, H - 56);

  fs.writeFileSync(path.join(OUT, "duo-cover.png"), canvas.toBuffer("image/png"));
  console.log("wrote duo-cover.png");
}

function drawDuoResult(verdictId) {
  const v = getDuoVerdict(verdictId);
  const p = PALETTE[v.tone];
  const { canvas, c } = base(p);
  brand(c, p.accent);

  c.fillStyle = "#a6abb4";
  c.font = `700 16px ${FONT}`;
  c.fillText("GREEN OR RED  /  TWO-PLAYER TEST", 76, 190);

  c.fillStyle = p.accent;
  c.font = `800 62px ${FONT}`;
  c.fillText(v.label, 76, 275);

  c.fillStyle = "#f2f3f5";
  c.font = `700 48px ${FONT}`;
  const afterHead = wrap(c, v.headline, 76, 350, W - 160, 58, 2);

  c.fillStyle = "#c9cdd4";
  c.font = `400 26px ${FONT}`;
  wrap(c, v.description, 76, afterHead + 48, W - 170, 36, 3);

  c.fillStyle = p.accent;
  c.font = `700 27px ${FONT}`;
  c.fillText(DUO.share.prompt, 76, H - 92);

  c.fillStyle = "#6f757e";
  c.font = `500 19px ${FONT}`;
  c.fillText("thetestlibrary.app", 76, H - 56);

  fs.writeFileSync(path.join(OUT, `duo-${verdictId}.png`), canvas.toBuffer("image/png"));
  console.log(`wrote duo-${verdictId}.png`);
}

for (const test of TESTS) {
  drawCover(test);
  for (const vid of Object.keys(VERDICTS)) drawResult(test, vid);
}
drawDuoCover();
for (const vid of Object.keys(VERDICTS)) drawDuoResult(vid);

/* ---------- Aura Score ---------- */

function drawAuraCover() {
  const p = PALETTE.gold;
  const { canvas, c } = base(p);
  brand(c, p.accent);

  c.fillStyle = "#a6abb4";
  c.font = `700 16px ${FONT}`;
  c.fillText("DAILY VIBE CHECK  /  CONTENT MODE", 76, 190);

  c.fillStyle = "#f2f3f5";
  c.font = `750 72px ${FONT}`;
  c.fillText("Aura Score", 76, 282);

  c.fillStyle = p.accent;
  c.fillRect(76, 316, 110, 5);

  c.fillStyle = "#c9cdd4";
  c.font = `400 30px ${FONT}`;
  c.fillText("Read the room. Rate the vibe.", 76, 384);

  c.fillStyle = p.accent;
  c.font = `700 27px ${FONT}`;
  c.fillText("Gains aura, or drains it?", 76, H - 92);

  c.fillStyle = "#6f757e";
  c.font = `500 19px ${FONT}`;
  c.fillText("thetestlibrary.app", 76, H - 56);

  fs.writeFileSync(path.join(OUT, "aura-cover.png"), canvas.toBuffer("image/png"));
  console.log("wrote aura-cover.png");
}

function drawAuraResult(tier) {
  const p = PALETTE[tier.tone] || PALETTE.amber;
  const { canvas, c } = base(p);
  brand(c, p.accent);

  c.fillStyle = "#a6abb4";
  c.font = `700 16px ${FONT}`;
  c.fillText("AURA SCORE  /  THE VERDICT", 76, 190);

  c.fillStyle = p.accent;
  c.font = `800 62px ${FONT}`;
  c.fillText(tier.label, 76, 275);

  c.fillStyle = "#f2f3f5";
  c.font = `700 48px ${FONT}`;
  const afterHead = wrap(c, tier.headline, 76, 350, W - 160, 58, 2);

  c.fillStyle = "#c9cdd4";
  c.font = `400 26px ${FONT}`;
  wrap(c, tier.description, 76, afterHead + 48, W - 170, 36, 3);

  c.fillStyle = p.accent;
  c.font = `700 27px ${FONT}`;
  c.fillText("Rate the vibe. Read the room.", 76, H - 92);

  c.fillStyle = "#6f757e";
  c.font = `500 19px ${FONT}`;
  c.fillText("thetestlibrary.app", 76, H - 56);

  fs.writeFileSync(path.join(OUT, `aura-${tier.id}.png`), canvas.toBuffer("image/png"));
  console.log(`wrote aura-${tier.id}.png`);
}

drawAuraCover();
for (const tier of AURA_TIERS) drawAuraResult(tier);
console.log(`\nDone. ${fs.readdirSync(OUT).length} images in ${OUT}`);

// Site-wide home card
function drawHome() {
  const p = PALETTE.cover;
  const { canvas, c } = base(p);
  brand(c, p.accent);
  c.fillStyle = "#f2f3f5";
  c.font = `750 72px ${FONT}`;
  c.fillText("Stop guessing.", 76, 280);
  c.fillStyle = p.accent;
  c.fillText("Start testing.", 76, 370);
  c.fillStyle = "#c9cdd4";
  c.font = `400 30px ${FONT}`;
  c.fillText("Real-life tests. Real reactions.", 76, 450);
  c.fillStyle = "#6f757e";
  c.font = `500 20px ${FONT}`;
  c.fillText("thetestlibrary.app", 76, H - 72);
  fs.writeFileSync(path.join(OUT, "home.png"), canvas.toBuffer("image/png"));
  console.log("wrote home.png");
}
drawHome();
