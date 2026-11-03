// Stick Fighter Z — main menu page (no game engine yet)

function applySettings() {
  applyAudioSettings();
  FX.setQuality(settings.quality);
  $$(".switch").forEach((sw) => sw.setAttribute("aria-checked", settings[sw.dataset.setting]));
  $$(".seg button").forEach((b) => b.classList.toggle("on", b.dataset.value === settings.quality));
}

// ---------- Menu hero ----------
$("#heroWrap").innerHTML = heroSVG();
const hero = $("#heroWrap .hero");
const RING_BASE = { x: 1068, y: 174 }; // ring position inside the menu hero, in stage px
const ringPos = { ...RING_BASE };

function refreshMenu(animate = false) {
  const f = byId(FIGHTERS, save.fighter);
  const lo = loadoutOf(f);
  const w = weaponOf(lo);
  const look = resolveLook(f, lo);

  applyLook(hero, f, lo);
  $("#profileAvatar").innerHTML = fighterFace(f, lo);
  $("#mbFace").innerHTML = fighterFace(f, lo);
  $("#mbFighter").textContent = f.name;
  $("#mbWeapon").innerHTML = weaponIcon(w);
  $("#mbItem").textContent = costumeOf(lo).name;

  $("#fpName").textContent = f.name;
  $("#fpTitle").textContent = f.title;
  $("#fpStyle").textContent = f.style;
  $("#fpSpecial").textContent = f.special;
  $("#fpWeapon").textContent = w.name;
  $(".fighter-panel").style.setProperty("--accent", look.scarf);
  renderStats($("#fpStats"), f.stats, w.bonus);

  if (animate) {
    restartAnim(hero, "swap");
    FX.burst(ringPos.x - 100, ringPos.y + 200, look.scarf, 30);
  }
}

onTaunt = (h) => h === hero && FX.burst(ringPos.x, ringPos.y, "#ffd060", 30);

$("#openFighters").addEventListener("click", () => {
  feedback("tap");
  go("fighters.html");
});
$("#openLocker").addEventListener("click", () => {
  feedback("tap");
  go("locker.html");
});

// ---------- Mode card ----------
const STAR = (on) => `<svg class="star ${on ? "on" : "off"}" viewBox="0 0 24 24"><path d="M12 2 L14.9 8.6 L22 9.3 L16.6 14 L18.2 21 L12 17.3 L5.8 21 L7.4 14 L2 9.3 L9.1 8.6 Z" stroke-width="1" /></svg>`;
const MODE_KEYS = Object.keys(MODES);
let currentMode = MODE_KEYS.includes(sessionStorage.getItem("sfz-mode")) ? sessionStorage.getItem("sfz-mode") : "story";

function renderCard(key) {
  const m = MODES[key];
  $("#cardEyebrow").textContent = m.eyebrow;
  $("#cardTitle").textContent = m.title;
  $("#cardSubtitle").textContent = m.subtitle;
  $("#cardArt").className = `card-art ${key}`;
  $("#stars").innerHTML = [0, 1, 2].map((i) => STAR(i < m.stars)).join("");
  $("#starsLabel").textContent = `${m.stars} / 3 STARS`;
  $("#reward").textContent = `+${m.reward}`;
  $("#challengeText").textContent = m.challenge;
  const count = $("#challengeCount");
  count.textContent = m.done >= m.goal ? "DONE" : `${m.done} / ${m.goal}`;
  count.classList.toggle("done", m.done >= m.goal);
  $("#challengeBar").style.width = "0%";
  requestAnimationFrame(() => ($("#challengeBar").style.width = `${(m.done / m.goal) * 100}%`));
  $("#continueLabel").textContent = m.location;
  $("#modeIndicator").style.setProperty("--i", MODE_KEYS.indexOf(key));
  $$(".mode").forEach((b) => b.classList.toggle("active", b.dataset.mode === key));
}

$$(".mode").forEach((btn) =>
  btn.addEventListener("click", () => {
    const key = btn.dataset.mode;
    if (key === currentMode) return;
    currentMode = key;
    try { sessionStorage.setItem("sfz-mode", key); } catch {}
    feedback("whoosh");
    $$(".mode").forEach((b) => b.classList.toggle("active", b === btn));
    $("#modeIndicator").style.setProperty("--i", MODE_KEYS.indexOf(key));
    const inner = $("#cardInner");
    inner.classList.add("fade");
    setTimeout(() => {
      renderCard(key);
      inner.classList.remove("fade");
    }, 180);
  })
);

// ---------- Settings modal ----------
const settingsModal = $("#settings");
$("#settingsBtn").addEventListener("click", () => {
  feedback("tap");
  settingsModal.classList.add("open");
});
settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal || e.target.closest("[data-close]")) {
    feedback("tap");
    settingsModal.classList.remove("open");
  }
});
$$(".switch").forEach((sw) =>
  sw.addEventListener("click", () => {
    const key = sw.dataset.setting;
    settings[key] = !settings[key];
    applySettings();
    saveSettings();
    feedback("tap");
  })
);
$$(".seg button").forEach((b) =>
  b.addEventListener("click", () => {
    settings.quality = b.dataset.value;
    applySettings();
    saveSettings();
    feedback("tap");
  })
);

// ---------- VS / loading screen ----------
const vs = $("#vs");
let vsTimers = [];

