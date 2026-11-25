/*
 * The Test Library — test data
 * Add a new test by appending one object to TESTS.
 * Every verdict id must exist in VERDICTS.
 */

// Global verdicts supply label + tone (shared visual language) and a neutral
// fallback. Individual tests override headline / description / science with
// copy that fits their own theme. See each test's `verdicts` map.
const VERDICTS = {
  green: {
    label: "GREEN FLAG",
    tone: "green",
    headline: "A good sign.",
    description:
      "Your answer suggests they engaged with you in a small, real way.",
    science:
      "In long-term relationships, small moments of attention matter more than big declarations.",
  },
  complicated: {
    label: "IT'S COMPLICATED",
    tone: "amber",
    headline: "Hard to read.",
    description:
      "One moment gives you a hint, not a verdict. Context matters more than you'd think.",
    science:
      "Psychologists warn against judging a relationship from a single incident. Look for patterns.",
  },
  red: {
    label: "RED FLAG",
    tone: "red",
    headline: "Worth noticing.",
    description:
      "That one stung. But a single moment isn't the whole story — look for patterns, not snapshots.",
    science:
      "Consistent patterns, not isolated moments, are what relationship research actually measures.",
  },
};

const TESTS = [
  {
    id: "bird-theory",
    name: "The Bird Theory",
    category: "Relationship",
    tagline: "Say one sentence. Watch what happens.",
    hook: "The 5-second test taking over TikTok.",
    description:
      "Casually tell your partner you saw a bird today. Then stop talking. Whether they ask a follow-up question is supposedly a window into your whole relationship.",
    meta: {
      time: "5 seconds",
      players: "2 people",
      views: "56M+ views",
      difficulty: "Easy",
    },
    origin: {
      title: "Where it came from",
      text: "Relationship researcher John Gottman called small requests for attention 'bids for connection'. TikTok turned his research into a one-sentence test.",
      source: "Gottman Institute · bids for connection",
    },
    mission: {
      eyebrow: "STEP 1 OF 2 · DO THIS IN REAL LIFE",
      title: "Drop the line.",
      instruction:
        "Find a quiet moment. Say to your partner, in a completely normal voice:",
      quote: "I saw a bird today.",
      tips: [
        "Do not point. Do not show a photo. Do not add context.",
        "Then stop talking. Count to five in your head.",
        "Notice what they do next — that is the entire test.",
      ],
      cta: "I said it. Now what?",
    },
    reactions: {
      eyebrow: "STEP 2 OF 2 · WHAT DID THEY DO?",
      title: "Pick what happened.",
      subtitle: "Be honest. Nobody sees this but you.",
      options: [
        {
          id: "followup",
          label: "They asked a follow-up question",
          hint: "\"What kind?\" \"Where did you see it?\" \"Was it big?\"",
          verdict: "green",
        },
        {
          id: "deadbird",
          label: "They asked if the bird was dead",
          hint: "Yes, this still counts. Curiosity is curiosity.",
          verdict: "green",
        },
        {
          id: "movedon",
          label: "They said \"oh cool\" and moved on",
          hint: "Acknowledged, but did not lean in.",
          verdict: "complicated",
        },
        {
          id: "ignored",
          label: "They ignored me or changed the subject",
          hint: "Ouch. One moment, though — not the whole story.",
          verdict: "red",
        },
      ],
    },
    verdicts: {
      green: {
        headline: "They turned toward you.",
        description:
          "You made a tiny bid and they picked it up. That follow-up question is the whole test.",
        science:
          "Gottman called these 'bids for connection' — small reaches for attention. Couples who stayed together answered about 86% of the time; couples who split, about 33%. The bird was never the point. The turning-toward was.",
      },
      complicated: {
        headline: "They heard you. Just barely.",
        description:
          "Acknowledged, but not explored. One flat 'oh cool' is a bad day, not a diagnosis.",
        science:
          "Gottman's extremes are clear — turning toward or turning away. Real life is mostly the gray middle: a half-response, a distracted nod. One gray moment tells you almost nothing.",
      },
      red: {
        headline: "They turned away. That's the signal.",
        description:
          "You reached and nothing came back. One miss isn't a verdict — but notice how it felt.",
        science:
          "Consistently missing bids builds distance over time, Gottman found. But a five-second test is a shaky measure. If this keeps happening, the honest move is to say it out loud, not run another test.",
      },
    },
    share: {
      kicker: "I tried the Bird Theory on my partner",
      prompt: "What would yours do?",
    },
  },
  {
    id: "orange-peel",
    name: "The Orange Peel Theory",
    category: "Relationship",
    tagline: "Ask for the smallest favor. Watch what happens.",
    hook: "Acts of service, stripped down to one orange.",
    description:
      "Ask your partner to peel an orange for you — something you could easily do yourself. The orange is not the point. Their response is.",
    meta: {
      time: "30 seconds",
      players: "2 people",
      views: "12M+ views",
      difficulty: "Easy",
    },
    origin: {
      title: "Where it came from",
      text: "TikTok creator @annabhamm named the trend: a partner doing a small act of service you are fully capable of doing yourself.",
      source: "TikTok · @annabhamm",
    },
    mission: {
      eyebrow: "STEP 1 OF 2 · DO THIS IN REAL LIFE",
      title: "Ask for the orange.",
      instruction:
        "Hold an orange. Ask your partner, in your normal voice:",
      quote: "Can you peel this for me?",
      tips: [
        "Do not explain why. Do not say it is a test.",
        "Ask like you would ask for a glass of water.",
        "Watch what they do — and how they do it.",
      ],
      cta: "I asked. Now what?",
    },
    reactions: {
      eyebrow: "STEP 2 OF 2 · WHAT DID THEY DO?",
      title: "Pick what happened.",
      subtitle: "Be honest. Nobody sees this but you.",
      options: [
        {
          id: "nohesitation",
          label: "They peeled it without hesitation",
          hint: "No question, no commentary. Just did it.",
          verdict: "green",
        },
        {
          id: "extras",
          label: "They peeled it and asked if you wanted a snack too",
          hint: "Went one step further than asked.",
          verdict: "green",
        },
        {
          id: "complained",
          label: "They did it, but made a comment",
          hint: "\"Really?\" — with a sigh. Mixed signal.",
          verdict: "complicated",
        },
        {
          id: "refused",
          label: "They said \"do it yourself\"",
          hint: "A clear answer, just not a warm one.",
          verdict: "red",
        },
      ],
    },
    verdicts: {
      green: {
        headline: "They'd do the small things.",
        description:
          "No hesitation, no scorekeeping. They did it because you asked — that's the tell.",
        science:
          "Acts of service is one of the five love languages: showing care by doing things for someone. The favor here is deliberately tiny — small enough that willingness, not effort, is what you're seeing.",
      },
      complicated: {
        headline: "Done. With a side of attitude.",
        description:
          "They did it, so the box is ticked. But the sigh is part of the answer too.",
        science:
          "Acts of service only land as care when they're given freely. The same task feels warm or cold depending entirely on how it's offered — and one tired sigh is not a pattern.",
      },
      red: {
        headline: "'Do it yourself.' Loud and clear.",
        description:
          "A tiny ask, a flat no. Maybe they're exhausted — but the refusal still tells you something.",
        science:
          "Researchers of the five love languages note that when someone consistently resists small requests, acts of service may simply not be how they express care. Ask what their language is before you conclude anything.",
      },
    },
    share: {
      kicker: "I tried the Orange Peel Theory on my partner",
      prompt: "What would yours do?",
    },
  },
  {
    id: "rage-bait",
    name: "The Rage Bait Questions",
    category: "Relationship",
    tagline: "Four impossible questions. One very real reaction.",
    hook: "The trend the internet cannot stop arguing about.",
    description:
      "Ask your partner four ridiculous hypotheticals. The point is not the answer — it is the reaction. And the comments section.",
    meta: {
      time: "2 minutes",
      players: "2 people",
      views: "9M+ views",
      difficulty: "Spicy",
    },
    origin: {
      title: "Where it came from",
      text: "A wave of TikTok couples asking deliberately unanswerable questions. The fun is in the follow-up, not the first answer.",
      source: "TikTok · rage bait questions",
    },
    mission: {
      eyebrow: "STEP 1 OF 2 · DO THIS IN REAL LIFE",
      title: "Ask all four.",
      instruction: "Read these out loud, one at a time. Do not explain them.",
      quote:
        "\"Would you rather kiss someone else for $10 million, or me for $10?\"",
      tips: [
        "Then: \"Do you love me because I'm pretty, or think I'm pretty because you love me?\"",
        "Then: \"Would you be attracted to my identical sister?\"",
        "Then: \"Would you rather never have met me, or cheat on me right now?\"",
      ],
      cta: "I asked all four. Now what?",
    },
    reactions: {
      eyebrow: "STEP 2 OF 2 · HOW DID THEY HANDLE IT?",
      title: "Pick what happened.",
      subtitle: "Be honest. Nobody sees this but you.",
      options: [
        {
          id: "playedalong",
          label: "They played along and made it funny",
          hint: "Got the joke. Kept the mood light.",
          verdict: "green",
        },
        {
          id: "thoughtful",
          label: "They took it seriously and tried to answer",
          hint: "Sweet, a little confused, fully committed.",
          verdict: "green",
        },
        {
          id: "annoyed",
          label: "They got annoyed by the third question",
          hint: "Fair. Four in a row is a lot.",
          verdict: "complicated",
        },
        {
          id: "walkedoff",
          label: "They walked off",
          hint: "Rage bait works. Sometimes too well.",
          verdict: "red",
        },
      ],
    },
    // Rage Bait is about playfulness, not connection bids — so it overrides
    // the three verdicts' headline / description / science. Labels & tone stay shared.
    verdicts: {
      green: {
        headline: "They can take a joke. Rare.",
        description:
          "They played along instead of taking offense. That's playfulness — and couples who can be silly together tend to last.",
        science:
          "Gottman's research on bids for connection found couples who stay together respond to each other's small invitations about 86% of the time, vs 33% for couples who split. Play is one of those invitations. Banter isn't the opposite of closeness — for a lot of couples, it IS the closeness.",
      },
      complicated: {
        headline: "They answered. Very literally.",
        description:
          "No joke, no pushback — a serious answer to a nonsense question. Not bad, but you were testing if they'd play.",
        science:
          "Playfulness is contextual: the same person who banters with friends may go literal with a partner when tired or guarded. One straight answer is data about the moment, not the relationship.",
      },
      red: {
        headline: "They rage-quit. Found the bait.",
        description:
          "They took it personally and checked out. Rage bait is built to provoke, so this is partly the test's fault.",
        science:
          "Rage bait is designed to provoke, so a sharp reaction isn't a clean read on anyone. The useful signal is what happens after: can you both laugh about it? Couples who repair well after tension fare far better than couples who never spike at all.",
      },
    },
    share: {
      kicker: "I hit my partner with the Rage Bait Questions",
      prompt: "Could yours handle all four?",
    },
  },
];

