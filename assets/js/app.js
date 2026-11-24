/*
 * The Test Library — app logic
 * Vanilla JS, no build step. Flow: browse -> instructions -> reaction -> verdict -> share.
 */

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function showToast(msg) {
  let t = qs("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Home ---------- */

function renderHome() {
  const root = qs("#app");
  if (!root) return;

  root.innerHTML = `
    <section class="hero">
      <div class="eyebrow">Real-life tests · Real reactions</div>
      <h1>Stop guessing.<br><em>Start testing.</em></h1>
      <p>The viral relationship tests you keep seeing on TikTok — in one place. Run them in real life, record what happened, get a verdict you can share.</p>
      <div class="micro">No sign-up. No account. Just you and the person you're testing.</div>
    </section>
    <section class="section">
      <div class="section-head">
        <h2>Pick a test</h2>
        <span>${TESTS.length} available</span>
      </div>
      <div class="test-list">
        ${TESTS.map(renderCard).join("")}
      </div>
    </section>
  `;
}

function renderCard(test) {
  return `
    <a class="test-card" href="test.html?id=${encodeURIComponent(test.id)}">
      <div class="card-top">
        <span class="chip">${esc(test.category)}</span>
        <span class="chip hot">${esc(test.meta.views)}</span>
      </div>
      <div class="card-title">${esc(test.name)}</div>
      <div class="card-tagline">${esc(test.tagline)}</div>
      <div class="card-meta">
        <span>◷ ${esc(test.meta.time)}</span>
        <span>◉ ${esc(test.meta.players)}</span>
        <span>✦ ${esc(test.meta.difficulty)}</span>
      </div>
    </a>
  `;
}

/* ---------- Test page ---------- */

const state = {
  test: null,
  from: "",
  phase: "mission", // mission | reactions | result
  reaction: null,
  verdict: null,
};

function renderTest() {
  const root = qs("#app");
  if (!root) return;

  const id = getParam("id");
  state.test = getTest(id);
  state.from = getParam("from") || "";

  if (!state.test) {
    root.innerHTML = `
      <section class="hero">
        <h1>Test not found.</h1>
        <p>That test doesn't exist — maybe it was renamed.</p>
        <p style="margin-top:20px"><a class="btn btn-primary" href="index.html">Browse all tests</a></p>
      </section>`;
    return;
  }

  document.title = `${state.test.name} — The Test Library`;
  const descTag = qs('meta[name="description"]');
  if (descTag) descTag.content = state.test.description;

  renderPhase();
}

function renderPhase() {
  const root = qs("#app");
  const test = state.test;
  let html = `<a class="back-link" href="index.html">← All tests</a>`;

  if (state.from) {
    html += `<div class="challenge-banner"><strong>${esc(state.from)}</strong> challenged you to try this one.</div>`;
  }

  html += `
    <div class="test-hero">
      <div class="eyebrow">${esc(test.category)} test</div>
      <h1>${esc(test.name)}</h1>
      <div class="tagline">${esc(test.tagline)}</div>
      <p class="description">${esc(test.description)}</p>
      <div class="meta-row">
        <span class="chip">◷ ${esc(test.meta.time)}</span>
        <span class="chip">◉ ${esc(test.meta.players)}</span>
        <span class="chip hot">${esc(test.meta.views)}</span>
      </div>
    </div>
  `;

  if (state.phase === "mission") html += renderMission(test);
  if (state.phase === "reactions") html += renderReactions(test);
  if (state.phase === "result") html += renderResult(test);

  root.innerHTML = html;
  bindPhaseEvents();

  if (state.phase === "result") drawShareCard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderMission(test) {
  return `
    <div class="step-label">${esc(test.mission.eyebrow)}</div>
    <div class="step-title">${esc(test.mission.title)}</div>
    <p class="step-desc">${esc(test.mission.instruction)}</p>
    <div class="quote-box">${esc(test.mission.quote)}</div>
    <ul class="tips">${test.mission.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <button class="btn btn-primary" id="toReactions">${esc(test.mission.cta)} →</button>
    <div class="origin">
      <h3>${esc(test.origin.title)}</h3>
      <p>${esc(test.origin.text)}</p>
      <div class="source">${esc(test.origin.source)}</div>
    </div>
  `;
}

function renderReactions(test) {
  return `
    <div class="step-label">${esc(test.reactions.eyebrow)}</div>
    <div class="step-title">${esc(test.reactions.title)}</div>
    <p class="step-desc">${esc(test.reactions.subtitle)}</p>
    <div class="option-list">
      ${test.reactions.options.map((o, i) => `
        <button class="option" data-verdict="${esc(o.verdict)}" data-index="${i}">
          <span class="option-dot"></span>
          <span class="option-body">
            ${esc(o.label)}
            <span class="option-hint">${esc(o.hint)}</span>
          </span>
        </button>
      `).join("")}
    </div>
    <button class="btn btn-ghost" id="backMission">← Back to instructions</button>
  `;
}

function renderResult(test) {
  const v = getVerdict(state.verdict, state.test);
  return `
    <div class="step-label">YOUR VERDICT</div>
    <div class="result-card ${esc(v.tone)}">
      <div class="verdict-label">${esc(v.label)}</div>
      <div class="result-headline">${esc(v.headline)}</div>
      <p class="result-desc">${esc(v.description)}</p>
    </div>
    <div class="science-note">
      <h3>The research behind it</h3>
      <p>${esc(v.science)}</p>
    </div>
    <div class="action-stack">
      <button class="btn btn-primary" id="copyLink">Copy your test link ↗</button>
      <button class="btn" id="downloadCard">Save result card ⤓</button>
    </div>
    <div class="share-preview">
      <div class="share-preview-label">Your share card</div>
      <canvas id="shareCanvas" width="600" height="750"></canvas>
    </div>
    <div class="action-stack">
      <a class="btn btn-ghost" href="index.html">Try another test →</a>
      <button class="btn btn-ghost" id="retake">Retake this test</button>
    </div>
    <p class="disclaimer">For fun, not a diagnosis. One test never defines a relationship.<br>The Test Library · thetestlibrary.app</p>
  `;
}

function bindPhaseEvents() {
  const toReactions = qs("#toReactions");
  if (toReactions) toReactions.onclick = () => { state.phase = "reactions"; renderPhase(); };

  const backMission = qs("#backMission");
  if (backMission) backMission.onclick = () => { state.phase = "mission"; renderPhase(); };

  qsa(".option").forEach((btn) => {
    btn.onclick = () => {
      state.verdict = btn.dataset.verdict;
      state.reaction = state.test.reactions.options[Number(btn.dataset.index)];
      state.phase = "result";
      renderPhase();
      recordStat(state.test.id, state.verdict);
    };
  });

  const retake = qs("#retake");
  if (retake) retake.onclick = () => { state.phase = "mission"; renderPhase(); };

  const copyLink = qs("#copyLink");
  if (copyLink) copyLink.onclick = copyChallengeLink;

  const downloadCard = qs("#downloadCard");
  if (downloadCard) downloadCard.onclick = downloadShareCard;
}

/* ---------- Local stats (no account needed) ---------- */

function recordStat(testId, verdict) {
  try {
    const stats = JSON.parse(localStorage.getItem("ttl_stats") || "{}");
    stats[testId] = { verdict, at: Date.now(), count: (stats[testId]?.count || 0) + 1 };
    localStorage.setItem("ttl_stats", JSON.stringify(stats));
  } catch (e) { /* storage unavailable — fine */ }
}

/* ---------- Sharing ---------- */

function buildChallengeURL(name) {
  // Point to a pre-rendered share page so social crawlers see a real og:image.
  // Crawlers do not execute JS, so the image must be hardcoded in the HTML.
  const verdict = state.verdict || "complicated";
  const url = new URL(`share/${state.test.id}-${verdict}.html`, location.href);
  url.searchParams.set("from", name || "A friend");
  return url.toString();
}

function copyChallengeLink() {
  const name = window.prompt("Your first name (so they know who challenged them):", "A friend") || "A friend";
  const link = buildChallengeURL(name.trim());
  const v = getVerdict(state.verdict, state.test);
  if (navigator.share) {
    navigator.share({
      title: `${v.label} — ${state.test.name}`,
      text: `I got ${v.label} on ${state.test.name}. ${state.test.share.prompt}`,
      url: link,
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(() => showToast("Link copied — send it to a friend")).catch(() => showToast(link));
  } else {
    window.prompt("Copy this link:", link);
  }
}

function drawShareCard() {
  const canvas = qs("#shareCanvas");
  if (!canvas || !state.test || !state.verdict) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const v = getVerdict(state.verdict, state.test);
  const palette = {
    green: { bg: "#14301f", mid: "#1b3d28", accent: "#4ade80" },
    amber: { bg: "#332810", mid: "#3f3215", accent: "#fbbf24" },
    red: { bg: "#331919", mid: "#3f1f1f", accent: "#f87171" },
  }[v.tone];

  ctx.fillStyle = "#0c0d0f";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = palette.bg;
  ctx.fillRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  ctx.fillStyle = "#a6abb4";
  ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("THE TEST LIBRARY", 62, 92);

  ctx.fillStyle = "#f2f3f5";
  ctx.font = "700 30px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  wrapText(ctx, state.test.name, 62, 150, W - 124, 38, 2);

  ctx.fillStyle = palette.accent;
  ctx.fillRect(62, 250, 90, 4);

  ctx.fillStyle = palette.accent;
  ctx.font = "800 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(v.label, 62, 330);

  ctx.fillStyle = "#f2f3f5";
  ctx.font = "700 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  wrapText(ctx, v.headline, 62, 400, W - 124, 44, 3);

  ctx.fillStyle = "#c9cdd4";
  ctx.font = "400 21px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  wrapText(ctx, truncate(v.description, 150), 62, 510, W - 124, 30, 4);

  ctx.fillStyle = palette.mid;
  ctx.fillRect(28, H - 190, W - 56, 162);

  ctx.fillStyle = "#f2f3f5";
  ctx.font = "600 23px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  wrapText(ctx, state.test.share.kicker, 62, H - 140, W - 124, 30, 2);

  ctx.fillStyle = palette.accent;
  ctx.font = "700 25px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(state.test.share.prompt, 62, H - 58);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = String(text).split(/\s+/);
  let line = "";
  let lineNo = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + " " + words[i] : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineNo * lineHeight);
      line = words[i];
      lineNo++;
      if (lineNo >= maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y + lineNo * lineHeight);
}

function truncate(text, n) {
  return text.length > n ? text.slice(0, n).trim() + "…" : text;
}

function downloadShareCard() {
  const canvas = qs("#shareCanvas");
  if (!canvas) return;
  const a = document.createElement("a");
  a.download = `${state.test.id}-result.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
  showToast("Card saved to your device");
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "test") renderTest();
  else renderHome();
});
