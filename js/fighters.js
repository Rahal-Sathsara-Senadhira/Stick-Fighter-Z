// Stick Fighter Z — Fighters page: browse the roster and choose your fighter

const fightersScreen = $("#fightersScreen");
$("#fsHero").innerHTML = heroSVG();
const fsHero = $("#fsHero .hero");
let fsIndex = Math.max(0, FIGHTERS.findIndex((f) => f.id === (params.get("fighter") || save.fighter)));

FIGHTERS.forEach((f, i) => {
  const btn = document.createElement("button");
  btn.className = "car-item";
  btn.innerHTML = `<div class="face"></div><span>${f.name}</span>`;
  btn.addEventListener("click", () => i !== fsIndex && showFighter(i, i > fsIndex ? 1 : -1));
  $("#fsCarousel").appendChild(btn);
});

function renderFighter() {
  const f = FIGHTERS[fsIndex];
  const locked = isLocked(f);
  const lo = loadoutOf(f);
  const w = weaponOf(lo);

  applyLook(fsHero, f, lo, { locked });
  fightersScreen.style.setProperty("--accent", f.look.scarf);
  $("#fsBgName").textContent = f.name;
  $("#fsStyle").textContent = f.style;
  $("#fsName").textContent = f.name;
  $("#fsTitle").textContent = f.title;
  $("#fsDesc").textContent = f.desc;
  renderStats($("#fsStats"), f.stats, locked ? {} : w.bonus);
  $("#fsSpecial").textContent = f.special;
  $("#fsSpecialDesc").textContent = f.specialDesc;

  $("#fsLock").classList.toggle("show", locked);
  $("#fsLockText").textContent = locked ? `REACH LV. ${f.unlockLevel} TO UNLOCK` : "";

  $("#fsCostumeIcon").innerHTML = locked ? "" : costumeIcon(f, lo.costume);
  $("#fsWeaponIcon").innerHTML = locked ? "" : weaponIcon(w);
  $("#fsCostume").textContent = locked ? "—" : costumeOf(lo).name;
  $("#fsWeapon").textContent = locked ? "—" : w.name;
  $("#fsCustomize").disabled = locked;

  const sel = $("#fsSelect");
  sel.disabled = locked || f.id === save.fighter;
  sel.classList.toggle("done", f.id === save.fighter);
  sel.textContent = locked ? "LOCKED" : f.id === save.fighter ? "SELECTED ✓" : "SELECT";

  const unlocked = FIGHTERS.filter((x) => !isLocked(x)).length;
  $("#fsCount").textContent = `${unlocked} / ${FIGHTERS.length} UNLOCKED`;

  $$(".car-item").forEach((el, i) => {
    const fi = FIGHTERS[i];
    el.classList.toggle("active", i === fsIndex);
    el.classList.toggle("current", fi.id === save.fighter);
    el.classList.toggle("locked", isLocked(fi));
    $(".face", el).innerHTML = fighterFace(fi, loadoutOf(fi), isLocked(fi));
  });
}

function showFighter(i, dir) {
  fsIndex = (i + FIGHTERS.length) % FIGHTERS.length;
  feedback("whoosh");
  renderFighter();
  restartAnim(fsHero, dir > 0 ? "slide-next" : "slide-prev");
  restartAnim($("#fsBgName"), "bg-swap");
  history.replaceState(null, "", `?fighter=${FIGHTERS[fsIndex].id}`);
}

$("#fsPrev").addEventListener("click", () => showFighter(fsIndex - 1, -1));
$("#fsNext").addEventListener("click", () => showFighter(fsIndex + 1, 1));

// Swipe on the showcase to change fighter
let swipeX = null;
$("#fsShowcase").addEventListener("pointerdown", (e) => (swipeX = e.clientX));
window.addEventListener("pointerup", (e) => {
  if (swipeX === null) return;
  const dx = (e.clientX - swipeX) / scale;
  swipeX = null;
  if (Math.abs(dx) > 60) showFighter(fsIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
});

$("#fsSelect").addEventListener("click", () => {
  const f = FIGHTERS[fsIndex];
  if (isLocked(f)) return;
  save.fighter = f.id;
  persist();
  feedback("select", 20);
  renderFighter();
  restartAnim(fsHero, "taunt");
});

$("#fsCustomize").addEventListener("click", () => {
  const f = FIGHTERS[fsIndex];
  if (isLocked(f)) return;
  feedback("tap");
  go(`locker.html?fighter=${f.id}&from=fighters`);
});

function back() {
  feedback("tap");
  go("index.html");
}
$("[data-back]").addEventListener("click", back);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") back();
  if (e.key === "ArrowLeft") showFighter(fsIndex - 1, -1);
  if (e.key === "ArrowRight") showFighter(fsIndex + 1, 1);
});

renderFighter();