function getTest(id) {
  return TESTS.find((test) => test.id === id) || null;
}

// A test can override any verdict field via its own `verdicts` map.
// Fields not overridden fall back to the global VERDICTS entry.
function getVerdict(id, test) {
  const base = VERDICTS[id] || VERDICTS.complicated;
  const custom = test && test.verdicts && test.verdicts[id];
  return custom ? { ...base, ...custom } : base;
}

/* ---------- Duo mode: Green or Red ----------
 * Two people, two phones. Person A answers about themselves; their answers
 * travel inside the challenge URL (base64url), so no backend is needed.
 * Person B guesses. The verdict unlocks only after both sides have played.
 */
const DUO = {
  id: "green-or-red",
  name: "Green or Red",
  tagline: "Two phones. Six questions. One verdict.",
  hook: "Do you actually know them?",
  description:
    "One of you answers six questions about yourself. The other has to guess. The verdict only unlocks when both of you have played — and it is usually humbling.",
  share: {
    kicker: "We tried Green or Red",
    prompt: "Think you know someone? Test them.",
  },
  questions: [
    {
      id: "battery",
      prompt: "Your phone hits 2%. You…",
      options: ["Stare at the wall", "Text 'bye' to everyone", "Hunt for a charger like it's a mission"],
    },
    {
      id: "snack",
      prompt: "It's 3am and you're hungry. You…",
      options: ["Cereal over the sink", "Wake someone up for snacks", "Ignore it and go to bed"],
    },
    {
      id: "compliment",
      prompt: "Someone compliments you. You…",
      options: ["Deflect with a joke", "Say thanks and mean it", "Overthink it for a week"],
    },
    {
      id: "groupchat",
      prompt: "The group chat explodes. You…",
      options: ["Read all, reply to none", "Reply to every single one", "Mute and check back later"],
    },
    {
      id: "plan",
      prompt: "Plans change last minute. You…",
      options: ["Secretly relieved", "Annoyed but say nothing", "Ask a hundred questions"],
    },
    {
      id: "roadtrip",
      prompt: "On a road trip, you…",
      options: ["Control the playlist", "Sleep the whole way", "Be the snack curator"],
    },
  ],
  verdicts: {
    green: {
      headline: "You know them. Scarily well.",
      description:
        "Five out of six. You didn't guess — you just know. That's the kind of attention no test needs to prove.",
      science:
        "Gottman calls the detailed knowledge partners hold about each other 'love maps' — knowing someone's inner world, not just their schedule. Couples with richer love maps handle conflict and drift better. You clearly have one.",
    },
    complicated: {
      headline: "Close. You know the outline.",
      description:
        "You got the big stuff. The small, specific things are where the guessing starts — and that's exactly what a love map is made of.",
      science:
        "Love maps are built from ordinary details: how someone reacts at 3am, what they do with a dying phone. Getting the outline right is a start. The margins take time — and paying attention.",
    },
    red: {
      headline: "You're guessing. Loudly.",
      description:
        "Two or fewer. Either you don't know them that well, or you're testing the wrong person. Both are worth knowing.",
      science:
        "Six questions is a snapshot, not a scorecard. But if you consistently miss the small things, that's a signal worth acting on — ask them, don't test them.",
    },
  },
};

