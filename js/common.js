// Stick Fighter Z — shared by every page: stage scaling, save data, settings, navigation, UI helpers

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const stage = $("#stage");
const params = new URLSearchParams(location.search);

// ---------- Fit 1600x900 stage to the screen ----------
let scale = 1;
function fitStage() {
  scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
  stage.style.setProperty("--scale", scale);
}
window.addEventListener("resize", fitStage);
fitStage();

function toStage(e) {
  const r = stage.getBoundingClientRect();
  return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
}

// ---------- Save data (per device) ----------
const SAVE_KEY = "sfz-save";
if (params.has("reset")) try { localStorage.removeItem(SAVE_KEY); } catch {}

function loadSave() {
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); } catch {}
  const d = structuredClone(DEFAULT_SAVE);
  return {
    ...d, ...stored,
    owned: { ...d.owned, ...(stored.owned || {}) },
    loadouts: { ...d.loadouts, ...(stored.loadouts || {}) },
  };
}
const save = loadSave();
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch {}
}

const isLocked = (f) => Boolean(f.unlockLevel && save.level < f.unlockLevel);
const loadoutOf = (f) => save.loadouts[f.id];
const weaponOf = (lo) => byId(WEAPONS, lo.weapon) || WEAPONS[0];
const costumeOf = (lo) => byId(COSTUMES, lo.costume) || COSTUMES[0];

// ---------- Settings ----------
const DEFAULT_SETTINGS = { music: true, sfx: true, vibration: true, quality: "high" };
let settings = { ...DEFAULT_SETTINGS };
try {
  settings = { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("sfz-settings") || "{}") };
} catch {}

function saveSettings() {
  try { localStorage.setItem("sfz-settings", JSON.stringify(settings)); } catch {}
}

function applyAudioSettings() {
  Sound.setMusic(settings.music);
  Sound.setSfx(settings.sfx);
}

// Browsers only allow audio after a user gesture
function unlockAudio() {
  Sound.init();
  applyAudioSettings();
}
window.addEventListener("pointerdown", unlockAudio, { once: true });

function feedback(sound = "tap", vibrate = 12) {
  Sound.play(sound);
  if (settings.vibration && navigator.vibrate) navigator.vibrate(vibrate);
}

// ---------- Navigation between pages ----------
function go(url) {
  document.body.classList.add("leaving");
  setTimeout(() => (location.href = url), 220);
}
// Coming back via the browser's back button may restore a faded-out page
window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));

// ---------- Helpers ----------
function restartAnim(el, cls) {
  el.classList.remove(cls);
  void el.getBoundingClientRect();
  el.classList.add(cls);
}

function countUp(el, to, dur = 1200) {
  const from = parseInt(el.textContent.replace(/\D/g, ""), 10) || 0;
  const start = performance.now();
  cancelAnimationFrame(el._raf);
  const step = (now) => {
    const k = Math.max(0, Math.min(1, (now - start) / dur));
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (to - from) * eased).toLocaleString("en-US");
    if (k < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

// Stat bars: base value in the fighter's color, weapon bonus in gold
function renderStats(container, base, bonus = {}) {
  if (!container.children.length) {
    container.innerHTML = STAT_KEYS.map((k) => `
      <div class="stat" data-stat="${k}">
        <div class="stat-label">${k.toUpperCase()}</div>
        <div class="stat-bar"><span class="base"></span><span class="bonus"></span></div>
        <div class="stat-value"><b>0</b><i></i></div>
      </div>`).join("");
  }
  STAT_KEYS.forEach((k) => {
    const row = $(`[data-stat="${k}"]`, container);
    const b = base[k];
    const total = Math.min(100, b + (bonus[k] || 0));
    $(".base", row).style.width = `${b}%`;
    $(".bonus", row).style.width = `${total - b}%`;
    countUp($("b", row), total, 500);
    $("i", row).textContent = total > b ? `+${total - b}` : "";
  });
}

const COIN_SVG = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#c8901e" /><circle cx="20" cy="20" r="13" fill="#f2c040" /></svg>`;
const GEM_SVG = `<svg viewBox="0 0 40 40"><path d="M20 2 L34 16 L20 38 L6 16 Z" fill="#2a7fe0" /><path d="M20 2 L28 16 L20 38 Z" fill="#7cc8ff" /></svg>`;

function priceHTML(price) {
  return price.coins ? `${COIN_SVG}${price.coins.toLocaleString("en-US")}` : `${GEM_SVG}${price.gems}`;
}

function bonusText(bonus) {
  return Object.entries(bonus).map(([k, v]) => `<span>+${v} ${k.toUpperCase()}</span>`).join("");
}

function updateWallet() {
  $$(".js-coins").forEach((el) => (el.textContent = save.coins.toLocaleString("en-US")));
  $$(".js-gems").forEach((el) => (el.textContent = save.gems.toLocaleString("en-US")));
}

// Tap any full-size hero to taunt. Pages can hook in for extra effects.
let onTaunt = null;
stage.addEventListener("click", (e) => {
  const h = e.target.closest(".hero");
  if (!h || h.classList.contains("still")) return;
  restartAnim(h, "taunt");
  feedback("ring", 20);
  onTaunt?.(h);
});
stage.addEventListener("animationend", (e) => {
  const cl = e.target.classList;
  if (cl?.contains("hero")) cl.remove("swap", "taunt", "slide-next", "slide-prev");
  if (e.target === stage) cl.remove("shake");
});
