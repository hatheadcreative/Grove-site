/* Grove Music School: site behaviour. No dependencies. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Sound preference ---------------- */
  let soundOn = true;
  try { soundOn = localStorage.getItem('grove:sound') !== 'off'; } catch (e) {}
  const syncSound = () => {
    $$('[data-sound-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', String(soundOn));
      const l = $('[data-sound-label]', b); if (l) l.textContent = soundOn ? 'Sound on' : 'Sound off';
    });
    if (A.master) A.master.gain.setTargetAtTime(soundOn ? 0.7 : 0, A.ctx.currentTime, 0.03);
  };

  /* ---------------- Audio engine (Web Audio, synthesized) ---------------- */
  const A = { ctx: null, master: null, analyser: null, noise: null, ks: {} };
  function ensure() {
    if (!A.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      const x = new AC(); A.ctx = x;
      A.master = x.createGain(); A.master.gain.value = soundOn ? 0.7 : 0;
      const comp = x.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
      A.analyser = x.createAnalyser(); A.analyser.fftSize = 1024;
      A.master.connect(comp); comp.connect(A.analyser); A.analyser.connect(x.destination);
      const nb = x.createBuffer(1, x.sampleRate, x.sampleRate); const nd = nb.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      A.noise = nb;
    }
    if (A.ctx.state === 'suspended') A.ctx.resume();
    return true;
  }
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function piano(f, t, dur, v) {
    const x = A.ctx; const o1 = x.createOscillator(), o2 = x.createOscillator(), o3 = x.createOscillator();
    o1.type = 'triangle'; o2.type = 'sine'; o3.type = 'sine';
    o1.frequency.value = f; o2.frequency.value = f * 2.002; o3.frequency.value = f * 0.998;
    const lp = x.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(f * 9, 7000), t); lp.frequency.exponentialRampToValueAtTime(Math.max(f * 1.5, 380), t + dur);
    const h = x.createGain(); h.gain.value = 0.22; const g = x.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v || 0.3, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o1.connect(lp); o3.connect(lp); o2.connect(h); h.connect(lp); lp.connect(g); g.connect(A.master);
    [o1, o2, o3].forEach((o) => { o.start(t); o.stop(t + dur + 0.05); });
  }
  function pluck(f, t, dur, o) {
    const x = A.ctx; const sr = x.sampleRate; const damp = o.damp || 0.996;
    const key = f.toFixed(2) + '|' + damp + '|' + dur; let b = A.ks[key];
    if (!b) {
      const len = Math.floor(sr * dur); b = x.createBuffer(1, len, sr); const d = b.getChannelData(0);
      const N = Math.max(2, Math.round(sr / f));
      for (let i = 0; i < N && i < len; i++) d[i] = Math.random() * 2 - 1;
      for (let i = N; i < len; i++) d[i] = (d[i - N] + d[i - N + 1]) * 0.5 * damp;
      A.ks[key] = b;
    }
    const s = x.createBufferSource(); s.buffer = b;
    const lp = x.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.lp || 5000;
    const g = x.createGain(); g.gain.value = o.vol || 0.4;
    s.connect(lp); lp.connect(g); g.connect(A.master); s.start(t);
  }
  function bowed(f, t, dur, vol, dark) {
    const x = A.ctx; const a = x.createOscillator(), b = x.createOscillator();
    a.type = 'sawtooth'; b.type = 'sawtooth'; a.frequency.value = f; b.frequency.value = f; b.detune.value = 6;
    const lfo = x.createOscillator(); lfo.frequency.value = 5.5;
    const dp = x.createGain(); dp.gain.setValueAtTime(0, t); dp.gain.linearRampToValueAtTime(f * 0.006, t + 0.35);
    lfo.connect(dp); dp.connect(a.frequency); dp.connect(b.frequency);
    const lp = x.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = dark ? 1700 : 2600; lp.Q.value = 0.8;
    const pk = x.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = dark ? 700 : 1100; pk.gain.value = 5;
    const g = x.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.18);
    g.gain.setValueAtTime(vol, t + Math.max(0.2, dur - 0.25)); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    a.connect(lp); b.connect(lp); lp.connect(pk); pk.connect(g); g.connect(A.master);
    [a, b, lfo].forEach((n) => { n.start(t); n.stop(t + dur + 0.05); });
  }
  function voice(f, t, dur) {
    const x = A.ctx; const src = x.createOscillator(); src.type = 'sawtooth'; src.frequency.value = f;
    const lfo = x.createOscillator(); lfo.frequency.value = 5.2;
    const dp = x.createGain(); dp.gain.setValueAtTime(0, t); dp.gain.linearRampToValueAtTime(f * 0.012, t + 0.4);
    lfo.connect(dp); dp.connect(src.frequency);
    const out = x.createGain(); out.gain.setValueAtTime(0.0001, t); out.gain.linearRampToValueAtTime(0.5, t + 0.12);
    out.gain.setValueAtTime(0.5, t + Math.max(0.15, dur - 0.25)); out.gain.linearRampToValueAtTime(0.0001, t + dur);
    [[750, 7, 1], [1150, 9, 0.55], [2700, 12, 0.18]].forEach(([fr, q, gv]) => {
      const bp = x.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fr; bp.Q.value = q;
      const gg = x.createGain(); gg.gain.value = gv * 2.2; src.connect(bp); bp.connect(gg); gg.connect(out);
    });
    out.connect(A.master); [src, lfo].forEach((n) => { n.start(t); n.stop(t + dur + 0.05); });
  }
  function kick(t) {
    const x = A.ctx; const o = x.createOscillator(); const g = x.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(g); g.connect(A.master); o.start(t); o.stop(t + 0.45);
  }
  function noise(t, dur, type, freq, vol) {
    const x = A.ctx; const s = x.createBufferSource(); s.buffer = A.noise;
    const f = x.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = x.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(A.master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }
  function snare(t) {
    noise(t, 0.2, 'highpass', 1400, 0.5);
    const x = A.ctx; const o = x.createOscillator(); const g = x.createGain(); o.type = 'triangle';
    o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.1);
    g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g); g.connect(A.master); o.start(t); o.stop(t + 0.15);
  }
  const hat = (t, v) => noise(t, 0.05, 'highpass', 7500, v || 0.18);
  function groove(t, bars) {
    const b = 60 / 112;
    for (let i = 0; i < 8 * bars; i++) {
      const tt = t + i * b / 2; hat(tt, i % 2 ? 0.1 : 0.18);
      if (i % 4 === 0) kick(tt); if (i % 4 === 2) snare(tt);
    }
    return b;
  }

  /* ---------------- Recorded samples ----------------
     Real instrument recordings (tonejs-instruments, CC BY 3.0), pitch-shifted to the nearest note.
     Each instrument loads only when it's first needed. */
  const SAMPLE_SETS = {
    piano: ['C3', 'Ds3', 'Fs3', 'A3', 'C4', 'Ds4', 'Fs4', 'A4', 'C5', 'Ds5', 'Fs5', 'A5', 'C6'],
    guitar: ['E2', 'B2', 'E3', 'G3', 'B3', 'D4', 'E4', 'G4', 'B4'],
    ukulele: ['strum-c6'],
    bass: ['Cs2', 'E2', 'G2', 'As2', 'Cs3'],
    violin: ['E5', 'G5', 'C6'],
    viola: ['C4', 'E4', 'G4'],
    drums: ['kick', 'snare', 'snare-soft', 'hat', 'hat-soft', 'hat-open']
  };
  const PC = { C: 0, Cs: 1, D: 2, Ds: 3, E: 4, F: 5, Fs: 6, G: 7, Gs: 8, A: 9, As: 10, B: 11 };
  const midiOf = (n) => { const m = n.match(/^([A-G]s?)(\d)$/); return (+m[2] + 1) * 12 + PC[m[1]]; };
  const loaded = {}; const loading = {};
  function loadSet(inst) {
    if (loaded[inst]) return Promise.resolve(loaded[inst]);
    if (loading[inst]) return loading[inst];
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC || !SAMPLE_SETS[inst]) return Promise.resolve(null);
    if (!A.ctx) { ensureCtxOnly(); }
    loading[inst] = Promise.all(SAMPLE_SETS[inst].map((n) =>
      fetch(`/assets/audio/${inst}/${n}.mp3`).then((r) => { if (!r.ok) throw new Error(n); return r.arrayBuffer(); })
        .then((ab) => new Promise((res, rej) => A.ctx.decodeAudioData(ab, res, rej)))
        .then((buf) => (inst === 'drums' || inst === 'ukulele' ? { name: n, buf } : { midi: midiOf(n), buf }))
    )).then((list) => (loaded[inst] = list)).catch(() => { loading[inst] = null; return null; });
    return loading[inst];
  }
  function ensureCtxOnly() {
    // Create the audio graph without resuming it (allowed before any click); ensure() resumes on click.
    const resume = A.ctx && A.ctx.state === 'suspended';
    if (!A.ctx) { ensure(); if (A.ctx && A.ctx.state === 'running' && !userGestured) A.ctx.suspend(); }
    return resume;
  }
  let userGestured = false;
  ['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { userGestured = true; }, { once: true, capture: true }));
  function sample(inst, midi, t, dur, vol) {
    const set = loaded[inst]; if (!set) return false;
    let best = set[0];
    set.forEach((s) => { if (Math.abs(s.midi - midi) < Math.abs(best.midi - midi)) best = s; });
    const x = A.ctx; const src = x.createBufferSource(); src.buffer = best.buf;
    src.playbackRate.value = Math.pow(2, (midi - best.midi) / 12);
    const g = x.createGain(); const v = vol == null ? 0.8 : vol;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.008);
    g.gain.setValueAtTime(v, t + Math.max(0.05, dur - 0.05)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.3);
    src.connect(g); g.connect(A.master); src.start(t); src.stop(t + dur + 0.35);
    return true;
  }

  // One-shot drum hit from the recorded kit (VCSL, CC0).
  function hit(name, t, vol, o) {
    o = o || {}; const set = loaded[o.set || 'drums']; if (!set) return false;
    const s = set.find((x) => x.name === name); if (!s) return false;
    const src = A.ctx.createBufferSource(); src.buffer = s.buf;
    if (o.semis) src.playbackRate.value = Math.pow(2, o.semis / 12);
    const g = A.ctx.createGain(); const v = vol == null ? 0.8 : vol;
    g.gain.setValueAtTime(v, t);
    if (o.dur) { g.gain.setValueAtTime(v, t + o.dur); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur + 0.12); }
    src.connect(g); g.connect(A.master); src.start(t);
    if (o.dur) src.stop(t + o.dur + 0.15);
    return true;
  }
  // A real-kit groove at 112 BPM: hats on eighths, kick on 1 and 3 (plus a push), snare on 2 and 4.
  function kitGroove(t, bars, fill) {
    const b = 60 / 112; const e = b / 2;
    for (let bar = 0; bar < bars; bar++) {
      const t0 = t + bar * 4 * b;
      for (let i = 0; i < 8; i++) hit(i % 2 ? 'hat-soft' : 'hat', t0 + i * e, i % 2 ? 0.28 : 0.42);
      hit('kick', t0, 0.95); hit('kick', t0 + 2 * b, 0.9); hit('kick', t0 + 2.5 * b, 0.6);
      hit('snare', t0 + b, 0.75); hit('snare', t0 + 3 * b, 0.8);
      hit('snare-soft', t0 + 3.75 * b, 0.25);
    }
    const tEnd = t + bars * 4 * b;
    if (fill) {
      [0, 0.25, 0.5, 0.75].forEach((x, i) => hit(i < 2 ? 'snare-soft' : 'snare', tEnd - b + x * b, 0.45 + i * 0.12));
      hit('kick', tEnd, 0.95); hit('hat-open', tEnd, 0.55);
    }
    return b;
  }

  // Schedules a phrase; returns its length in seconds. Uses recordings when loaded, synth otherwise.
  function phrase(id, t) {
    const S = (inst, n, at, dur, vol) => sample(inst, n, t + at, dur, vol);
    const has = (inst) => !!loaded[inst];
    const strum = (inst, chords, dur, spread, vol) => chords.forEach(([dt, ch]) => ch.forEach((n, i) => S(inst, n, dt + i * spread, dur, vol)));
    switch (id) {
      case 'piano':
        if (has('piano')) { [60, 64, 67, 72, 76, 79].forEach((n, i) => S('piano', n, i * 0.11, 2.1, 0.6)); return 2.4; }
        [60, 64, 67, 72, 76, 79].forEach((n, i) => piano(hz(n), t + i * 0.11, 1.9)); return 2.3;
      case 'jazzpiano':
        if (has('piano')) {
          [[50, 53, 57, 60, 64], [55, 59, 62, 65, 69], [48, 52, 55, 59, 62]].forEach((ch, k) => ch.forEach((n, i) => S('piano', n, k * 0.62 + i * 0.03, 1.3, 0.35)));
          [76, 74, 72, 71, 72].forEach((n, i) => S('piano', n, 0.15 + i * 0.31 + (i % 2 ? 0.08 : 0), 0.55, 0.5)); return 2.6;
        }
        [[50, 53, 57, 60, 64], [55, 59, 62, 65, 69], [48, 52, 55, 59, 62]].forEach((ch, k) => ch.forEach((n, i) => piano(hz(n), t + k * 0.62 + i * 0.03, 1.4, 0.2))); return 2.6;
      case 'guitar':
        if (has('guitar')) { strum('guitar', [[0, [40, 47, 52, 55, 59, 64]], [0.55, [40, 47, 52, 55, 59, 64]], [1.05, [47, 55, 59, 62, 67, 71]]], 2.0, 0.028, 0.45); return 2.8; }
        break;
      case 'ukulele':
        if (has('ukulele')) {
          // Island strum on a real C6 chord: down, down-up, up-down-up, then F6 (+5) and back to C6 to ring out.
          const U = (at, semis, vol, dur) => hit('strum-c6', t + at, vol, { set: 'ukulele', semis, dur });
          const q = 0.27;
          [[0, 0, 0.9, 0.25], [q, 0, 0.8, 0.13], [1.5 * q, 0, 0.45, 0.12], [2.5 * q, 0, 0.5, 0.12], [3 * q, 0, 0.8, 0.13], [3.5 * q, 0, 0.45, 0.12],
           [4 * q, 5, 0.85, 0.25], [5 * q, 5, 0.75, 0.13], [5.5 * q, 5, 0.42, 0.12], [6.5 * q, 5, 0.48, 0.12]].forEach(([at, se, v, d]) => U(at, se, v, d));
          U(7 * q, 0, 0.95, 1.6);
          return 7 * q + 1.9;
        }
        break;
      case 'bass':
        if (has('bass')) { [36, 43, 48, 43, 41, 45, 48].forEach((n, i) => S('bass', n, i * 0.26, 0.5, 0.9)); return 2.2; }
        break;
      case 'violin':
        if (has('violin')) { S('violin', 76, 0, 0.75, 0.7); S('violin', 79, 0.72, 0.55, 0.7); S('violin', 84, 1.25, 1.3, 0.75); return 2.8; }
        break;
      case 'viola':
        if (has('viola')) { S('viola', 60, 0, 0.85, 0.75); S('viola', 64, 0.82, 0.65, 0.75); S('viola', 67, 1.45, 1.3, 0.8); return 3; }
        break;
      case 'drums': {
        if (has('drums')) { const b = kitGroove(t, 1, true); return 4 * b + 1.1; }
        const b = groove(t, 1); kick(t + 3.5 * b); kick(t + 4 * b); noise(t + 4 * b, 0.9, 'highpass', 5000, 0.22); return 3;
      }
      case 'band': {
        const b = has('drums') ? kitGroove(t, 2, false) : groove(t, 2);
        [36, 36, 43, 43, 41, 41, 43, 47].forEach((n, i) => { if (!S('bass', n, i * b, b * 0.9, 0.85)) pluck(hz(n), t + i * b, b * 0.95, { damp: 0.997, lp: 900, vol: 0.8 }); });
        [[60, 64, 67], [60, 64, 67], [53, 57, 60, 65], [55, 59, 62, 67]].forEach((ch, k) => ch.forEach((n) => { if (!S('piano', n + 12, k * 2 * b, 2 * b, 0.22)) piano(hz(n + 12), t + k * 2 * b, 2 * b, 0.12); }));
        return 8 * b + 0.6;
      }
    }
    // Synth fallback (only if recordings failed to load)
    const strumSyn = (chords, dur, o) => chords.forEach(([dt, ch]) => ch.forEach((n, i) => pluck(hz(n), t + dt + i * (o.spread || 0.024), dur, o)));
    if (id === 'guitar') { strumSyn([[0, [52, 59, 64, 67, 71, 76]], [0.5, [52, 59, 64, 67, 71, 76]]], 2.2, { damp: 0.995, lp: 4200, vol: 0.3 }); return 2.5; }
    if (id === 'ukulele') { strumSyn([[0, [67, 60, 64, 69]], [0.28, [67, 60, 64, 69]]], 1.4, { damp: 0.991, lp: 5200, vol: 0.32, spread: 0.018 }); return 2; }
    if (id === 'bass') { [36, 43, 48, 43, 41, 45, 48].forEach((n, i) => pluck(hz(n), t + i * 0.25, 1.4, { damp: 0.997, lp: 900, vol: 0.9 })); return 2.1; }
    if (id === 'violin') { bowed(hz(76), t, 0.8, 0.16); bowed(hz(79), t + 0.75, 0.6, 0.16); bowed(hz(84), t + 1.3, 1.3, 0.18); return 2.7; }
    if (id === 'viola') { bowed(hz(60), t, 0.9, 0.2, true); bowed(hz(64), t + 0.85, 0.7, 0.2, true); bowed(hz(67), t + 1.5, 1.3, 0.22, true); return 2.9; }
    return 0;
  }
  const SETS_FOR = { piano: ['piano'], jazzpiano: ['piano'], guitar: ['guitar'], ukulele: ['ukulele'], bass: ['bass'], violin: ['violin'], viola: ['viola'], band: ['drums', 'bass', 'piano'], drums: ['drums'] };
  // Plays a phrase once its recordings are ready; resolves to the phrase length.
  function playSound(id) {
    if (!ensure()) return Promise.resolve(0);
    return Promise.all((SETS_FOR[id] || []).map(loadSet)).then(() => phrase(id, A.ctx.currentTime + 0.05));
  }
  const preload = (id) => (SETS_FOR[id] || []).forEach((inst) => { if (!loaded[inst]) loadSet(inst); });

  /* ---------------- Play buttons (instrument cards, teacher "Hear" buttons) ---------------- */
  let playTimer;
  $$('[data-play]').forEach((btn) => btn.addEventListener('click', () => {
    const id = btn.dataset.play;
    $$('.inst.is-playing, .hear.on').forEach((el) => el.classList.remove('is-playing', 'on'));
    const card = btn.closest('.inst'); const target = card || btn;
    target.classList.add(card ? 'is-playing' : 'on');
    clearTimeout(playTimer);
    playSound(id).then((len) => {
      clearTimeout(playTimer);
      playTimer = setTimeout(() => target.classList.remove('is-playing', 'on'), Math.max(len, 0.3) * 1000);
    });
  }));
  // Warm up recordings when a play button is about to be used.
  $$('[data-play]').forEach((btn) => {
    const warm = () => { if (userGestured) preload(btn.dataset.play); };
    btn.addEventListener('pointerenter', warm); btn.addEventListener('focus', warm);
  });

  /* ---------------- Keyboard ---------------- */
  const flash = (midi, ms) => {
    const k = $(`[data-midi="${midi}"]`); if (!k) return;
    k.classList.add('on'); setTimeout(() => k.classList.remove('on'), ms);
  };
  const press = (midi) => {
    if (ensure()) { const t = A.ctx.currentTime + 0.005; if (!sample('piano', midi, t, 1.6, 0.7)) { piano(hz(midi), t, 1.7); loadSet('piano'); } }
    flash(midi, 200);
  };
  const kbd = $('.kbd');
  if (kbd) ['pointerenter', 'focusin'].forEach((ev) => kbd.addEventListener(ev, () => { if (userGestured || ev === 'focusin') loadSet('piano'); }, { once: true }));
  $$('[data-midi]').forEach((k) => {
    const m = +k.dataset.midi;
    k.addEventListener('pointerdown', (e) => { e.preventDefault(); press(m); });
    k.addEventListener('click', (e) => { if (e.detail === 0) press(m); }); // keyboard activation
  });
  const demoBtn = $('[data-demo]');
  if (demoBtn) {
    let busy = false;
    demoBtn.addEventListener('click', () => {
      if (busy || !ensure()) return; busy = true;
      const label = $('[data-demo-label]', demoBtn); if (label) label.textContent = 'Playing…';
      loadSet('piano').then(() => {
        const tune = [60, 60, 67, 67, 69, 69, 67, null, 65, 65, 64, 64, 62, 62, 60];
        const step = 0.38; const t0 = A.ctx.currentTime + 0.05;
        tune.forEach((n, i) => {
          if (n === null) return;
          const dur = n === 67 && i === 6 ? 0.7 : 0.4;
          if (!sample('piano', n, t0 + i * step, dur, 0.6)) piano(hz(n), t0 + i * step, 1.2);
          if (!sample('piano', n - 12, t0 + i * step, dur, 0.35)) piano(hz(n - 12), t0 + i * step, 1.2);
          setTimeout(() => flash(n, step * 800), 50 + i * step * 1000);
        });
        setTimeout(() => { busy = false; if (label) label.textContent = 'Hear a demo'; }, tune.length * step * 1000 + 600);
      });
    });
  }

  /* ---------------- Waveform ---------------- */
  const canvas = $('[data-wave]');
  if (canvas) {
    let energy = 0; let buf = null; const t0 = performance.now();
    const draw = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      const g = canvas.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      const t = reduced ? 0 : (performance.now() - t0) / 1000;
      let data = null, e = 0;
      if (A.analyser && A.ctx.state === 'running') {
        if (!buf) buf = new Uint8Array(A.analyser.fftSize);
        A.analyser.getByteTimeDomainData(buf); data = buf;
        for (let i = 0; i < data.length; i += 8) { const v = (data[i] - 128) / 128; e += v * v; }
        e = Math.sqrt(e / (data.length / 8));
      }
      energy = energy * 0.86 + e * 0.14;
      [{ a: 0.16, amp: 12, f: 1.1, s: 0.55, o: 0, lw: 1.2 }, { a: 0.32, amp: 18, f: 0.7, s: -0.38, o: 2, lw: 1.2 }, { a: 0.9, amp: 7, f: 1.6, s: 0.9, o: 4, lw: 2.2 }].forEach((L, li) => {
        g.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const p = x / w; const taper = Math.sin(p * Math.PI);
          let y = h / 2 + Math.sin(p * Math.PI * 2 * L.f + t * L.s + L.o) * L.amp * taper;
          if (li === 2 && data) { const idx = Math.floor(p * (data.length - 1)); y += ((data[idx] - 128) / 128) * h * 0.9 * taper; }
          else y += Math.sin(p * 34 + t * 5 + li) * energy * h * 1.4 * taper * (li + 1) / 3;
          x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
        const alpha = li === 2 ? Math.min(1, L.a + energy * 3) : L.a + energy;
        g.strokeStyle = 'rgba(0,173,107,' + alpha.toFixed(3) + ')'; g.lineWidth = L.lw; g.lineCap = 'round'; g.stroke();
      });
    };
    let visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(canvas);
    const loop = () => { if (visible) draw(); requestAnimationFrame(loop); };
    if (reduced) { draw(); window.addEventListener('resize', draw); } else requestAnimationFrame(loop);
  }

  /* ---------------- Header: sound toggle + mobile menu ---------------- */
  $$('[data-sound-toggle]').forEach((b) => b.addEventListener('click', () => {
    soundOn = !soundOn; try { localStorage.setItem('grove:sound', soundOn ? 'on' : 'off'); } catch (e) {}
    syncSound();
  }));
  syncSound();
  const menuBtn = $('[data-menu-toggle]'); const mnav = $('#mobile-nav');
  if (menuBtn && mnav) {
    menuBtn.addEventListener('click', () => {
      const open = mnav.hidden; mnav.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', mnav).forEach((a) => a.addEventListener('click', () => { mnav.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }));
  }

  /* ---------------- Teacher filter + return highlight ---------------- */
  const grid = $('[data-team-grid]');
  if (grid) {
    const cards = $$('.teacher[data-insts]', grid); const count = $('[data-filter-count]');
    $$('[data-filter]').forEach((chip) => chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      $$('[data-filter]').forEach((c) => { const on = c === chip; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on)); });
      let n = 0;
      cards.forEach((card) => {
        const show = f === 'All' || card.dataset.insts.split('|').includes(f);
        card.classList.toggle('is-filtered-out', !show); if (show) n++;
      });
      if (count) count.textContent = f === 'All' ? `Showing all ${cards.length} teachers` : `${n} ${f.toLowerCase()} teacher${n === 1 ? '' : 's'}`;
    }));
  }
  if (location.hash.startsWith('#t-')) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) { el.classList.add('is-back'); setTimeout(() => el.classList.remove('is-back'), 6000); }
  }

  /* ---------------- Booking form ---------------- */
  const form = $('[data-booking]');
  if (form) {
    const done = $('[data-booking-done]');
    const ensInfo = JSON.parse(form.dataset.ensInfo || '{}');
    const prices = { 30: '$28.50', 45: '$42.75', 60: '$57.00' };
    const state = { mode: 'new', who: 'child', instrument: 'Piano', ensemble: Object.keys(ensInfo)[0] || '', length: '30' };
    const goals = new Set();

    const setGroup = (group, value) => {
      const btns = $$(`[data-group="${group}"]`, form);
      if (!btns.some((b) => b.dataset.value === value)) return;
      state[group] = value;
      btns.forEach((b) => { const on = b.dataset.value === value; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
      const hidden = form.elements[group]; if (hidden) hidden.value = value;
      render();
    };
    function render() {
      const isNew = state.mode === 'new'; const ens = state.instrument === 'An ensemble';
      $$('[data-show-when="ensemble"]', form).forEach((el) => { el.hidden = !ens; });
      $$('[data-show-when="private"]', form).forEach((el) => { el.hidden = ens; });
      $$('[data-show-when="child"]', form).forEach((el) => {
        el.hidden = state.who !== 'child';
        const input = $('input', el); if (input) input.required = state.who === 'child';
      });
      const priceLine = $('[data-price-line]', form);
      if (priceLine) priceLine.textContent = ens ? (ensInfo[state.ensemble] || '') : (isNew ? `After your free trial: ${prices[state.length]} per lesson, billed monthly.` : `Tuition: ${prices[state.length]} per lesson, billed monthly.`);
      const title = $('[data-book-title]'); if (title) title.textContent = isNew ? 'Book your free trial' : 'Register for 2026/27';
      const submit = $('[data-submit-label]', form); if (submit) submit.textContent = isNew ? 'Request my free trial' : 'Send my registration';
    }
    $$('[data-group]', form).forEach((b) => b.addEventListener('click', () => setGroup(b.dataset.group, b.dataset.value)));
    $$('[data-toggle="goal"]', form).forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset.value; goals.has(v) ? goals.delete(v) : goals.add(v);
      const on = goals.has(v); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
      form.elements.goalTags.value = Array.from(goals).join(', ');
    }));

    // Presets from the URL, e.g. /book/?inst=Piano&len=45&teacher=Vena%20Lin
    const p = new URLSearchParams(location.search);
    if (p.get('mode')) setGroup('mode', p.get('mode'));
    if (p.get('inst')) setGroup('instrument', p.get('inst') === 'Bass' ? 'Bass Guitar' : p.get('inst'));
    if (p.get('ens')) setGroup('ensemble', p.get('ens'));
    if (p.get('len')) setGroup('length', String(p.get('len')));
    if (p.get('teacher') && form.elements.teacher) {
      const opt = Array.from(form.elements.teacher.options).find((o) => o.value === p.get('teacher'));
      if (opt) form.elements.teacher.value = opt.value;
    }
    render();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = $('[data-form-error]', form);
      const missing = $$('input[required]', form).filter((i) => !i.closest('[hidden]') && !i.value.trim());
      const email = form.elements.email;
      if (missing.length || (email.value && !email.checkValidity())) {
        err.textContent = missing.length ? 'Please fill in the highlighted fields.' : 'Please check the email address.';
        err.hidden = false;
        $$('input', form).forEach((i) => i.setAttribute('aria-invalid', String(missing.includes(i) || (i === email && !email.checkValidity()))));
        (missing[0] || email).focus();
        return;
      }
      err.hidden = true;
      // Staging: nothing is sent. At launch, POST new FormData(form) to Opus1 or a form service here.
      const ens = state.instrument === 'An ensemble';
      const summary = ens ? state.ensemble : `${state.length}-minute ${state.instrument.toLowerCase()}`;
      $('[data-done-msg]', done).textContent = state.mode === 'new'
        ? `Thanks! We'll be in touch to schedule a free ${summary} trial.`
        : `Thanks! We'll confirm the ${summary} spot for 2026/27.`;
      form.hidden = true; done.hidden = false; done.focus && done.setAttribute('tabindex', '-1'); done.focus();
      if (ensure()) { loadSet('piano').then(() => { const t = A.ctx.currentTime + 0.03; [72, 76, 79, 84].forEach((n, i) => { if (!sample('piano', n, t + i * 0.09, 1.4, 0.5)) piano(hz(n), t + i * 0.09, 1.6); }); }); }
    });
    const reset = $('[data-booking-reset]');
    if (reset) reset.addEventListener('click', () => { form.reset(); goals.clear(); $$('[data-toggle="goal"]', form).forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); }); done.hidden = true; form.hidden = false; render(); });
  }
})();