function duoVerdictFor(matches) {
  if (matches >= 5) return "green";
  if (matches >= 3) return "complicated";
  return "red";
}

function getDuoVerdict(id) {
  return { ...getVerdict(id, null), ...(DUO.verdicts[id] || {}) };
}

/* ---------- C mode: Aura Score ----------
 * Content-led, daily-question format built on the "aura points" meme
 * (100M+ TikTok posts). Users read a real-life scenario, guess whether it
 * raises or drains someone's aura, then see the internet's verdict + score.
 */
const AURA_TIERS = [
  {
    id: "legendary", min: 70, label: "MAIN CHARACTER", tone: "gold",
    headline: "This is aura farming.",
    description: "Not just good — cinematic. People would replay this moment in their head.",
  },
  {
    id: "positive", min: 30, label: "CLEAN AURA", tone: "green",
    headline: "Clean. Unbothered. Respect.",
    description: "Quietly impressive. The room noticed and nobody said anything.",
  },
  {
    id: "neutral", min: -29, label: "NEUTRAL AURA", tone: "amber",
    headline: "The aura equivalent of a shrug.",
    description: "Nothing gained, nothing lost. Perfectly average, which is not an insult.",
  },
  {
    id: "negative", min: -69, label: "AURA DRAIN", tone: "orange",
    headline: "The room got colder.",
    description: "A small, specific kind of cringe. Everyone felt it and nobody mentioned it.",
  },
  {
    id: "criminal", min: -100, label: "NEGATIVE AURA", tone: "red",
    headline: "This is a whole red flag.",
    description: "Not a momentary lapse — a personality. The aura did not just drop, it left.",
  },
];

