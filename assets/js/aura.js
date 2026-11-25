/*
 * The Test Library — Aura Score
 * A light, content-led daily format. Read a scenario, guess if it gains or
 * drains aura, see the internet's score. No backend; share state travels in
 * the URL. Loaded by aura.html and share/aura-*.html.
 */

const aQs = (sel, root = document) => root.querySelector(sel);
const aEsc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));
const aParam = (name) => new URLSearchParams(location.search).get(name);

const AURA_TONE_COLORS = {
  gold: "#fbbf24",
  green: "#4ade80",
  amber: "#fbbf24",
  orange: "#fb923c",
  red: "#f87171",
};

function aToast(msg) {
  let t = aQs("#atoast");
  if (!t) {
    t = document.createElement("div");
    t.id = "atoast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2400);
}

function aEncode(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function aDecode(str) {
  if (!str) return null;
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch (e) {
    return null;
  }
}

/* ---------- State ---------- */

const ROUND_SIZE = 5;
const aState = {
  phase: "intro",   // intro | question | reveal | summary
  queue: [],
  qIndex: 0,
  guesses: [],
  hits: 0,
  daily: false,
  single: false,
};

function aDailyIndex() {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.now() - start) / 86400000);
  return ((day % AURA_SCENARIOS.length) + AURA_SCENARIOS.length) % AURA_SCENARIOS.length;
}

function aDirectionFor(score) {
  if (score >= 30) return "up";
  if (score <= -30) return "down";
  return "flat";
}

function aFormattedScore(score) {
  return score > 0 ? `+${score}` : String(score);
}

/* ---------- Rendering ---------- */

