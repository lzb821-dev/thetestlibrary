/*
 * The Test Library — Green or Red (duo mode)
 * Two phones, no backend. Person A's answers are encoded into the challenge
 * URL; person B guesses; the verdict unlocks only after both have submitted.
 * Vanilla JS, no build step. Loaded by duo.html and share/duo-*.html.
 */

const dQs = (sel, root = document) => root.querySelector(sel);
const dEsc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));
const dParam = (name) => new URLSearchParams(location.search).get(name);

function dToast(msg) {
  let t = dQs("#dtoast");
  if (!t) {
    t = document.createElement("div");
    t.id = "dtoast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- URL-safe payload (unicode safe, no TextEncoder dependency) ---------- */

function dEncode(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function dDecode(str) {
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

const dState = {
  mode: "create",     // create | challenge
  phase: "intro",     // intro | subject | created | guess | result
  nameA: "",
  nameB: "",
  answers: [],        // A's answers, indexes into question options
  guesses: [],        // B's guesses
  qIndex: 0,
  challenge: null,    // decoded payload from ?c=
};

function dCleanName(name, fallback) {
  const s = String(name || "").trim().replace(/[<>]/g, "").slice(0, 24);
  return s || fallback;
}

function dGuessPrompt(name) {
  return `What would ${name} pick?`;
}

/* ---------- Rendering ---------- */

function dRender() {
  const root = dQs("#app");
  if (!root) return;
  let html = `<a class="back-link" href="index.html">← All tests</a>`;

  if (dState.mode === "challenge" && dState.challenge && dState.phase !== "result") {
    html += `<div class="challenge-banner"><strong>${dEsc(dState.challenge.n)}</strong> challenged you. Think you know them?</div>`;
  }

  if (dState.phase === "intro") html += dIntro();
  if (dState.phase === "subject") html += dQuestionPhase(false);
  if (dState.phase === "created") html += dCreated();
  if (dState.phase === "guess") html += dQuestionPhase(true);
  if (dState.phase === "result") html += dResult();

  root.innerHTML = html;
  dBind();
  if (dState.phase === "result") dDrawCard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function dHero(extra = "") {
  return `
    <div class="test-hero">
      <div class="eyebrow">TWO-PLAYER TEST</div>
      <h1>${dEsc(DUO.name)}</h1>
      <div class="tagline">${dEsc(DUO.tagline)}</div>
      <p class="description">${dEsc(DUO.description)}</p>
      <div class="meta-row">
        <span class="chip">◷ 3 min</span>
        <span class="chip">◉ 2 people</span>
        <span class="chip hot">${dEsc(DUO.hook)}</span>
      </div>
    </div>${extra}`;
}

function dIntro() {
  return `${dHero()}
    <div class="step-label">STEP 1 OF 2 · PLAY YOURSELF</div>
    <div class="step-title">Answer six questions about you.</div>
    <p class="step-desc">Be honest. Your answers get locked into a link — your friend only sees them after they guess.</p>
    <label class="field-label" for="dNameA">Your first name</label>
    <input id="dNameA" class="name-field" type="text" maxlength="24" placeholder="Alex" autocomplete="given-name">
    <button class="btn btn-primary" id="dStart">Create my test →</button>
    <div class="origin">
      <h3>How it works</h3>
      <p>Send the link to someone you think knows you. They answer the same six questions about you. The verdict unlocks only when both of you have played.</p>
      <div class="source">No sign-up · no account · no answers shared until the end</div>
    </div>`;
}

function dQuestionPhase(isGuess) {
  const q = DUO.questions[dState.qIndex];
  const name = dState.challenge ? dState.challenge.n : dState.nameA;
  const prompt = isGuess ? dGuessPrompt(name) : q.prompt;
  const total = DUO.questions.length;

  return `${dHero()}
    <div class="progress-head">
      <div class="step-label">${isGuess ? "STEP 2 OF 2 · THEIR TURN" : "STEP 1 OF 2 · YOUR TURN"}</div>
      <span>${dState.qIndex + 1} / ${total}</span>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${((dState.qIndex) / total) * 100}%"></div></div>
    <div class="duo-question">${dEsc(prompt)}</div>
    <div class="option-list">
      ${q.options.map((opt, i) => `
        <button class="option" data-choice="${i}">
          <span class="option-dot"></span>
          <span class="option-body">${dEsc(opt)}</span>
        </button>
      `).join("")}
    </div>
    ${dState.qIndex > 0 ? `<button class="btn btn-ghost" id="dBack">← Previous question</button>` : ""}`;
}

function dCreated() {
  const link = dChallengeURL();
  return `${dHero()}
    <div class="result-card green">
      <div class="verdict-label">READY TO SEND</div>
      <div class="result-headline">Your answers are locked in.</div>
      <p class="result-desc">Send this link to someone who thinks they know you. They can't see your answers until they've guessed all six.</p>
    </div>
    <div class="action-stack">
      <button class="btn btn-primary" id="dCopyChallenge">Copy challenge link ↗</button>
    </div>
    <div class="share-preview">
      <div class="share-preview-label">The link they'll open</div>
      <div class="link-box">${dEsc(link)}</div>
      <p class="link-hint">Works in WhatsApp, Instagram DM, iMessage — anywhere.</p>
    </div>
    <div class="origin">
      <h3>What happens next</h3>
      <p>They answer six questions about you. When both sides are in, the verdict — and your answers — unlock for both of you.</p>
    </div>
    <p class="disclaimer">For fun, not a diagnosis. The Test Library · thetestlibrary.app</p>`;
}

function dResult() {
  const verdictId = dState.verdictId || duoVerdictFor(dState.matches);
  const v = getDuoVerdict(verdictId);
  const total = DUO.questions.length;

  return `${dHero()}
    <div class="step-label">THE VERDICT</div>
    <div class="score-row">
      <div class="score-ring" style="--score-accent:${v.tone === "green" ? "var(--green)" : v.tone === "amber" ? "var(--amber)" : "var(--red)"}">
        <div class="score-num">${dState.matches}<span>/${total}</span></div>
        <div class="score-cap">MATCHES</div>
      </div>
      <div class="score-side">
        <div class="score-names">${dEsc(dState.nameA)} <span>×</span> ${dEsc(dState.nameB)}</div>
        <div class="score-sub">${dState.matches === total ? "A perfect read." : dState.matches === 0 ? "Not one." : `${total - dState.matches} missed.`}</div>
      </div>
    </div>
    <div class="result-card ${dEsc(v.tone)}">
      <div class="verdict-label">${dEsc(v.label)}</div>
      <div class="result-headline">${dEsc(v.headline)}</div>
      <p class="result-desc">${dEsc(v.description)}</p>
    </div>
    <div class="breakdown">
      <div class="breakdown-head">Every answer, side by side</div>
      ${dBreakdownRows()}
    </div>
    <div class="science-note">
      <h3>The research behind it</h3>
      <p>${dEsc(v.science)}</p>
    </div>
    <div class="action-stack">
      <button class="btn btn-primary" id="dCopyResult">Copy result link ↗</button>
      <button class="btn" id="dDownloadCard">Save result card ⤓</button>
    </div>
    <div class="share-preview">
      <div class="share-preview-label">Your share card</div>
      <canvas id="dShareCanvas" width="600" height="750"></canvas>
    </div>
    <div class="action-stack">
      <a class="btn btn-ghost" href="duo.html">Create your own test →</a>
      <a class="btn btn-ghost" href="index.html">Browse all tests</a>
    </div>
    <p class="disclaimer">For fun, not a diagnosis. Six questions never define a relationship.<br>The Test Library · thetestlibrary.app</p>`;
}

function dBreakdownRows() {
  return DUO.questions.map((q, i) => {
    const a = dState.answers[i];
    const g = dState.guesses[i];
    const hit = a === g;
    return `
      <div class="breakdown-row">
        <div class="bd-q">${dEsc(q.prompt)}</div>
        <div class="bd-answers">
          <div class="bd-a ${hit ? "hit" : ""}"><span>${dEsc(dState.nameA)}</span>${dEsc(q.options[a] ?? "—")}</div>
          <div class="bd-a ${hit ? "hit" : "miss"}"><span>${dEsc(dState.nameB)} guessed</span>${dEsc(q.options[g] ?? "—")}</div>
        </div>
        <div class="bd-mark ${hit ? "hit" : "miss"}">${hit ? "✓" : "✕"}</div>
      </div>`;
  }).join("");
}

/* ---------- Links ---------- */

function dChallengeURL() {
  const payload = dEncode({ v: 1, n: dState.nameA, a: dState.answers });
  const url = new URL("duo.html", location.href);
  url.searchParams.set("c", payload);
  return url.toString();
}

function dResultURL() {
  const verdictId = dState.verdictId || duoVerdictFor(dState.matches);
  const payload = dEncode({
    v: 1,
    a1: dState.nameA,
    a2: dState.nameB,
    ans: dState.answers,
    gue: dState.guesses,
    m: dState.matches,
  });
  const url = new URL(`share/duo-${verdictId}.html`, location.href);
  url.searchParams.set("d", payload);
  return url.toString();
}

function dCopyLink(which) {
  const link = which === "challenge" ? dChallengeURL() : dResultURL();
  const text = which === "challenge"
    ? `${dState.nameA} challenged you on Green or Red. Think you know them?`
    : `${dState.nameA} × ${dState.nameB} got ${dState.matches}/${DUO.questions.length} on Green or Red.`;
  if (navigator.share) {
    navigator.share({ title: "Green or Red — The Test Library", text, url: link }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(link)
      .then(() => dToast("Link copied — send it to them"))
      .catch(() => dToast(link));
  } else {
    window.prompt("Copy this link:", link);
  }
}

/* ---------- Events ---------- */

function dBind() {
  const start = dQs("#dStart");
  if (start) start.onclick = () => {
    const input = dQs("#dNameA");
    dState.nameA = dCleanName(input && input.value, "A friend");
    dState.phase = "subject";
    dState.qIndex = 0;
    dState.answers = [];
    dRender();
  };

  const nameAInput = dQs("#dNameA");
  if (nameAInput) nameAInput.onkeydown = (e) => { if (e.key === "Enter" && start) start.click(); };

  qsaChoices().forEach((btn) => {
    btn.onclick = () => {
      const choice = Number(btn.dataset.choice);
      if (dState.mode === "challenge") {
        dState.guesses[dState.qIndex] = choice;
      } else {
        dState.answers[dState.qIndex] = choice;
      }
      if (dState.qIndex < DUO.questions.length - 1) {
        dState.qIndex++;
        dRender();
      } else {
        dFinish();
      }
    };
  });

  const back = dQs("#dBack");
  if (back) back.onclick = () => {
    dState.qIndex--;
    dRender();
  };

  const copyChallenge = dQs("#dCopyChallenge");
  if (copyChallenge) copyChallenge.onclick = () => dCopyLink("challenge");

  const copyResult = dQs("#dCopyResult");
  if (copyResult) copyResult.onclick = () => dCopyLink("result");

  const download = dQs("#dDownloadCard");
  if (download) download.onclick = () => {
    const canvas = dQs("#dShareCanvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "green-or-red-result.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    dToast("Card saved to your device");
  };
}

function qsaChoices() {
  return Array.from(document.querySelectorAll(".option[data-choice]"));
}

function dFinish() {
  if (dState.mode === "challenge") {
    const answers = dState.challenge.a || [];
    dState.matches = DUO.questions.reduce(
      (n, _q, i) => n + (answers[i] === dState.guesses[i] ? 1 : 0), 0
    );
    dState.answers = answers;
    dState.verdictId = duoVerdictFor(dState.matches);
    dState.phase = "result";
    dRender();
    try {
      const stats = JSON.parse(localStorage.getItem("ttl_duo") || "{}");
      stats.plays = (stats.plays || 0) + 1;
      stats.last = dState.verdictId;
      localStorage.setItem("ttl_duo", JSON.stringify(stats));
    } catch (e) { /* storage unavailable — fine */ }
  } else {
    dState.phase = "created";
    dRender();
  }
}

/* ---------- Share card ---------- */

function dWrap(ctx, text, x, y, maxW, lineH, maxLines) {
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

function dDrawCard() {
  const canvas = dQs("#dShareCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const v = getDuoVerdict(dState.verdictId);
  const palette = {
    green: { bg: "#14301f", accent: "#4ade80" },
    amber: { bg: "#332810", accent: "#fbbf24" },
    red: { bg: "#331919", accent: "#f87171" },
  }[v.tone];

  ctx.fillStyle = "#0c0d0f";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  ctx.fillStyle = palette.accent;
  ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("THE TEST LIBRARY", 62, 92);

  ctx.fillStyle = "#f2f3f5";
  ctx.font = "750 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("GREEN OR RED", 62, 152);

  ctx.fillStyle = palette.accent;
  ctx.font = "800 92px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`${dState.matches}/${DUO.questions.length}`, 62, 280);
  ctx.fillStyle = "#a6abb4";
  ctx.font = "700 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("MATCHES", 62, 318);

  ctx.fillStyle = palette.accent;
  ctx.fillRect(62, 356, 90, 4);

  ctx.fillStyle = palette.accent;
  ctx.font = "800 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(v.label, 62, 430);

  ctx.fillStyle = "#f2f3f5";
  ctx.font = "700 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  dWrap(ctx, v.headline, 62, 486, W - 124, 40, 2);

  ctx.fillStyle = "#c9cdd4";
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`${dState.nameA}  ×  ${dState.nameB}`, 62, H - 118);

  ctx.fillStyle = palette.accent;
  ctx.font = "700 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(DUO.share.prompt, 62, H - 62);
}

/* ---------- Share landing page (pre-rendered, data from ?d=) ---------- */

function dRenderSharePage() {
  const root = dQs("#duoShare");
  if (!root) return;
  const data = dDecode(dParam("d"));
  if (!data || !Array.isArray(data.ans) || !Array.isArray(data.gue)) {
    root.innerHTML = `
      <div class="result-card green">
        <div class="result-headline">Think you know someone?</div>
        <p class="result-desc">${dEsc(DUO.description)}</p>
      </div>
      <div class="action-stack"><a class="btn btn-primary" href="../duo.html">Create your own test →</a></div>`;
    return;
  }

  dState.nameA = dCleanName(data.a1, "A friend");
  dState.nameB = dCleanName(data.a2, "A friend");
  dState.answers = data.ans;
  dState.guesses = data.gue;
  dState.matches = typeof data.m === "number" ? data.m : DUO.questions.reduce(
    (n, _q, i) => n + (data.ans[i] === data.gue[i] ? 1 : 0), 0
  );
  dState.verdictId = duoVerdictFor(dState.matches);
  const v = getDuoVerdict(dState.verdictId);

  root.innerHTML = `
    <div class="score-row">
      <div class="score-ring" style="--score-accent:${v.tone === "green" ? "var(--green)" : v.tone === "amber" ? "var(--amber)" : "var(--red)"}">
        <div class="score-num">${dState.matches}<span>/${DUO.questions.length}</span></div>
        <div class="score-cap">MATCHES</div>
      </div>
      <div class="score-side">
        <div class="score-names">${dEsc(dState.nameA)} <span>×</span> ${dEsc(dState.nameB)}</div>
        <div class="score-sub">Green or Red</div>
      </div>
    </div>
    <div class="result-card ${dEsc(v.tone)}">
      <div class="verdict-label">${dEsc(v.label)}</div>
      <div class="result-headline">${dEsc(v.headline)}</div>
      <p class="result-desc">${dEsc(v.description)}</p>
    </div>
    <div class="breakdown">
      <div class="breakdown-head">Every answer, side by side</div>
      ${dBreakdownRows()}
    </div>
    <div class="action-stack">
      <a class="btn btn-primary" id="dOwn" href="../duo.html">Create your own test →</a>
      <a class="btn btn-ghost" href="../index.html">Browse all tests</a>
    </div>
    <p class="disclaimer">For fun, not a diagnosis. The Test Library · thetestlibrary.app</p>`;
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "duo-share") {
    dRenderSharePage();
    return;
  }
  if (page !== "duo") return;

  const challenge = dDecode(dParam("c"));
  if (challenge && challenge.v === 1 && Array.isArray(challenge.a)) {
    dState.mode = "challenge";
    dState.challenge = challenge;
    dState.nameA = dCleanName(challenge.n, "A friend");
    dState.nameB = "A friend";
    dState.phase = "intro";
    // Challenge mode skips straight to B's name, then to the guessing questions.
    dQs("#app").innerHTML = `${dHero(`
      <div class="challenge-banner"><strong>${dEsc(dState.nameA)}</strong> challenged you. Think you know them?</div>`)}
      <div class="step-label">STEP 2 OF 2 · YOUR TURN</div>
      <div class="step-title">Answer six questions about ${dEsc(dState.nameA)}.</div>
      <p class="step-desc">You can't see their answers yet. Guess what they picked — the verdict unlocks when you're done.</p>
      <label class="field-label" for="dNameB">Your first name</label>
      <input id="dNameB" class="name-field" type="text" maxlength="24" placeholder="Sam" autocomplete="given-name">
      <button class="btn btn-primary" id="dStartGuess">Start guessing →</button>`;
    const go = dQs("#dStartGuess");
    if (go) go.onclick = () => {
      const input = dQs("#dNameB");
      dState.nameB = dCleanName(input && input.value, "A friend");
      dState.phase = "guess";
      dState.qIndex = 0;
      dState.guesses = [];
      dRender();
    };
    const input = dQs("#dNameB");
    if (input) input.onkeydown = (e) => { if (e.key === "Enter" && go) go.click(); };
    return;
  }

  dState.mode = "create";
  dRender();
});
