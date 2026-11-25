/*
 * Cloudflare Web Analytics beacon — opt-in via site.config.js
 *
 * Reads SITE_CONFIG.analytics.cfToken. If no token is set, does nothing.
 * This means the site stays cookieless and zero-third-party until the
 * owner configures analytics, with no code changes required.
 *
 * Cloudflare's beacon is privacy-first: no cookies, no fingerprinting,
 * no cross-site user tracking. Token is not a secret (client-side value).
 */
(function () {
  "use strict";

  var cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
  var token = cfg && cfg.analytics && cfg.analytics.cfToken;
  token = typeof token === "string" ? token.trim() : "";

  // Cloudflare tokens are 32-char hex; accept a reasonable range so a
  // copy/paste with whitespace still works but obvious junk is ignored.
  if (!/^[0-9a-f]{24,40}$/i.test(token)) return;

  // Avoid double-counting if the beacon is already present.
  if (document.querySelector('script[data-cf-beacon]')) return;

  var s = document.createElement("script");
  s.type = "module"; // Cloudflare now requires this to skip EOL browsers
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.async = true;
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: token }));
  (document.head || document.body).appendChild(s);
})();
