// Stick Fighter Z — game content: fighters, costumes, weapons, modes

const STAT_KEYS = ["power", "speed", "defense"];

const RARITY = {
  common:    { label: "COMMON",    color: "#a8a096" },
  rare:      { label: "RARE",      color: "#3a9aff" },
  epic:      { label: "EPIC",      color: "#b45aff" },
  legendary: { label: "LEGENDARY", color: "#ffb030" },
};

const FIGHTERS = [
  {
    id: "kuro", name: "KURO", title: "The Crimson Wind", style: "BALANCED",
    desc: "A wandering duelist who reads every opponent like an open scroll. Strong at any range.",
    special: "Gale Palm", specialDesc: "A rushing palm strike that knocks foes off their feet.",
    stats: { power: 70, speed: 78, defense: 62 },
    look: { head: "#f3ead8", stroke: "#141012", eye: "#141012", iris: "#d8242a", mouth: "transparent", bg: "#3a1414",
            scarf: "#c42222", scarfDark: "#8e1418", trim: "#f0a020" },
  },
  {
    id: "shiro", name: "SHIRO", title: "Shadow of the Void", style: "SPEED",
    desc: "Moves between heartbeats. Fragile, but almost impossible to pin down.",
    special: "Phantom Step", specialDesc: "Blink behind the enemy and strike from the shadows.",
    stats: { power: 55, speed: 96, defense: 44 },
    look: { head: "#141418", stroke: "#2ad8ff", eye: "#2ad8ff", iris: "#ffffff", mouth: "#2ad8ff", bg: "#0c1a24",
            scarf: "#1a9ed0", scarfDark: "#0c5a80", trim: "#bff4ff" },
  },
  {
    id: "akai", name: "AKAI", title: "The Golden Fist", style: "POWER",
    desc: "A temple guardian whose blows can crack stone pillars. Slow to start, brutal to finish.",
    special: "Sun Breaker", specialDesc: "A charged overhead smash that shatters any guard.",
    stats: { power: 94, speed: 52, defense: 76 },
    look: { head: "#f6eee2", stroke: "#2a0a0c", eye: "#2a0a0c", iris: "#ff2a2a", mouth: "transparent", bg: "#2a1a10",
            scarf: "#e0a020", scarfDark: "#9a6a10", trim: "#fff0a0" },
  },
  {
    id: "raijin", name: "RAIJIN", title: "Storm Caller", style: "TECHNIQUE", unlockLevel: 12,
    desc: "A legend spoken of in the mountain villages. Some say lightning follows wherever he walks.",
    special: "Thunder Drop", specialDesc: "Leap skyward and crash down in a bolt of lightning.",
    stats: { power: 82, speed: 84, defense: 58 },
    look: { head: "#e8ecf6", stroke: "#1a1430", eye: "#1a1430", iris: "#8a6aff", mouth: "transparent", bg: "#16102a",
            scarf: "#6a4aff", scarfDark: "#3a2a9a", trim: "#d8ccff" },
  },
];