const AURA_SCENARIOS = [
  {
    id: "skydiving",
    text: "He skydived over the Empire State Building and still answered his text.",
    score: -47,
    why: "Being somewhere extraordinary and choosing the group chat is a choice. The sky was doing a lot and he ignored it.",
  },
  {
    id: "flowchart",
    text: "She sent 'sorry I'm late' and then a two-paragraph explanation with a flowchart.",
    score: 34,
    why: "Overcommitted? Absolutely. But the flowchart is a commitment to the bit, and the internet respects commitment.",
  },
  {
    id: "door",
    text: "He held the door open, then mentioned it for the rest of the evening.",
    score: -12,
    why: "The act was fine. The receipt is the problem. Aura cannot be collected like a loyalty point.",
  },
  {
    id: "ordering",
    text: "They ordered for the whole table without asking and got every single order right.",
    score: 86,
    why: "Audacious, and then correct. Main character energy without the usual main character downside.",
  },
  {
    id: "circleback",
    text: "He said 'let's circle back on this' in a text to his own brother.",
    score: -64,
    why: "Some aura never recovers from a corporate voice note. The brother probably screenshotted it.",
  },
  {
    id: "toast",
    text: "She posted a photo of her burnt toast with the caption 'breakfast is served'.",
    score: 45,
    why: "Unbothered in the face of evidence. Turning a small failure into a bit is a rare, quiet skill.",
  },
  {
    id: "moving",
    text: "He agreed to help a friend move and showed up with a truck and six other people.",
    score: 96,
    why: "Over-delivering with no announcement is the purest form of aura. He probably said 'no worries' too.",
  },
  {
    id: "ghosted",
    text: "She ghosted for three weeks, then replied 'lol just saw this'.",
    score: -88,
    why: "The 'lol' is doing serious damage here. This is not a drop in aura — it is an eviction.",
  },
  {
    id: "suit",
    text: "He wore a full suit to casual Friday and said 'I like to be prepared'.",
    score: 22,
    why: "Unshakeable confidence, slightly misaligned with the dress code. The nerve earns points.",
  },
  {
    id: "meeting",
    text: "They let an obviously wrong answer stand so a colleague wouldn't be embarrassed.",
    score: 79,
    why: "Nobody saw the sacrifice, which is exactly why it counts. Quiet nobility is high-aura behaviour.",
  },
];

function auraTierFor(score) {
  return AURA_TIERS.find((tier) => score >= tier.min) || AURA_TIERS[AURA_TIERS.length - 1];
}

function getAuraTier(id) {
  return AURA_TIERS.find((tier) => tier.id === id) || AURA_TIERS[2];
}
