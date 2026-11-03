// Stick Fighter Z — fighter drawing: full-body hero, portraits, item icons

const HERO_DEFS = `
  <defs>
    <radialGradient id="ringGlow">
      <stop offset="0" stop-color="#ffe08a" stop-opacity="0.9" />
      <stop offset="1" stop-color="#ffb030" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="dragonGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff3a1a" /><stop offset="0.6" stop-color="#ff9a30" /><stop offset="1" stop-color="#fff0a0" />
    </linearGradient>
    <filter id="wGlow" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="5" /></filter>
  </defs>`;

function heroSVG(viewBox = "0 0 420 720", extraClass = "") {
  return `
  <svg class="hero ${extraClass}" viewBox="${viewBox}">
    ${HERO_DEFS}
    <ellipse class="shadow" cx="230" cy="700" rx="140" ry="16" fill="#000" opacity="0.35" />

    <g class="scarf-tails">
      <path class="scarf" d="M190 150 Q120 200 80 270 Q40 340 10 420 L40 410 L30 450 L70 400 Q110 330 150 270 Q180 220 205 170 Z" />
      <path class="scarf-dark" d="M200 160 Q160 240 130 330 Q110 400 95 470 L120 450 L125 490 L145 430 Q165 360 190 280 Q205 220 215 175 Z" />
      <g class="scarf-trim">
        <path d="M60 330 l10 -8 l4 12 z" /><path d="M120 360 l12 -6 l0 14 z" /><path d="M40 395 l9 -4 l1 10 z" />
      </g>
    </g>

    <g class="weapon"></g>

    <g class="limb" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M205 345 L190 480 L185 620" stroke-width="24" />
      <path d="M228 345 L265 480 L300 610" stroke-width="24" />
    </g>
    <path class="wrap" d="M168 580 L204 580 L206 640 L170 640 Z" />
    <path class="boot" d="M166 636 L208 636 L212 670 L150 678 L150 666 Z" />
    <path class="scarf" d="M168 600 L204 596 L204 606 L168 610 Z" />
    <path class="wrap" d="M282 572 L318 566 L330 628 L296 636 Z" />
    <path class="boot" d="M294 630 L330 622 L346 660 L298 672 Z" />
    <path fill="#d0a030" d="M298 655 L340 648 L344 656 L300 664 Z" />

    <path class="scarf" d="M200 330 L180 420 L196 410 L205 440 L215 340 Z" />
    <path class="wrap" d="M230 330 L260 410 L246 404 L240 430 L222 340 Z" />

    <path class="body" d="M178 178 Q210 168 248 178 L238 260 L228 340 L200 340 L190 260 Z" />
    <path class="scarf" d="M192 315 L236 315 L234 340 L194 340 Z" />
    <rect x="208" y="318" width="12" height="18" fill="#e0b040" />

    <path class="limb" d="M182 190 L148 270 L192 322" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <rect x="150" y="262" width="20" height="16" rx="3" fill="#cfc2ae" transform="rotate(50 160 270)" />

    <g class="raised-arm">
      <path class="limb" d="M244 190 L300 250 L310 150" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <rect x="296" y="185" width="22" height="18" rx="3" fill="#cfc2ae" transform="rotate(6 306 194)" />
      <circle class="body" cx="310" cy="146" r="14" />
      <path class="limb" d="M312 140 L314 102" stroke-width="9" stroke-linecap="round" />
      <g class="ring">
        <circle cx="318" cy="90" r="40" fill="url(#ringGlow)" />
        <ellipse cx="318" cy="90" rx="38" ry="12" fill="none" stroke="#ffd060" stroke-width="4" />
        <ellipse cx="318" cy="90" rx="24" ry="7" fill="none" stroke="#fff0b0" stroke-width="2" />
      </g>
    </g>

    <path class="cape" d="M165 175 Q210 150 262 178 L270 220 L255 210 L250 232 L236 214 L224 238 L212 212 L198 236 L188 210 L176 226 L170 205 L158 215 Z" />
    <path fill="#d0a030" d="M205 186 L215 176 L225 186 L215 198 Z" />
    <path class="scarf" d="M180 138 Q215 128 248 140 L252 172 Q215 186 176 170 Z" />

    <g class="head">
      <circle cx="214" cy="76" r="64" class="head-fill" stroke-width="6" />
      <g class="eyes">
        <path class="eye" d="M170 78 L206 86 L202 96 Q184 96 172 84 Z" />
        <path class="eye" d="M226 86 L260 74 L257 84 Q246 96 230 96 Z" />
        <circle class="iris" cx="194" cy="89" r="3.5" />
        <circle class="iris" cx="238" cy="89" r="3.5" />
      </g>
      <path class="mouth" d="M196 110 Q216 132 236 108 Q216 120 196 110 Z" />
      <g class="accessory"></g>
    </g>
  </svg>`;
}