const COSTUMES = [
  { id: "default", name: "Signature", rarity: "common", price: null,
    desc: "The fighter's own colors, worn on a hundred battlefields." },
  { id: "shadow", name: "Shadow Garb", rarity: "rare", price: null,
    desc: "Night-black wraps and a cloth mask. Silence is a weapon.",
    palette: { scarf: "#2a2a30", scarfDark: "#141418", trim: "#8a5aff", cape: "#1e1e24", wrap: "#3a3a44" },
    accessory: `<path d="M152 100 Q214 92 276 100 Q270 128 214 140 Q158 128 152 100 Z" fill="#26262c" />
                <path d="M160 104 Q214 98 268 104" stroke="#3a3a44" stroke-width="3" fill="none" />` },
  { id: "sakura", name: "Sakura Bloom", rarity: "rare", price: { coins: 600 },
    desc: "Spring silks in blossom pink. Beautiful, and deadly.",
    palette: { scarf: "#f06a9a", scarfDark: "#b03a68", trim: "#fff0f6", cape: "#f2e6ea", wrap: "#e8c8d4" },
    accessory: `<path d="M152 50 Q214 36 276 50 L274 62 Q214 48 154 62 Z" fill="#f06a9a" />
                <g fill="#ffd6e6"><circle cx="270" cy="44" r="8" /><circle cx="282" cy="52" r="8" /><circle cx="278" cy="64" r="8" /><circle cx="264" cy="62" r="8" /><circle cx="260" cy="50" r="8" /></g>
                <circle cx="271" cy="54" r="5" fill="#f2c040" />` },
  { id: "ronin", name: "Wandering Ronin", rarity: "epic", price: { coins: 900 },
    desc: "A straw hat and road-worn cloth. No master, no mercy.",
    palette: { scarf: "#6a4a30", scarfDark: "#3a2a1a", trim: "#d0a060", cape: "#8a7a60", wrap: "#a08a6a" },
    accessory: `<path d="M110 46 L214 2 L318 46 Q214 64 110 46 Z" fill="#c8a060" stroke="#6a4a20" stroke-width="4" stroke-linejoin="round" />
                <path d="M150 40 L214 12 L278 40" stroke="#a07a40" stroke-width="3" fill="none" />
                <path d="M164 50 Q214 60 264 50" stroke="#6a4a20" stroke-width="3" fill="none" />` },
  { id: "oni", name: "Oni Warlord", rarity: "epic", price: { gems: 30 },
    desc: "Horned helm of a demon general. Fear arrives before you do.",
    palette: { scarf: "#1a1012", scarfDark: "#000000", trim: "#ff3030", cape: "#3a0c10", wrap: "#5a1418" },
    accessory: `<path d="M168 30 Q146 8 150 -18 Q166 6 188 20 Z" fill="#efe6d4" stroke="#141012" stroke-width="3" />
                <path d="M260 30 Q282 8 278 -18 Q262 6 240 20 Z" fill="#efe6d4" stroke="#141012" stroke-width="3" />
                <path d="M196 50 L214 40 L232 50" stroke="#c42222" stroke-width="4" fill="none" />` },
  { id: "emperor", name: "Golden Emperor", rarity: "legendary", price: { gems: 60 },
    desc: "Robes of the Sun Throne. Only the undefeated may wear them.",
    palette: { scarf: "#f2c040", scarfDark: "#b08010", trim: "#fff6c0", cape: "#f6f0e0", wrap: "#e8d8b0" },
    accessory: `<path d="M170 24 L178 -8 L196 12 L214 -14 L232 12 L250 -8 L258 24 Q214 12 170 24 Z" fill="#f2c040" stroke="#8a6010" stroke-width="3" stroke-linejoin="round" />
                <circle cx="214" cy="12" r="6" fill="#d8242a" /><circle cx="186" cy="16" r="4" fill="#2a7fe0" /><circle cx="242" cy="16" r="4" fill="#2a7fe0" />` },
];

// Weapons are drawn along the +x axis in local coordinates; `place` positions them on the fighter's back.
const WEAPONS = [
  { id: "fists", name: "Bare Fists", rarity: "common", price: null, bonus: { speed: 4 },
    desc: "Wrapped knuckles and pure technique. Fastest combo chains.",
    place: "", view: "-50 -45 100 90", svg: "",
    icon: `<rect x="-30" y="-22" width="60" height="46" rx="14" fill="#141012" />
           <rect x="-16" y="-34" width="30" height="18" rx="7" fill="#141012" />
           <path d="M-30 -6 H30 M-30 8 H30" stroke="#cfc2ae" stroke-width="6" />` },
  { id: "katana", name: "Red Katana", rarity: "rare", price: null, bonus: { power: 6, speed: 4 },
    desc: "A balanced blade with a crimson-wrapped grip.",
    place: "translate(140 120) rotate(62)", view: "-10 -30 330 60",
    svg: `<rect x="0" y="-6" width="64" height="12" rx="3" fill="#1a1414" />
          <path d="M8 -6 L16 6 M20 -6 L28 6 M32 -6 L40 6 M44 -6 L52 6" stroke="#c42222" stroke-width="3" />
          <ellipse cx="68" cy="0" rx="5" ry="14" fill="#d0a030" />
          <path d="M72 -5 L290 -8 Q300 -6 306 0 L72 5 Z" fill="#dfe6ee" />
          <path d="M74 -1 L296 -3" stroke="#ffffff" stroke-width="1.5" opacity="0.8" />` },
  { id: "bo", name: "Oak Bo Staff", rarity: "common", price: { coins: 500 }, bonus: { defense: 8, power: 2 },
    desc: "Long reach and solid guarding. Keeps enemies at bay.",
    place: "translate(118 88) rotate(62)", view: "-10 -20 400 40",
    svg: `<rect x="0" y="-5" width="380" height="10" rx="5" fill="#8a5a30" />
          <rect x="0" y="-6" width="26" height="12" rx="4" fill="#b8b8c0" />
          <rect x="354" y="-6" width="26" height="12" rx="4" fill="#b8b8c0" />
          <path d="M170 -5 V5 M180 -5 V5 M190 -5 V5 M200 -5 V5" stroke="#c42222" stroke-width="4" />` },
  { id: "daggers", name: "Twin Fangs", rarity: "rare", price: { coins: 800 }, bonus: { speed: 10 },
    desc: "Paired daggers for relentless, close-range flurries.",
    place: "translate(214 300)", view: "-90 -50 180 100",
    svg: [28, 152].map((a) => `
          <g transform="rotate(${a})">
            <rect x="-74" y="-5" width="36" height="10" rx="3" fill="#1a1414" />
            <rect x="-40" y="-11" width="6" height="22" rx="2" fill="#d0a030" />
            <path d="M-34 -6 L60 -2 L74 0 L60 2 L-34 6 Z" fill="#dfe6ee" />
          </g>`).join("") },
  { id: "kusarigama", name: "Kusarigama", rarity: "epic", price: { coins: 1200 }, bonus: { power: 6, speed: 6 },
    desc: "Sickle and weighted chain. Strike from where they least expect.",
    place: "translate(150 150) rotate(62)", view: "-60 -50 260 230",
    svg: `<path d="M0 0 Q-40 40 -10 90 Q20 140 -30 170" stroke="#8a8a96" stroke-width="4" stroke-dasharray="6 4" fill="none" />
          <circle cx="-30" cy="172" r="10" fill="#3a3a44" />
          <rect x="0" y="-5" width="112" height="10" rx="4" fill="#6a4020" />
          <path d="M104 -6 Q150 -44 194 -12 Q150 -26 112 6 Z" fill="#dfe6ee" stroke="#8a8a96" stroke-width="1.5" />` },
  { id: "dragon", name: "Dragon Fang", rarity: "legendary", price: { gems: 50 }, bonus: { power: 14, defense: 4 },
    desc: "Forged in a volcano's heart. The blade never stops burning.",
    place: "translate(132 108) rotate(62)", view: "-10 -40 360 80",
    svg: `<path d="M80 -14 L300 -10 L340 0 L300 10 L80 14 Z" fill="#ff7040" opacity="0.6" filter="url(#wGlow)" />
          <rect x="0" y="-7" width="66" height="14" rx="3" fill="#2a1a0a" />
          <path d="M6 -7 L14 7 M20 -7 L28 7 M34 -7 L42 7 M48 -7 L56 7" stroke="#f2c040" stroke-width="3" />
          <path d="M66 -22 Q80 -6 76 0 Q80 6 66 22 L84 10 L84 -10 Z" fill="#f2c040" stroke="#8a6010" stroke-width="2" />
          <path d="M82 -12 L300 -9 L340 0 L300 9 L82 12 Z" fill="url(#dragonGrad)" />
          <path d="M90 0 L320 0" stroke="#fff4c0" stroke-width="2" opacity="0.9" />` },
];

