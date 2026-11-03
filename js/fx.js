// Stick Fighter Z — canvas particles: falling leaves, brazier embers, dust motes, ring sparkles, tap bursts

const FX = (() => {
  const canvas = document.getElementById("fx");
  const c = canvas.getContext("2d");
  const W = 1600;
  const H = 900;
  const BRAZIER = { x: 1510, y: 540 };

  let quality = "high";
  let ring = { x: 1068, y: 174 };
  let leaves = [];
  let motes = [];
  let particles = []; // embers, sparkles, bursts
  let last = 0;

  const rand = (a, b) => a + Math.random() * (b - a);

  const budget = () => (quality === "high"
    ? { leaves: 22, motes: 40, embers: 30, sparkles: 6 }
    : { leaves: 8, motes: 0, embers: 8, sparkles: 2 });

  function newLeaf(anywhere) {
    return {
      x: rand(0, W + 300),
      y: anywhere ? rand(-40, H) : rand(-60, -20),
      vx: rand(-60, -20),
      vy: rand(40, 90),
      rot: rand(0, Math.PI * 2),
      vr: rand(-2, 2),
      flip: rand(0, Math.PI * 2),
      size: rand(6, 13),
      color: Math.random() > 0.3 ? "#c0262a" : "#e0602a",
      alpha: rand(0.5, 1),
    };
  }

  function newMote() {
    return { x: rand(0, W), y: rand(0, H), r: rand(1, 2.6), phase: rand(0, 6.28), speed: rand(4, 12) };
  }

  function populate() {
    const b = budget();
    while (leaves.length < b.leaves) leaves.push(newLeaf(true));
    leaves.length = b.leaves;
    while (motes.length < b.motes) motes.push(newMote());
    motes.length = b.motes;
  }

  function spawn(p) {
    particles.push({ life: 0, ...p });
  }

  function emit(dt) {
    const b = budget();
    if (Math.random() < b.embers * dt) {
      spawn({
        kind: "ember",
        x: BRAZIER.x + rand(-40, 40), y: BRAZIER.y + rand(-10, 10),
        vx: rand(-15, 15), vy: rand(-140, -60),
        max: rand(1.2, 2.6), r: rand(1.5, 3.2),
      });
    }
    if (Math.random() < b.sparkles * dt) {
      const a = rand(0, Math.PI * 2);
      spawn({
        kind: "spark",
        x: ring.x + Math.cos(a) * 40, y: ring.y + Math.sin(a) * 14,
        vx: rand(-10, 10), vy: rand(-40, -10),
        max: rand(0.6, 1.2), r: rand(1.5, 3),
      });
    }
  }

  function burst(x, y, color = "#ffd060", count = 26) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(150, 420);
      spawn({ kind: "burst", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, max: rand(0.35, 0.7), r: rand(2, 4), color });
    }
  }

  function drawLeaf(l) {
    c.save();
    c.translate(l.x, l.y);
    c.rotate(l.rot);
    c.scale(1, Math.abs(Math.cos(l.flip)) * 0.8 + 0.2);
    c.globalAlpha = l.alpha;
    c.fillStyle = l.color;
    c.beginPath();
    c.ellipse(0, 0, l.size, l.size * 0.45, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    c.clearRect(0, 0, W, H);

    // dust motes
    c.fillStyle = "#ffe8c0";
    for (const m of motes) {
      m.phase += dt;
      m.y -= m.speed * dt;
      m.x += Math.sin(m.phase) * 6 * dt;
      if (m.y < -10) { m.y = H + 10; m.x = rand(0, W); }
      c.globalAlpha = 0.15 + Math.abs(Math.sin(m.phase * 0.8)) * 0.3;
      c.beginPath();
      c.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      c.fill();
    }

    // embers, sparkles, bursts (additive glow)
    emit(dt);
    c.globalCompositeOperation = "lighter";
    particles = particles.filter((p) => {
      p.life += dt;
      if (p.life >= p.max) return false;
      const k = 1 - p.life / p.max;
      if (p.kind === "burst") { p.vx *= 0.9; p.vy = p.vy * 0.9 + 400 * dt; }
      else p.vx += Math.sin(t / 300 + p.x) * 20 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      c.globalAlpha = k;
      c.fillStyle = p.color || (p.kind === "ember" ? `rgb(255, ${120 + k * 100 | 0}, 40)` : "#fff0a0");
      c.beginPath();
      c.arc(p.x, p.y, p.r * (0.5 + k * 0.5), 0, Math.PI * 2);
      c.fill();
      return true;
    });
    c.globalCompositeOperation = "source-over";

    // leaves
    for (let i = 0; i < leaves.length; i++) {
      const l = leaves[i];
      l.x += (l.vx + Math.sin(l.flip) * 30) * dt;
      l.y += l.vy * dt;
      l.rot += l.vr * dt;
      l.flip += dt * 2;
      if (l.y > H + 30 || l.x < -40) leaves[i] = newLeaf(false);
      drawLeaf(l);
    }
    c.globalAlpha = 1;

    requestAnimationFrame(frame);
  }

  return {
    start() { populate(); requestAnimationFrame(frame); },
    setQuality(q) { quality = q; populate(); },
    setRing(x, y) { ring = { x, y }; },
    burst,
  };
})();