function aRender() {
  const root = aQs("#app");
  if (!root) return;
  let html = `<a class="back-link" href="index.html">← All tests</a>`;

  if (aState.phase === "intro") html += aIntro();
  if (aState.phase === "question") html += aQuestion();
  if (aState.phase === "reveal") html += aReveal();
  if (aState.phase === "summary") html += aSummary();

  root.innerHTML = html;
  aBind();
  if (aState.phase === "reveal" || aState.phase === "summary") aDrawCard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function aHero() {
  return `
    <div class="test-hero">
      <div class="eyebrow">DAILY AURA CHECK · CONTENT MODE</div>
      <h1>Aura Score</h1>
      <div class="tagline">Read the room. Rate the vibe.</div>
      <p class="description">Someone did something. Did their aura go up, down, or nowhere? Guess first — then see the score the internet would give it.</p>
      <div class="meta-row">
        <span class="chip">◷ 5 sec</span>
        <span class="chip">◉ 1 player</span>
        <span class="chip hot">100M+ aura posts</span>
      </div>
    </div>`;
}

function aIntro() {
  const daily = AURA_SCENARIOS[aDailyIndex()];
  return `${aHero()}
    <div class="step-label">TODAY'S SCENARIO</div>
    <div class="aura-daily-card">
      <div class="aura-daily-quote">${aEsc(daily.text)}</div>
      <div class="aura-daily-meta">One scenario. One guess. Updated daily.</div>
      <button class="btn btn-primary" id="aDailyBtn">Rate today's aura →</button>
    </div>
    <div class="aura-or"><span>or</span></div>
    <button class="btn" id="aRoundBtn">Play a 5-scenario round →</button>
    <p class="aura-fineprint">Five quick calls, then a verdict on how well you read a room.</p>
    <div class="section-head aura-library-head">
      <h2>Scenario library</h2>
      <span>${AURA_SCENARIOS.length} scenes</span>
    </div>
    <div class="aura-scene-list">
      ${AURA_SCENARIOS.map((s, i) => `
        <button class="aura-scene" data-scene="${i}">
          <span class="aura-scene-num">${String(i + 1).padStart(2, "0")}</span>
          <span>${aEsc(s.text)}</span>
          <span class="aura-scene-arrow">→</span>
        </button>
      `).join("")}
    </div>
    <div class="origin">
      <h3>What is aura?</h3>
      <p>"Aura points" is the internet's running joke about social energy — you gain them for effortless, unbothered moves and lose them for cringe. Aura farming even made Reuters' 2025 word-of-the-year shortlist.</p>
      <div class="source">For entertainment only · no actual aura was harmed</div>
    </div>`;
}

function aQuestion() {
  const s = AURA_SCENARIOS[aState.queue[aState.qIndex]];
  const total = aState.daily || aState.single ? 1 : ROUND_SIZE;
  const label = aState.daily ? "TODAY'S AURA" : aState.single ? "SINGLE SCENARIO" : "READ THE ROOM";
  return `${aHero()}
    <div class="progress-head">
      <div class="step-label">${label}</div>
      <span>${aState.daily || aState.single ? "1 / 1" : `${aState.qIndex + 1} / ${total}`}</span>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${(aState.qIndex / total) * 100}%"></div></div>
    <div class="aura-scenario">${aEsc(s.text)}</div>
    <p class="aura-prompt">Does this gain or drain their aura?</p>
    <div class="aura-guesses">
      <button class="aura-guess up" data-guess="up"><span>+ AURA</span><small>They gained status</small></button>
      <button class="aura-guess flat" data-guess="flat"><span>≈ NO CHANGE</span><small>Neutral move</small></button>
      <button class="aura-guess down" data-guess="down"><span>− AURA</span><small>Cringe detected</small></button>
    </div>`;
}

function aReveal() {
  const s = AURA_SCENARIOS[aState.queue[aState.qIndex]];
  const tier = auraTierFor(s.score);
  const guess = aState.guesses[aState.qIndex];
  const correct = guess === aDirectionFor(s.score);
  const isLast = aState.daily || aState.single || aState.qIndex === ROUND_SIZE - 1;

  return `${aHero()}
    <div class="step-label">THE AURA VERDICT</div>
    <div class="aura-result" style="--aura:${AURA_TONE_COLORS[tier.tone]}">
      <div class="aura-score-big">${aFormattedScore(s.score)}</div>
      <div class="aura-tier">${aEsc(tier.label)}</div>
      <div class="aura-headline">${aEsc(tier.headline)}</div>
      <p class="aura-why">${aEsc(s.why)}</p>
    </div>
    <div class="aura-call ${correct ? "hit" : "miss"}">
      <span class="aura-call-mark">${correct ? "✓" : "✕"}</span>
      <div><strong>${correct ? "You called it." : "You missed it."}</strong><br>The internet says ${aFormattedScore(s.score)} aura.</div>
    </div>
    <div class="action-stack">
      <button class="btn btn-primary" id="aCopyResult">Copy result link ↗</button>
      <button class="btn" id="aDownloadCard">Save aura card ⤓</button>
    </div>
    <div class="share-preview">
      <div class="share-preview-label">Your share card</div>
      <canvas id="aShareCanvas" width="600" height="750"></canvas>
    </div>
    <div class="action-stack">
      <button class="btn btn-ghost" id="aNext">${isLast ? (aState.daily || aState.single ? "Back to Aura Score" : "See your reading →") : "Next scenario →"}</button>
      <a class="btn btn-ghost" href="aura.html">Aura Score home</a>
    </div>
    <p class="disclaimer">For fun, not a diagnosis. Aura is a joke, not a metric.<br>The Test Library · thetestlibrary.app</p>`;
}

function aSummaryHeading(hits) {
  if (hits === ROUND_SIZE) return "You read the room perfectly.";
  if (hits >= 3) return "You have decent aura radar.";
  if (hits >= 1) return "The room is a bit confusing.";
  return "You have no idea what aura is.";
}

function aSummary() {
  return `${aHero()}
    <div class="step-label">YOUR AURA READING</div>
    <div class="result-card ${aState.hits >= 3 ? "green" : aState.hits >= 1 ? "amber" : "red"}">
      <div class="verdict-label">${aState.hits}/${ROUND_SIZE} CORRECT</div>
      <div class="result-headline">${aEsc(aSummaryHeading(aState.hits))}</div>
      <p class="result-desc">${aState.hits === ROUND_SIZE
        ? "Five for five. You can walk into any room and immediately tell who has the energy. Respect."
        : "Aura is subjective by design — that's the joke. Share your card and see if your friends read it differently."}</p>
    </div>
    <div class="breakdown">
      <div class="breakdown-head">Your calls</div>
      ${aState.queue.map((idx, i) => {
        const s = AURA_SCENARIOS[idx];
        const correct = aState.guesses[i] === aDirectionFor(s.score);
        const labels = { up: "GAIN", flat: "NEUTRAL", down: "DRAIN" };
        return `<div class="breakdown-row">
          <div class="bd-q">${aEsc(s.text)}</div>
          <div class="bd-answers"><div class="bd-a ${correct ? "hit" : "miss"}">You said ${labels[aState.guesses[i]]} · actual ${aFormattedScore(s.score)}</div></div>
          <div class="bd-mark ${correct ? "hit" : "miss"}">${correct ? "✓" : "✕"}</div>
        </div>`;
      }).join("")}
    </div>
    <div class="action-stack">
      <button class="btn btn-primary" id="aCopySummary">Copy your result ↗</button>
      <button class="btn" id="aDownloadCard">Save result card ⤓</button>
    </div>
    <div class="share-preview">
      <div class="share-preview-label">Your share card</div>
      <canvas id="aShareCanvas" width="600" height="750"></canvas>
    </div>
    <div class="action-stack">
      <button class="btn btn-ghost" id="aAgain">Play another round →</button>
      <a class="btn btn-ghost" href="aura.html">Aura Score home</a>
    </div>
    <p class="disclaimer">For fun, not a diagnosis. The Test Library · thetestlibrary.app</p>`;
}

/* ---------- Events ---------- */

function aBind() {
  const daily = aQs("#aDailyBtn");
  if (daily) daily.onclick = () => aStartRound([aDailyIndex()], true, false);

  const round = aQs("#aRoundBtn");
  if (round) round.onclick = () => {
    const idx = AURA_SCENARIOS.map((_s, i) => i).sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
    aStartRound(idx, false, false);
  };

  aQsAll("[data-scene]").forEach((btn) => {
    btn.onclick = () => aStartRound([Number(btn.dataset.scene)], false, true);
  });

  aQsAll("[data-guess]").forEach((btn) => {
    btn.onclick = () => {
      aState.guesses[aState.qIndex] = btn.dataset.guess;
      const s = AURA_SCENARIOS[aState.queue[aState.qIndex]];
      if (btn.dataset.guess === aDirectionFor(s.score)) aState.hits++;
      aState.phase = "reveal";
      aRender();
    };
  });

  const next = aQs("#aNext");
  if (next) next.onclick = () => {
    if (aState.daily || aState.single) {
      aState.phase = "intro";
      aRender();
    } else if (aState.qIndex < ROUND_SIZE - 1) {
      aState.qIndex++;
      aState.phase = "question";
      aRender();
    } else {
      aState.phase = "summary";
      aRender();
    }
  };

  const copyResult = aQs("#aCopyResult");
  if (copyResult) copyResult.onclick = aCopyLink;
  const copySummary = aQs("#aCopySummary");
  if (copySummary) copySummary.onclick = aCopyLink;

  const download = aQs("#aDownloadCard");
  if (download) download.onclick = () => {
    const canvas = aQs("#aShareCanvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "aura-score.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    aToast("Card saved to your device");
  };

  const again = aQs("#aAgain");
  if (again) again.onclick = () => {
    const idx = AURA_SCENARIOS.map((_s, i) => i).sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
    aStartRound(idx, false, false);
  };
}

function aQsAll(sel) {
  return Array.from(document.querySelectorAll(sel));
}

function aStartRound(queue, daily, single) {
  aState.queue = queue;
  aState.daily = daily;
  aState.single = single;
  aState.qIndex = 0;
  aState.guesses = [];
  aState.hits = 0;
  aState.phase = "question";
  aRender();
}

/* ---------- Sharing ---------- */

function aCurrentScenario() {
  if (aState.phase === "summary") return null;
  return AURA_SCENARIOS[aState.queue[aState.qIndex]];
}

function aSharePayload() {
  const s = aCurrentScenario();
  return {
    v: 1,
    s: s ? aState.queue[aState.qIndex] : 0,
    h: aState.hits,
    n: aState.daily || aState.single ? 1 : ROUND_SIZE,
    sm: aState.phase === "summary" ? 1 : 0,
  };
}

function aShareURL() {
  const s = aCurrentScenario();
  const score = aState.phase === "summary" ? Math.round((aState.hits / ROUND_SIZE) * 100) : (s ? s.score : 0);
  const tier = auraTierFor(score);
  const payload = aEncode(aSharePayload());
  const url = new URL(`share/aura-${tier.id}.html`, location.href);
  url.searchParams.set("d", payload);
  return url.toString();
}

function aCopyLink() {
  const link = aShareURL();
  const s = aCurrentScenario();
  const text = s
    ? `This is ${aFormattedScore(s.score)} aura. What would you give it?`
    : `I got ${aState.hits}/${ROUND_SIZE} on Aura Score. Can you read the room?`;
  if (navigator.share) {
    navigator.share({ title: "Aura Score — The Test Library", text, url: link }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(link)
      .then(() => aToast("Link copied — send it to someone"))
      .catch(() => aToast(link));
  } else {
    window.prompt("Copy this link:", link);
  }
}

/* ---------- Share card ---------- */

function aWrap(ctx, text, x, y, maxW, lineH, maxLines) {
  const words = String(text).split(/\s+/);
  let line = "", n = 0;
  for (let i = 0; i < words.length; i++) {
    const t = line ? line + " " + words[i] : words[i];
    if (ctx.measureText(t).width > maxW && line) {
      ctx.fillText(line, x, y + n * lineH);
      line = words[i]; n++;
      if (n >= maxLines - 1) break;
    } else line = t;
  }
  if (line) ctx.fillText(line, x, y + n * lineH);
}

function aDrawCard() {
  const canvas = aQs("#aShareCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const summary = aState.phase === "summary";
  const s = aCurrentScenario();
  const score = summary ? Math.round((aState.hits / ROUND_SIZE) * 100) : (s ? s.score : 0);
  const tier = auraTierFor(score);
  const accent = AURA_TONE_COLORS[tier.tone];

  ctx.fillStyle = "#0c0d0f";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#16181c";
  ctx.fillRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  ctx.fillStyle = accent;
  ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("THE TEST LIBRARY", 62, 92);

  ctx.fillStyle = "#f2f3f5";
  ctx.font = "750 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("AURA SCORE", 62, 152);

  ctx.fillStyle = accent;
  ctx.font = "800 96px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(summary ? `${aState.hits}/${ROUND_SIZE}` : aFormattedScore(score), 62, 282);

  ctx.fillStyle = "#a6abb4";
  ctx.font = "700 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(summary ? "SCENARIOS READ CORRECTLY" : "AURA POINTS", 62, 322);

  ctx.fillStyle = accent;
  ctx.fillRect(62, 356, 90, 4);

  ctx.fillStyle = accent;
  ctx.font = "800 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(summary ? aSummaryHeading(aState.hits).toUpperCase().slice(0, 28) : tier.label, 62, 430);

  ctx.fillStyle = "#f2f3f5";
  ctx.font = "600 23px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  if (summary) {
    aWrap(ctx, "Can you read the room better?", 62, 490, W - 124, 32, 3);
  } else {
    aWrap(ctx, s ? s.text : "", 62, 490, W - 124, 32, 3);
  }

  ctx.fillStyle = "#c9cdd4";
  ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  aWrap(ctx, "Rate the vibe. Read the room.", 62, H - 108, W - 124, 28, 2);

  ctx.fillStyle = accent;
  ctx.font = "700 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("thetestlibrary.app/aura.html", 62, H - 48);
}

/* ---------- Share landing page ---------- */

function aRenderSharePage() {
  const root = aQs("#auraShare");
  if (!root) return;
  const data = aDecode(aParam("d"));
  if (!data || data.v !== 1 || typeof data.s !== "number" || !AURA_SCENARIOS[data.s]) {
    root.innerHTML = `
      <div class="result-card green">
        <div class="result-headline">Rate the vibe. Read the room.</div>
        <p class="result-desc">Someone did something. Did their aura go up, down, or nowhere? Guess first, then see the score.</p>
      </div>
      <div class="action-stack"><a class="btn btn-primary" href="../aura.html">Try Aura Score →</a></div>`;
    return;
  }

  const s = AURA_SCENARIOS[data.s];
  const tier = auraTierFor(s.score);
  if (data.sm) {
    root.innerHTML = `
      <div class="result-card ${data.h >= 3 ? "green" : data.h >= 1 ? "amber" : "red"}">
        <div class="verdict-label">${data.h}/${data.n} CORRECT</div>
        <div class="result-headline">${aEsc(aSummaryHeading(data.h))}</div>
        <p class="result-desc">Can you read the room better than they did?</p>
      </div>
      <div class="action-stack"><a class="btn btn-primary" id="aOwn" href="../aura.html">Try Aura Score →</a></div>`;
    return;
  }
  root.innerHTML = `
    <div class="aura-result" style="--aura:${AURA_TONE_COLORS[tier.tone]}">
      <div class="aura-score-big">${aFormattedScore(s.score)}</div>
      <div class="aura-tier">${aEsc(tier.label)}</div>
      <div class="aura-headline">${aEsc(tier.headline)}</div>
      <p class="aura-why">${aEsc(s.why)}</p>
    </div>
    <div class="science-note">
      <h3>The scenario</h3>
      <p>${aEsc(s.text)}</p>
    </div>
    <div class="action-stack"><a class="btn btn-primary" id="aOwn" href="../aura.html">Rate the next one →</a></div>`;
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "aura-share") {
    aRenderSharePage();
    return;
  }
  if (page !== "aura") return;

  const scene = aDecode(aParam("s"));
  if (scene && scene.v === 1 && typeof scene.i === "number" && AURA_SCENARIOS[scene.i]) {
    aStartRound([scene.i], false, true);
    return;
  }
  aState.phase = "intro";
  aRender();
});