function startMatch(e) {
  const m = MODES[currentMode];
  const f = byId(FIGHTERS, save.fighter);
  feedback("confirm", 25);
  if (e) { const p = toStage(e); FX.burst(p.x, p.y, "#ff5040", 34); }

  $("#vsPlayer").innerHTML = fighterFace(f, loadoutOf(f));
  $("#vsPlayerName").textContent = f.name;
  $("#vsPlayerSub").textContent = f.title.toUpperCase();
  $("#vsEnemy").innerHTML = faceSVG(m.enemy);
  $("#vsEnemyName").textContent = m.enemy.name;
  $("#vsEnemySub").textContent = m.enemy.sub;
  $("#vsStage").textContent = m.location;
  $("#vsTip").textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
  $("#vsBack").classList.remove("show");
  const bar = $("#vsBar");
  bar.style.transition = "none";
  bar.style.width = "0%";

  setTimeout(() => vs.classList.add("open"), 150);
  vsTimers = [
    setTimeout(() => { feedback("slam", 60); restartAnim(stage, "shake"); }, 750),
    setTimeout(() => { bar.style.transition = "width 2.4s cubic-bezier(.6,.1,.3,1)"; bar.style.width = "100%"; }, 900),
    setTimeout(() => {
      feedback("ready");
      $("#vsTip").textContent = "Ready! The fight engine is coming in the next build.";
      $("#vsBack").classList.add("show");
    }, 3400),
  ];
}

$("#continueBtn").addEventListener("click", startMatch);
$("#vsBack").addEventListener("click", () => {
  vsTimers.forEach(clearTimeout);
  feedback("tap");
  vs.classList.remove("open");
});

// ---------- Parallax (mouse or device tilt) ----------
const layers = $$("[data-depth]").map((el) => ({ el, depth: parseFloat(el.dataset.depth) }));
const target = { x: 0, y: 0 };
const cur = { x: 0, y: 0 };
const clamp = (v) => Math.max(-1, Math.min(1, v));

window.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") return;
  target.x = (e.clientX / window.innerWidth) * 2 - 1;
  target.y = (e.clientY / window.innerHeight) * 2 - 1;
});
window.addEventListener("deviceorientation", (e) => {
  if (e.beta == null) return;
  const angle = screen.orientation?.angle ?? window.orientation ?? 0;
  const landscape = Math.abs(angle) === 90 || angle === 270;
  const sign = angle === -90 || angle === 270 ? -1 : 1;
  target.x = clamp((landscape ? e.beta * sign : e.gamma) / 25);
  target.y = clamp(((landscape ? -e.gamma * sign : e.beta) - 40) / 30);
});

function parallax() {
  cur.x += (target.x - cur.x) * 0.06;
  cur.y += (target.y - cur.y) * 0.06;
  for (const { el, depth } of layers) {
    el.style.transform = `translate(${(-cur.x * depth * 30).toFixed(2)}px, ${(-cur.y * depth * 14).toFixed(2)}px)`;
  }
  ringPos.x = RING_BASE.x + cur.x * 0.4 * 30;
  ringPos.y = RING_BASE.y + cur.y * 0.4 * 14;
  FX.setRing(ringPos.x, ringPos.y);
  requestAnimationFrame(parallax);
}

// ---------- Splash -> menu ----------
// The splash only shows once per session; returning from Fighters/Locker goes straight to the menu.
const splash = $("#splash");
let started = false;

function enterMenu({ intro = true } = {}) {
  if (started) return;
  started = true;
  try { sessionStorage.setItem("sfz-session", "1"); } catch {}
  splash.classList.remove("open");
  document.body.classList.add("menu-in");
  if (intro) {
    unlockAudio();
    feedback("slam", 40);
  } else {
    document.body.classList.add("no-intro");
  }

  const set = () => {
    $("#xpText").textContent = save.xp;
    $("#xpBar").style.width = `${(save.xp / save.xpMax) * 100}%`;
  };
  if (intro) {
    setTimeout(() => {
      countUp($("#coins"), save.coins, 1400);
      countUp($("#gems"), save.gems, 1400);
      countUp($("#xpText"), save.xp, 1400);
      set();
    }, 500);
  } else {
    $("#coins").textContent = save.coins.toLocaleString("en-US");
    $("#gems").textContent = save.gems.toLocaleString("en-US");
    set();
  }
}
splash.addEventListener("click", () => enterMenu());

window.addEventListener("keydown", (e) => {
  if (!started && (e.key === "Enter" || e.key === " ")) return enterMenu();
  if (e.key === "Escape") settingsModal.classList.remove("open");
});

// ---------- Init ----------
renderCard(currentMode);
// Play the swap effect if the fighter or their gear changed on another page
const lookKey = JSON.stringify([save.fighter, save.loadouts[save.fighter]]);
let lastLook = null;
try { lastLook = sessionStorage.getItem("sfz-look"); sessionStorage.setItem("sfz-look", lookKey); } catch {}
refreshMenu();
applySettings();
FX.start();
parallax();

let returning = false;
try { returning = sessionStorage.getItem("sfz-session") === "1"; } catch {}
if (returning) {
  splash.classList.remove("open");
  enterMenu({ intro: false });
  if (lastLook && lastLook !== lookKey) setTimeout(() => refreshMenu(true), 250);
}

// Dev shortcut: index.html?screen=menu | settings | vs  (&reset clears the save)
const devScreen = params.get("screen");
if (devScreen) {
  enterMenu();
  if (devScreen === "settings") settingsModal.classList.add("open");
  if (devScreen === "vs") setTimeout(startMatch, 900);
}
