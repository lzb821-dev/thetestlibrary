/*
 * Central site configuration — the ONLY place to put account IDs / tokens.
 *
 * Browser: loaded as a plain script, SITE_CONFIG becomes a global.
 * Node:    require('./assets/js/site.config.js') returns the same object.
 *
 * Both fields are intentionally EMPTY right now. Fill them in when the
 * accounts exist, then run the affected generator(s):
 *   - adsense.pubId   -> node scripts/generate-ads-txt.js
 *   - analytics.cfToken -> no rebuild needed, analytics.js reads it live
 */

var SITE_CONFIG = {
  // Google AdSense publisher ID, format: pub-1234567890123456
  // Find it in AdSense dashboard (looks like ca-pub-XXXX in the ad code; drop the "ca-").
  adsense: {
    pubId: "",
  },

  // Cloudflare Web Analytics site token (32-char hex).
  // Cloudflare dashboard -> Web Analytics -> Add a site -> Manage site -> token.
  // Not a secret: safe to ship in client-side code.
  analytics: {
    cfToken: "",
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}
