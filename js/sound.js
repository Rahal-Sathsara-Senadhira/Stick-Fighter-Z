// Stick Fighter Z — synthesized sound effects + ambient music (Web Audio, no files)

const Sound = (() => {
  let ctx, master, sfxGain, musicGain, noiseBuffer;
  let sfxOn = true;
  let musicOn = true;

  function init() {
    if (ctx) return ctx.state === "suspended" && ctx.resume();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);
    sfxGain = ctx.createGain();
    sfxGain.connect(master);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(master);

    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    startMusic();
    applyMusic();
  }

  function tone({ type = "sine", freq = 440, to, dur = 0.15, vol = 0.3, delay = 0, dest = sfxGain }) {
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function noise({ dur = 0.3, vol = 0.2, from = 800, to = 3000, delay = 0 }) {
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(to, t + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter).connect(gain).connect(sfxGain);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  const SOUNDS = {
    tap:     () => tone({ type: "triangle", freq: 900, to: 600, dur: 0.06, vol: 0.15 }),
    whoosh:  () => noise({ dur: 0.3, vol: 0.25, from: 400, to: 3000 }),
    select:  () => { noise({ dur: 0.25, vol: 0.2, from: 600, to: 4000 }); tone({ freq: 520, to: 1040, dur: 0.18, vol: 0.12 }); },
    ring:    () => { tone({ freq: 1320, dur: 0.6, vol: 0.08 }); tone({ freq: 1980, dur: 0.5, vol: 0.05, delay: 0.06 }); },
    confirm: () => { tone({ type: "square", freq: 440, dur: 0.1, vol: 0.07 }); tone({ type: "square", freq: 660, dur: 0.2, vol: 0.07, delay: 0.08 }); },
    slam:    () => { tone({ freq: 150, to: 40, dur: 0.7, vol: 0.7 }); noise({ dur: 0.45, vol: 0.35, from: 2500, to: 150 }); },
    error:   () => { tone({ type: "square", freq: 160, dur: 0.12, vol: 0.08 }); tone({ type: "square", freq: 120, dur: 0.18, vol: 0.08, delay: 0.1 }); },
    buy:     () => [988, 1319, 1568, 2093].forEach((f, i) => tone({ type: "triangle", freq: f, dur: 0.25, vol: 0.1, delay: i * 0.06 })),
    equip:   () => { noise({ dur: 0.15, vol: 0.2, from: 2000, to: 6000 }); tone({ type: "triangle", freq: 660, to: 990, dur: 0.12, vol: 0.1 }); },
    ready:   () => [523, 659, 784].forEach((f, i) => tone({ type: "triangle", freq: f, dur: 0.3, vol: 0.12, delay: i * 0.09 })),
  };

  function play(name) {
    if (!ctx || !sfxOn) return;
    if (ctx.state === "suspended") ctx.resume();
    SOUNDS[name]?.();
  }

  // Low drone + random pentatonic plucks, like a distant koto
  function startMusic() {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500;
    filter.connect(musicGain);

    [[55, "sine", 0.14], [110, "sawtooth", 0.02], [164.8, "sawtooth", 0.015]].forEach(([freq, type, vol], i) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = (i - 1) * 7;
      const gain = ctx.createGain();
      gain.gain.value = vol;
      osc.connect(gain).connect(filter);
      osc.start();
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    const scale = [220, 261.6, 293.7, 329.6, 392, 440, 523.3, 587.3];
    const pluck = () => {
      if (musicOn) {
        const note = scale[Math.floor(Math.random() * scale.length)];
        tone({ type: "triangle", freq: note, dur: 1.8, vol: 0.08, dest: musicGain });
        if (Math.random() < 0.3) tone({ type: "triangle", freq: note * 1.5, dur: 1.4, vol: 0.05, delay: 0.25, dest: musicGain });
      }
      setTimeout(pluck, 900 + Math.random() * 1800);
    };
    pluck();
  }

  function applyMusic() {
    if (ctx) musicGain.gain.setTargetAtTime(musicOn ? 0.5 : 0, ctx.currentTime, 0.4);
  }

  return {
    init,
    play,
    setMusic(on) { musicOn = on; applyMusic(); },
    setSfx(on) { sfxOn = on; },
  };
})();