const MODES = {
  story: {
    eyebrow: "CHAPTER 1", title: "WASTELAND FRONTIER", subtitle: "CANYON DUEL",
    stars: 2, reward: 120, challenge: "Land 3 perfect dodges", done: 0, goal: 3,
    location: "DESERT CANYON",
    enemy: { name: "RONIN BANDIT", sub: "CHAPTER 1 BOSS", head: "#d8c8b0", stroke: "#1a1010", eye: "#1a1010", iris: "#ff8a20", scarf: "#5a4a42", bg: "#2a2020", mask: true },
  },
  versus: {
    eyebrow: "RANKED ARENA", title: "TEMPLE GROUNDS", subtitle: "BRONZE LEAGUE II",
    stars: 1, reward: 200, challenge: "Win 5 versus matches", done: 2, goal: 5,
    location: "QUICK MATCH",
    enemy: { name: "SEARCHING…", sub: "RANKED OPPONENT", head: "#2a2a30", stroke: "#5a5a66", eye: "#5a5a66", iris: "#5a5a66", scarf: "#3a3a44", bg: "#14141a", unknown: true },
  },
  training: {
    eyebrow: "DOJO", title: "FORM & FOCUS", subtitle: "COMBO DRILLS",
    stars: 3, reward: 40, challenge: "Perform a 10-hit combo", done: 1, goal: 1,
    location: "TRAINING DOJO",
    enemy: { name: "WOODEN DUMMY", sub: "NEVER FIGHTS BACK", head: "#c89a60", stroke: "#5a3a1a", eye: "#5a3a1a", iris: "#5a3a1a", scarf: "#8a6a40", bg: "#2a1c10", dummy: true },
  },
};

const TIPS = [
  "Tip: Dodge at the last moment to trigger a Perfect Dodge.",
  "Tip: Chain light attacks into a heavy to break guard.",
  "Tip: Specials charge faster when you take risks.",
  "Tip: Weapons change your stats — visit the Locker before tough fights.",
  "Tip: Earn stars to unlock new chapters and gear.",
];

// New-player save; merged with whatever is stored on the device
const DEFAULT_SAVE = {
  level: 8, xp: 580, xpMax: 1000, coins: 2450, gems: 80,
  fighter: "kuro",
  owned: { costumes: ["default", "shadow"], weapons: ["fists", "katana"] },
  loadouts: {
    kuro:   { costume: "default", weapon: "katana" },
    shiro:  { costume: "default", weapon: "fists" },
    akai:   { costume: "default", weapon: "fists" },
    raijin: { costume: "default", weapon: "fists" },
  },
};

const byId = (list, id) => list.find((x) => x.id === id);
