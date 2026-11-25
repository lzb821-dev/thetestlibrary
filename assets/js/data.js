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
          "Gottman called these 'bids for connection' — small reaches for attention, like 'look at that bird'. In his observational studies, couples who stayed together answered about 86% of these bids; couples who later split answered about 33%. The bird was never the point. The turning-toward was. One bid means little, but the ratio over weeks is one of the more reliable signals researchers have.",
      },
      complicated: {
        headline: "They heard you. Just barely.",
        description:
          "Acknowledged, but not explored. One flat 'oh cool' is a bad day, not a diagnosis.",
        science:
          "Gottman's categories are stark — turning toward or turning away — but real life lives in the gray middle. A distracted nod, a half 'mm?', an answer while scrolling: these aren't clean misses or clean hits. Researchers code them by patterns across many bids, not single moments. One flat response is data about a tired Tuesday, not a readout on your relationship.",
      },
      red: {
        headline: "They turned away. That's the signal.",
        description:
          "You reached and nothing came back. One miss isn't a verdict — but notice how it felt.",
        science:
          "Consistently missing bids builds distance over time, Gottman found — not through one big fight, but through hundreds of small unanswered moments. Still, a five-second test is a shaky instrument: stress, noise, and timing all distort it. If this keeps happening, the honest move is to say it out loud. 'I feel ignored when you don't respond' will tell you more than another bird.",
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
          "Acts of service is one of the five love languages described by counselor Gary Chapman: showing care by doing things for someone. The favor here is deliberately tiny — small enough that willingness, not effort, is what you're seeing. Researchers who study everyday care find that these low-cost, high-frequency gestures often predict satisfaction better than rare grand gestures, precisely because they're repeatable.",
      },
      complicated: {
        headline: "Done. With a side of attitude.",
        description:
          "They did it, so the box is ticked. But the sigh is part of the answer too.",
        science:
          "Acts of service only land as care when they're given freely. The exact same task feels warm or cold depending on how it's offered — a quick peel versus a sigh and a peel. Relationship researchers distinguish the act from the attitude around it; recipients read the attitude. One tired sigh is not a pattern, but notice whether the sigh is becoming the usual wrapper.",
      },
      red: {
        headline: "'Do it yourself.' Loud and clear.",
        description:
          "A tiny ask, a flat no. Maybe they're exhausted — but the refusal still tells you something.",
        science:
          "Chapman's framework notes that people express care in different 'languages' — words, time, gifts, touch, or acts of service. When someone consistently resists small requests, acts of service may simply not be how they show up. Before you conclude anything, ask what their language is. A partner who never peels an orange but drives you to the airport at 5am may be speaking loudly in another tongue.",
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
          "Gottman's work found couples who stay together respond to small invitations roughly 86% of the time, versus 33% for couples who split. Play is one of those invitations. Banter isn't the opposite of closeness — for many couples it IS the closeness: a shared joke that says 'we're still us'. Researchers of couples' humor find that playful reframing helps partners move through tension without turning it into a fight.",
      },
      complicated: {
        headline: "They answered. Very literally.",
        description:
          "No joke, no pushback — a serious answer to a nonsense question. Not bad, but you were testing if they'd play.",
        science:
          "Playfulness is contextual. The same person who banters with friends may go literal with a partner when they're tired, guarded, or unsure whether the question is serious. Absurd hypotheticals rely on both people recognizing the frame as play; if one doesn't, the answer turns earnest. One straight answer is data about the moment and the framing — not a verdict on their sense of humor.",
      },
      red: {
        headline: "They rage-quit. Found the bait.",
        description:
          "They took it personally and checked out. Rage bait is built to provoke, so this is partly the test's fault.",
        science:
          "Rage bait is designed to provoke, so a sharp reaction is not a clean read on anyone — the test is partly measuring its own bait. The useful signal is what happens after: can you both laugh about it once the heat passes? Gottman's research on repair attempts found that couples who recover well from small spikes fare far better than couples who never spike at all. Conflict isn't the failure; failed repair is.",
      },
    },
    share: {
      kicker: "I hit my partner with the Rage Bait Questions",
      prompt: "Could yours handle all four?",
    },
  },
  {
    id: "green-line",
    name: "The Green Line Theory",
    category: "Relationship",
    tagline: "Draw a line. Read the power dynamic.",
    hook: "The photo test everyone's arguing about.",
    description:
      "Draw an imaginary green line down each person in a couple photo. Whoever stands straighter is supposedly 'in control'. A body language expert says there's zero science behind it.",
    meta: {
      time: "10 seconds",
      players: "2 people",
      views: "Viral now",
      difficulty: "Easy",
    },
    origin: {
      title: "Where it came from",
      text: "A Twitter dating-advice account claimed straight posture in photos equals dominance. It spread to TikTok and Instagram, and experts have since called it out: one photo can't tell you anything.",
      source: "TikTok & Instagram · green line theory",
    },
    mission: {
      eyebrow: "STEP 1 OF 2 · DO THIS WITH A PHOTO",
      title: "Draw the line.",
      instruction:
        "Pick a normal photo of you two standing. Imagine a green line from each head to the floor.",
      quote: "\"Who's standing straighter?\"",
      tips: [
        "Don't overthink which photo — the first one you find is fine.",
        "Notice who leans toward whom, and how it feels to look at it.",
        "Then remember: it's a photo, not a relationship.",
      ],
      cta: "I drew it. Now what?",
    },
    reactions: {
      eyebrow: "STEP 2 OF 2 · WHAT DID YOU NOTICE?",
      title: "Pick your take.",
      subtitle: "Be honest — this is about the photo, not your partner.",
      options: [
        {
          id: "leanedin",
          label: "They lean toward me — and it feels right",
          hint: "That's what liking looks like, not weakness.",
          verdict: "green",
        },
        {
          id: "straight",
          label: "I'm the straight one. Do I 'lead'?",
          hint: "The theory says yes. Science says no.",
          verdict: "complicated",
        },
        {
          id: "both",
          label: "We're both leaning in",
          hint: "Then the theory just collapsed. Good.",
          verdict: "green",
        },
        {
          id: "awkward",
          label: "It made me weirdly competitive",
          hint: "The theory works. That's the problem with it.",
          verdict: "red",
        },
      ],
    },
    verdicts: {
      green: {
        headline: "You leaned in. So what.",
        description:
          "Leaning toward someone you like is just what liking looks like. There's no 'submissive' here.",
        science:
          "Body language expert Sean Johns told UNILAD there is no study behind the green line theory — it loosely misuses proxemics, the study of how people use physical space. Leaning toward someone you like is ordinary approach behavior, not submission. A single photo is one frame of one moment; real proxemic research looks at how people position themselves over repeated interactions and different settings.",
      },
      complicated: {
        headline: "You bought the line. Literally.",
        description:
          "Fair — it's a sticky idea. But a straight spine in one photo isn't a power dynamic.",
        science:
          "The theory traces to a Twitter dating-advice account, not a research lab. Even its 'proxemics' root studies how space changes across situations, not a frozen camera frame. Posture in a photo reflects a hundred things — shoes, floor, a photographer saying 'stand up straight' — almost none of them about power. It's a sticky idea precisely because it offers certainty from one glance. Certainty that cheap is usually wrong.",
      },
      red: {
        headline: "It got under your skin.",
        description:
          "The theory is built to make you score people. Noticing that is the useful part.",
        science:
          "The green line theory hands people a scorecard for reading relationships from one angle, which is exactly why experts call it out. Its appeal is the promise of a secret signal anyone can decode. If a test makes you size up your partner — or feel sized up — that reaction is worth noticing. A relationship measured by posture is a relationship being turned into a competition, and that's the real red flag here.",
      },
    },
    share: {
      kicker: "I tried the Green Line Theory",
      prompt: "Would yours pass?",
    },
  },
  {
    id: "tell-me",
    name: "Tell Me Without Telling Me",
    category: "Relationship",
    tagline: "Prove it with a detail, not a sentence.",
    hook: "The question that hits different.",
    description:
      "Say 'tell me you love me without telling me you love me'. The answer isn't a phrase — it's a small, specific thing they do only for you.",
    meta: {
      time: "1 minute",
      players: "2 people",
      views: "30M+ views",
      difficulty: "Easy",
    },
    origin: {
      title: "Where it came from",
      text: "A TikTok prompt that became a couple trend: the best answers are actions so specific they couldn't be copied from a greeting card.",
      source: "TikTok · tell me without telling me",
    },
    mission: {
      eyebrow: "STEP 1 OF 2 · ASK THIS OUT LOUD",
      title: "Say the line.",
      instruction: "Look at them and ask, in a normal voice:",
      quote: "\"Tell me you love me without telling me you love me.\"",
      tips: [
        "Let the silence sit. Don't help them out.",
        "Listen for specifics — a habit, a memory, a tiny sacrifice.",
        "Generic answers don't count. That's the whole game.",
      ],
      cta: "I asked. Now what?",
    },
    reactions: {
      eyebrow: "STEP 2 OF 2 · WHAT DID THEY SAY?",
      title: "Pick what happened.",
      subtitle: "Be honest. Nobody sees this but you.",
      options: [
        {
          id: "specific",
          label: "They named a tiny, specific thing",
          hint: "The 5am lunch. The exact gift. That's the answer.",
          verdict: "green",
        },
        {
          id: "action",
          label: "They just did something instead of talking",
          hint: "Showed, didn't tell. Respect.",
          verdict: "green",
        },
        {
          id: "generic",
          label: "They said 'I just do'",
          hint: "Sweet, vague, and not the point.",
          verdict: "complicated",
        },
        {
          id: "joke",
          label: "They made it into a joke",
          hint: "Funny — but dodging is still dodging.",
          verdict: "red",
        },
      ],
    },
    verdicts: {
      green: {
        headline: "They know the small stuff.",
        description:
          "A specific detail beats a thousand 'I love you's. They've been paying attention.",
        science:
          "Gottman's 'love maps' are the detailed knowledge partners hold about each other's inner world — fears, favorites, the story behind a habit. Specific memories and small habits are what those maps are made of; grand gestures barely feature. In couples research, the ability to describe a partner's current worries and dreams predicts closeness better than how often people say 'I love you'. Specificity is the tell.",
      },
      complicated: {
        headline: "Sweet. But vague.",
        description:
          "The feeling is probably real. The answer just didn't give you anything to hold.",
        science:
          "A love map is built from particulars: how someone takes their coffee, what they were scared of at nineteen, which song they skip. Warmth without detail is a start, not the finished picture. Sometimes the vagueness is just performance nerves — being asked to prove love on the spot is awkward. If the specifics consistently aren't there, though, it can mean the map was detailed once and hasn't been updated lately.",
      },
      red: {
        headline: "They dodged it.",
        description:
          "A joke is a clean way out of a sincere question. Once is fine. Watch for a pattern.",
        science:
          "Humor is one of the healthiest ways couples handle tension, so a joke isn't automatically a dodge. But it can be an exit ramp: a clean way to leave a sincere question unanswered without refusing it. The signal isn't one deflection — everyone deflects sometimes. It's whether sincere questions reliably get met with a joke, and whether the person can drop the bit when you ask them to.",
      },
    },
    share: {
      kicker: "I tried 'tell me without telling me'",
      prompt: "What would yours say?",
    },
  },
  {
    id: "dont-laugh",
    name: "The Don't Laugh Challenge",
    category: "Relationship",
    tagline: "One of you breaks. Probably both.",
    hook: "The most viral couple format.",
    description:
      "Try to make each other laugh without speaking. First one to crack loses — and the loser usually laughs hardest.",
    meta: {
      time: "2 minutes",
      players: "2 people",
      views: "50M+ views",
      difficulty: "Easy",
    },
    origin: {
      title: "Where it came from",
      text: "One of the oldest couple formats on TikTok, still everywhere in 2026: inside jokes, faces, and zero words.",
      source: "TikTok · don't laugh challenge",
    },
    mission: {
      eyebrow: "STEP 1 OF 2 · DO THIS IN REAL LIFE",
      title: "Don't make a sound.",
      instruction: "Sit face to face. No talking. Try to make the other person laugh.",
      quote: "\"First one to crack loses.\"",
      tips: [
        "Inside jokes are legal. So are faces.",
        "No touching, no words, no phones.",
        "Whoever laughs first does the dishes. Or not — your call.",
      ],
      cta: "I tried it. Now what?",
    },
    reactions: {
      eyebrow: "STEP 2 OF 2 · WHO CRACKED?",
      title: "Pick what happened.",
      subtitle: "Be honest. Nobody sees this but you.",
      options: [
        {
          id: "both",
          label: "We both lost it instantly",
          hint: "No winner. Best possible outcome.",
          verdict: "green",
        },
        {
          id: "they",
          label: "They cracked first",
          hint: "You've still got it.",
          verdict: "green",
        },
        {
          id: "me",
          label: "I cracked first",
          hint: "Your inside jokes got you. Fair.",
          verdict: "complicated",
        },
        {
          id: "nobody",
          label: "Nobody laughed at all",
          hint: "Commitment to the bit. Respect.",
          verdict: "complicated",
        },
      ],
    },
    verdicts: {
      green: {
        headline: "You can still make them laugh.",
        description:
          "Shared laughter is its own kind of intimacy. Two people who crack each other up are doing something right.",
        science:
          "Couples who laugh together report higher satisfaction in relationship studies. Shared humor isn't a distraction from closeness — it's one of the ways closeness gets built, a private language of timing and inside jokes that no outsider fully gets. Researchers describe it as a form of 'we-ness': small, repeated moments that say we're on the same team. That's why the loser usually laughs hardest.",
      },
      complicated: {
        headline: "One of you held it together.",
        description: "Funny is funny, but someone didn't crack. That's data — not a verdict.",
        science:
          "Playfulness is turn-taking. Sometimes one person is 'on' and the other isn't; energy, mood, and timing all matter, and none of them are stable traits. A round where only one person cracks tells you about that round. Inside jokes also work differently depending on who's in on them. One mismatch is ordinary noise — you'd need many rounds in many moods before a pattern means anything.",
      },
      red: {
        headline: "Not a laughing matter.",
        description: "One test never defines a relationship. But it's worth noticing if fun has gone quiet.",
        science:
          "One failed round means nothing — some people are just disciplined, or tired, or committed to winning. But if playfulness has quietly gone missing from the relationship, that's worth noticing. Researchers treat shared play as a maintenance behavior: something that keeps connection alive between the serious conversations. If the fun has drained out, the better move is to talk about it, not to run another test.",
      },
    },
    share: {
      kicker: "I tried the Don't Laugh Challenge",
      prompt: "Who cracks first with yours?",
    },
  },
  {
    id: "telepathy",
    name: "The Couple Telepathy Test",
    category: "Relationship",
    tagline: "Say it at the same time. No cheating.",
    hook: "How in sync are you, really?",
    description:
      "Answer simple questions at the same time — no discussing. Match on enough of them and the internet calls it telepathy.",
    meta: {
      time: "3 minutes",
      players: "2 people",
      views: "18M+ views",
      difficulty: "Fun",
    },
    origin: {
      title: "Where it came from",
      text: "The 'Who Knows Me Better' and telepathy formats keep resurfacing on TikTok: the thrill is in how often small answers line up.",
      source: "TikTok · couple telepathy test",
    },
    mission: {
      eyebrow: "STEP 1 OF 2 · DO THIS IN REAL LIFE",
      title: "Count to three.",
      instruction: "Ask each question out loud and answer at the same time. No clues.",
      quote: "\"Favorite snack. Dream trip. Their worst habit.\"",
      tips: [
        "Three rounds is enough: snack, movie, dream vacation.",
        "Say your answer out loud on three. No hints beforehand.",
        "Keep score — matches only count if they're exact.",
      ],
      cta: "I played. Now what?",
    },
    reactions: {
      eyebrow: "STEP 2 OF 2 · HOW MANY MATCHED?",
      title: "Pick your score.",
      subtitle: "Three rounds. Be honest.",
      options: [
        {
          id: "all",
          label: "All three matched",
          hint: "Annoyingly in sync. The internet calls this telepathy.",
          verdict: "green",
        },
        {
          id: "two",
          label: "Two matched",
          hint: "Solid. You know the outline and most of the detail.",
          verdict: "green",
        },
        {
          id: "one",
          label: "One matched",
          hint: "One out of three — the small stuff is fuzzy.",
          verdict: "complicated",
        },
        {
          id: "none",
          label: "None matched",
          hint: "Different people, or you've stopped noticing.",
          verdict: "red",
        },
      ],
    },
    verdicts: {
      green: {
        headline: "You're reading the same page.",
        description:
          "Three for three isn't magic. It's a lot of ordinary attention paid over a long time.",
        science:
          "Gottman's 'love maps' are built from the small details partners accumulate about each other over time. High overlap on everyday preferences — snack, movie, dream trip — is one sign those maps are detailed and current. Researchers caution that agreement can also come from shared background, so it isn't proof of intimacy on its own. Still, knowing what someone would pick before they say it is a form of attention you can't fake.",
      },
      complicated: {
        headline: "You know the outline.",
        description: "Two out of three — the big picture is there, the specifics are hit or miss.",
        science:
          "Love maps go stale when people stop asking small questions. A few misses on everyday preferences is normal — most people can't reliably guess a partner's favorite snack, and that's not a crisis. What matters is curiosity: people who keep updating their map tend to stay accurate. Treat a miss as an invitation to ask, not evidence of distance. The question 'why that one?' is often better than the right answer.",
      },
      red: {
        headline: "You're guessing.",
        description: "Zero matches on easy questions is worth a conversation — not a conclusion.",
        science:
          "Telepathy tests are entertainment, not assessment — three easy questions have no diagnostic power. But consistently missing the basics is a useful nudge. Research on closeness suggests the gap isn't usually about caring less; it's about stopping the small daily check-ins that keep knowledge current. If you can't guess the easy things, ask directly instead of assuming. Assuming is where most of these gaps come from.",
      },
    },
    share: {
      kicker: "I tried the Couple Telepathy Test",
      prompt: "How many would yours get?",
    },
  },
  {
    id: "finger-down",
    name: "Put a Finger Down: Couples",
    category: "Relationship",
    tagline: "One finger per guilty truth.",
    hook: "The 2026 confession trend.",
    description:
      "Read the statements out loud. Put a finger down for each one that's true. By the end, you'll know exactly how much you've hidden.",
    meta: {
      time: "2 minutes",
      players: "2 people",
      views: "25M+ views",
      difficulty: "Spicy",
    },
    origin: {
      title: "Where it came from",
      text: "Put-a-finger-down exploded in early 2026, and the couples edition turned it into a confession game.",
      source: "TikTok · put a finger down couples",
    },
    mission: {
      eyebrow: "STEP 1 OF 2 · DO THIS IN REAL LIFE",
      title: "Read them out.",
      instruction: "Take turns. One reads, both put a finger down if it's true.",
      quote: "\"Put a finger down if you've faked being asleep to dodge a talk.\"",
      tips: [
        "Try: stalked their ex, knew within a month, cried over them.",
        "No explaining. A finger down is the whole answer.",
        "Count how many fingers you each put down at the end.",
      ],
      cta: "I played. Now what?",
    },
    reactions: {
      eyebrow: "STEP 2 OF 2 · HOW DID IT GO?",
      title: "Pick what happened.",
      subtitle: "Be honest. Nobody sees this but you.",
      options: [
        {
          id: "laughed",
          label: "We laughed and confessed to everything",
          hint: "Full fingers down. Zero shame.",
          verdict: "green",
        },
        {
          id: "few",
          label: "A couple of fingers, nothing serious",
          hint: "Normal. Everyone has a few.",
          verdict: "green",
        },
        {
          id: "them",
          label: "They put down more than me",
          hint: "Now you have questions. Fair.",
          verdict: "complicated",
        },
        {
          id: "silent",
          label: "We didn't want to play",
          hint: "Avoiding the game is also an answer.",
          verdict: "red",
        },
      ],
    },
    verdicts: {
      green: {
        headline: "Nothing to hide. Apparently.",
        description:
          "Fingers down and laughter is the best case. You can both be silly about what you'd normally hide.",
        science:
          "Self-disclosure — sharing small, slightly embarrassing truths — is one way closeness builds. Psychologists describe a 'disclosure reciprocity' effect: when one person shares something vulnerable, the other often shares back, and the exchange deepens the connection. A game like this makes disclosure playful instead of heavy, lowering the cost of saying the quiet part out loud. Laughter is the wrapper that makes it safe.",
      },
      complicated: {
        headline: "You kept a few back.",
        description: "Not every finger goes down. That's allowed — some things are yours.",
        science:
          "Privacy inside a relationship is normal and healthy; closeness does not require total disclosure. A low finger count doesn't mean distance — it might mean you're selective about what you confess in a game, or that some answers are nobody's business. Researchers distinguish chosen privacy from avoidance by how it feels: boundaries you choose feel calm, while things you're hiding tend to feel heavy. One is fine; the other is worth a conversation.",
      },
      red: {
        headline: "You didn't want to play.",
        description: "Declining is a choice too. It doesn't prove anything — but notice why.",
        science:
          "Avoidance isn't always about a person — the format can feel corny, invasive, or just badly timed. But if certain questions felt too loaded even as a game, that's information. Researchers note that topics people joke about are often topics they haven't fully talked about. A refusal to play is a choice, not proof of anything. The useful follow-up isn't another test — it's 'which one made you not want to answer?'",
      },
    },
    share: {
      kicker: "I played Put a Finger Down: Couples",
      prompt: "How many would yours put down?",
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