// Resolve a fighter + loadout into the colors used to draw them
function resolveLook(fighter, loadout) {
  const costume = byId(COSTUMES, loadout.costume) || COSTUMES[0];
  return { cape: "#5a4a42", wrap: "#6a5448", ...fighter.look, ...(costume.palette || {}) };
}

function applyLook(svg, fighter, loadout, { locked = false } = {}) {
  const look = resolveLook(fighter, loadout);
  const costume = byId(COSTUMES, loadout.costume) || COSTUMES[0];
  const weapon = byId(WEAPONS, loadout.weapon) || WEAPONS[0];
  const vars = {
    "--head": look.head, "--head-stroke": look.stroke, "--eye": look.eye, "--iris": look.iris,
    "--mouth": look.mouth, "--scarf": look.scarf, "--scarf-dark": look.scarfDark, "--trim": look.trim,
    "--cape": look.cape, "--wrap": look.wrap,
  };
  Object.entries(vars).forEach(([k, v]) => svg.style.setProperty(k, v));
  svg.querySelector(".accessory").innerHTML = locked ? "" : costume.accessory || "";
  const w = svg.querySelector(".weapon");
  w.setAttribute("transform", weapon.place);
  w.innerHTML = locked ? "" : weapon.svg;
  svg.classList.toggle("silhouette", locked);
}

// Round portrait. Accepts a fighter look (optionally with a costume scarf) or an enemy description.
function faceSVG(f) {
  let eyes = `
    <path d="M24 52 L46 58 L43 65 Q32 65 26 58 Z" fill="${f.eye}" />
    <path d="M56 58 L78 50 L75 58 Q68 65 59 65 Z" fill="${f.eye}" />
    <circle cx="37" cy="60" r="2.4" fill="${f.iris}" />
    <circle cx="64" cy="60" r="2.4" fill="${f.iris}" />`;
  if (f.dummy) {
    eyes = `<path d="M30 52 L42 64 M42 52 L30 64 M58 52 L70 64 M70 52 L58 64" stroke="${f.eye}" stroke-width="4" stroke-linecap="round" />`;
  }
  const mask = f.mask ? `<rect x="10" y="48" width="80" height="20" fill="#5a1418" opacity="0.9" />` : "";
  const mouth = f.mouth && f.mouth !== "transparent"
    ? `<path d="M34 72 Q50 88 68 70 Q50 80 34 72 Z" fill="${f.mouth}" />` : "";
  const inner = f.unknown
    ? `<text x="50" y="72" font-family="Oswald, sans-serif" font-size="46" font-weight="700" text-anchor="middle" fill="#8a8a96">?</text>`
    : mask + eyes + mouth;
  return `
    <svg viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${f.bg}" />
      <circle cx="50" cy="56" r="40" fill="${f.head}" stroke="${f.stroke}" stroke-width="3" />
      ${inner}
      <path d="M16 90 Q50 72 84 90 L84 100 L16 100 Z" fill="${f.scarf}" />
    </svg>`;
}

function fighterFace(fighter, loadout, locked = false) {
  if (locked) return faceSVG({ ...fighter.look, head: "#0c0a0c", stroke: "#3a3440", eye: "#0c0a0c", iris: "#0c0a0c", scarf: "#1a161c", mouth: "transparent", unknown: true });
  return faceSVG(resolveLook(fighter, loadout));
}

function weaponIcon(weapon) {
  return `<svg viewBox="${weapon.view}">${HERO_DEFS}${weapon.icon || weapon.svg}</svg>`;
}

// Upper-body crop of the fighter wearing a costume
function costumeIcon(fighter, costumeId) {
  const wrap = document.createElement("div");
  wrap.innerHTML = heroSVG("100 -24 230 270", "still");
  const svg = wrap.firstElementChild;
  applyLook(svg, fighter, { costume: costumeId, weapon: "fists" });
  return wrap.innerHTML;
}
