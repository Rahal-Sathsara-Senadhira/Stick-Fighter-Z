// Stick Fighter Z — Locker page: try on, buy and equip costumes and weapons

$("#lkHero").innerHTML = heroSVG();
const lkHero = $("#lkHero .hero");
const TAB = {
  costumes: { list: COSTUMES, key: "costume" },
  weapons:  { list: WEAPONS,  key: "weapon" },
};

const startFighter = byId(FIGHTERS, params.get("fighter"));
const lk = {
  fighter: startFighter && !isLocked(startFighter) ? startFighter.id : save.fighter,
  tab: params.get("tab") === "weapons" ? "weapons" : "costumes",
  sel: null,
};
lk.sel = loadoutOf(byId(FIGHTERS, lk.fighter))[TAB[lk.tab].key];

function renderLocker() {
  const f = byId(FIGHTERS, lk.fighter);
  const lo = loadoutOf(f);
  const { list, key } = TAB[lk.tab];
  const preview = { ...lo, [key]: lk.sel };
  const item = byId(list, lk.sel);
  const owned = save.owned[lk.tab].includes(item.id);
  const equipped = lo[key] === item.id;

  applyLook(lkHero, f, preview);
  renderStats($("#lkStats"), f.stats, weaponOf(preview).bonus);
  $("#lockerScreen").style.setProperty("--accent", f.look.scarf);
  $("#lkFighter").textContent = `${f.name} · ${f.title.toUpperCase()}`;
  $$(".lk-tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === lk.tab));

  $("#lkGrid").innerHTML = list.map((it) => {
    const isOwned = save.owned[lk.tab].includes(it.id);
    const isEquipped = lo[key] === it.id;
    const icon = lk.tab === "costumes" ? costumeIcon(f, it.id) : weaponIcon(it);
    const tag = isEquipped ? "EQUIPPED" : isOwned ? "OWNED" : priceHTML(it.price);
    return `
      <button class="item ${it.id === lk.sel ? "sel" : ""} ${isEquipped ? "equipped" : ""} ${isOwned ? "" : "for-sale"}"
              data-id="${it.id}" style="--rarity:${RARITY[it.rarity].color}">
        <div class="item-icon ${lk.tab}">${icon}</div>
        <div class="item-name">${it.name}</div>
        <div class="item-tag">${tag}</div>
      </button>`;
  }).join("");

  const rarity = RARITY[item.rarity];
  const rEl = $("#lkRarity");
  rEl.textContent = rarity.label;
  rEl.style.color = rarity.color;
  $("#lkName").textContent = item.name;
  $("#lkDesc").textContent = item.desc;
  $("#lkBonus").innerHTML = lk.tab === "weapons"
    ? bonusText(item.bonus)
    : `<span class="muted">COSMETIC · NO STAT CHANGE</span>`;

  const btn = $("#lkAction");
  btn.disabled = equipped;
  btn.classList.toggle("done", equipped);
  btn.classList.toggle("buy", !owned);
  btn.innerHTML = equipped ? "EQUIPPED ✓" : owned ? "EQUIP" : `BUY ${priceHTML(item.price)}`;
}

$("#lkGrid").addEventListener("click", (e) => {
  const card = e.target.closest(".item");
  if (!card || card.dataset.id === lk.sel) return;
  lk.sel = card.dataset.id;
  feedback(lk.tab === "weapons" ? "equip" : "tap");
  renderLocker();
  restartAnim(lkHero, "swap");
});

$$(".lk-tabs button").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.tab === lk.tab) return;
    lk.tab = b.dataset.tab;
    lk.sel = loadoutOf(byId(FIGHTERS, lk.fighter))[TAB[lk.tab].key];
    feedback("whoosh");
    renderLocker();
  })
);

$("#lkAction").addEventListener("click", () => {
  const { list, key } = TAB[lk.tab];
  const item = byId(list, lk.sel);
  const lo = save.loadouts[lk.fighter];
  const btn = $("#lkAction");

  if (!save.owned[lk.tab].includes(item.id)) {
    const currency = item.price.coins ? "coins" : "gems";
    const cost = item.price[currency];
    if (save[currency] < cost) {
      feedback("error", [30, 40, 30]);
      restartAnim(btn, "nope");
      btn.textContent = `NOT ENOUGH ${currency.toUpperCase()}`;
      setTimeout(renderLocker, 1200);
      return;
    }
    save[currency] -= cost;
    save.owned[lk.tab].push(item.id);
    feedback("buy", 30);
    updateWallet();
  } else {
    feedback("equip", 15);
  }

  lo[key] = item.id;
  persist();
  renderLocker();
  restartAnim(lkHero, "taunt");
});

// Back goes to wherever the locker was opened from
function back() {
  feedback("tap");
  go(params.get("from") === "fighters" ? `fighters.html?fighter=${lk.fighter}` : "index.html");
}
$("[data-back]").addEventListener("click", back);
window.addEventListener("keydown", (e) => e.key === "Escape" && back());

updateWallet();
renderLocker();
