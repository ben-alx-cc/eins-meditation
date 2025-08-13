"use strict";

// Basquiat-inspirierte interaktive Leinwand

(function () {
  const canvas = document.getElementById("scene");
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

  // Audio
  let audioContext = null;
  let masterGain = null;
  let audioUnlocked = false;

  // Elemente und Animation
  const elements = [];
  const MAX_ELEMENTS = 220;
  let width = 0;
  let height = 0;
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  // Farbpalette (kräftig, kontrastreich)
  const COLORS = [
    "#ff004d", // Magenta-Rot
    "#ffd400", // Gelb
    "#00e5ff", // Cyan
    "#00d12a", // Grün
    "#ff7a00", // Orange
    "#1a1a1a", // Tief-Schwarzgrau
    "#ffffff", // Weiß
    "#3137fd"  // Blau
  ];

  const TEXT_FRAGMENTS = [
    "X", "CROWN", "RAW", "SAME", "RHYME", "BONE", "JAZZ", "ECHO", "RAY", "ATOM",
    "VOID", "FLUX", "NOISE", "DREAM", "RISE", "FUGA"
  ];

  // Shake Detection
  let lastShake = 0;
  const SHAKE_THRESHOLD = 18.0; // m/s^2
  const SHAKE_COOLDOWN_MS = 1200;

  function resize() {
    const { innerWidth, innerHeight } = window;
    width = innerWidth;
    height = innerHeight;
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    clearCanvas();
  }

  function clearCanvas() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function choice(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function createAudio() {
    if (audioUnlocked) return;
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    masterGain = masterGain || audioContext.createGain();
    masterGain.gain.value = 0.18; // sehr sanft
    masterGain.connect(audioContext.destination);
    audioUnlocked = true;
  }

  function playChime(baseFreq) {
    if (!audioUnlocked || !audioContext) return;
    const now = audioContext.currentTime;

    const freq = baseFreq || choice([220, 247, 262, 294, 330, 392, 440, 494, 523]) * choice([1, 2]);

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.value = freq + rand(-6, 6);
    filter.type = "highpass";
    filter.frequency.value = 180;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + rand(0.9, 1.6));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  function vibrate(pattern) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (_) {}
    }
  }

  function randomComposite() {
    return choice(["source-over", "multiply", "screen", "overlay", "lighten", "difference"]);
  }

  function spawnElement(x, y) {
    const type = choice(["line", "circle", "rect", "poly", "scribble", "text", "patch"]);
    const color = choice(COLORS);
    const size = rand(12, 160);
    const element = {
      type,
      x,
      y,
      color,
      alpha: rand(0.65, 1),
      rotation: rand(0, Math.PI * 2),
      size,
      vx: rand(-0.25, 0.25),
      vy: rand(-0.25, 0.25),
      va: rand(-0.01, 0.01),
      lineWidth: rand(1, 7),
      composite: randomComposite(),
      text: choice(TEXT_FRAGMENTS),
      points: undefined
    };

    if (type === "poly") {
      const sides = (Math.random() < 0.5 ? 3 : 4);
      element.points = new Array(sides).fill(0).map(() => ({
        x: rand(-size * 0.6, size * 0.6),
        y: rand(-size * 0.6, size * 0.6)
      }));
    }

    if (type === "scribble" || type === "patch") {
      const count = (type === "scribble") ? 14 : 8;
      element.points = new Array(count).fill(0).map(() => ({
        x: rand(-size, size),
        y: rand(-size, size)
      }));
    }

    elements.push(element);
    if (elements.length > MAX_ELEMENTS) elements.splice(0, elements.length - MAX_ELEMENTS);

    // Feedback
    vibrate([8, 20, 8]);
    playChime();
  }

  function drawElement(e) {
    ctx.save();
    ctx.globalAlpha = e.alpha;
    ctx.globalCompositeOperation = e.composite;
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rotation);
    ctx.lineWidth = e.lineWidth;
    ctx.strokeStyle = e.color;
    ctx.fillStyle = e.color;

    switch (e.type) {
      case "line": {
        const len = e.size * rand(0.7, 1.4);
        ctx.beginPath();
        const jitter = () => rand(-4, 4);
        ctx.moveTo(-len / 2 + jitter(), jitter());
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(-len / 2 + (len / 6) * i + jitter(), jitter());
        }
        ctx.stroke();
        break;
      }
      case "circle": {
        const r = Math.max(2, e.size * 0.5);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        if (Math.random() < 0.5) ctx.stroke(); else ctx.fill();
        break;
      }
      case "rect": {
        const s = e.size;
        if (Math.random() < 0.4) {
          ctx.strokeRect(-s / 2, -s / 2, s, s * rand(0.6, 1.2));
        } else {
          ctx.fillRect(-s / 2, -s / 2, s * rand(0.6, 1.4), s);
        }
        break;
      }
      case "poly": {
        const pts = e.points;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath();
        if (Math.random() < 0.5) ctx.stroke(); else ctx.fill();
        break;
      }
      case "scribble": {
        const pts = e.points;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x + rand(-6, 6), p.y + rand(-6, 6));
        }
        ctx.stroke();
        break;
      }
      case "patch": {
        const pts = e.points;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i];
          const prev = pts[i - 1];
          const cx = (p.x + prev.x) / 2 + rand(-8, 8);
          const cy = (p.y + prev.y) / 2 + rand(-8, 8);
          ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
        }
        ctx.closePath();
        ctx.globalAlpha = e.alpha * 0.55;
        ctx.fill();
        ctx.globalAlpha = e.alpha;
        ctx.stroke();
        break;
      }
      case "text": {
        const s = clamp(e.size * rand(0.9, 1.5), 14, 128);
        ctx.font = `${s}px ui-sans-serif, -apple-system, Helvetica, Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (Math.random() < 0.25) {
          ctx.strokeText(e.text, 0, 0);
        } else {
          ctx.fillText(e.text, 0, 0);
        }
        break;
      }
    }

    ctx.restore();
  }

  function updateElement(e) {
    e.x += e.vx;
    e.y += e.vy;
    e.rotation += e.va;
    // sanftes Pulsieren
    e.alpha = clamp(e.alpha + Math.sin((performance.now() / 1000) + e.x * 0.01) * 0.002, 0.35, 1);
  }

  function addLayer() {
    // großflächige Schicht
    for (let i = 0; i < 24; i++) {
      spawnElement(rand(0, width), rand(0, height));
    }
    // leichte Verzerrung der bestehenden Elemente
    for (let i = 0; i < elements.length; i++) {
      elements[i].vx += rand(-0.2, 0.2);
      elements[i].vy += rand(-0.2, 0.2);
      elements[i].va += rand(-0.01, 0.01);
    }
    vibrate([12, 40, 12, 20, 12]);
    playChime(196);
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < elements.length; i++) {
      updateElement(elements[i]);
      drawElement(elements[i]);
    }
    requestAnimationFrame(render);
  }

  function onPointer(e) {
    const touches = e.touches ? Array.from(e.touches) : [e];
    for (const t of touches) {
      const x = (t.clientX != null ? t.clientX : t.pageX);
      const y = (t.clientY != null ? t.clientY : t.pageY);
      for (let i = 0; i < (e.type === "pointerdown" || e.type === "touchstart" ? rand(2, 5)|0 : 1); i++) {
        spawnElement(x + rand(-10, 10), y + rand(-10, 10));
      }
    }
  }

  function enableMotionIfNeeded() {
    const needsPermission = typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function";
    if (needsPermission) {
      DeviceMotionEvent.requestPermission().then(state => {
        // state: 'granted' | 'denied'
        if (state === "granted") {
          window.addEventListener("devicemotion", onMotion, { passive: true });
        }
      }).catch(() => {});
    } else {
      window.addEventListener("devicemotion", onMotion, { passive: true });
    }
  }

  function onMotion(e) {
    const acc = e.accelerationIncludingGravity || e.acceleration;
    if (!acc) return;
    const mag = Math.sqrt((acc.x || 0) * (acc.x || 0) + (acc.y || 0) * (acc.y || 0) + (acc.z || 0) * (acc.z || 0));
    const now = Date.now();
    if (mag > SHAKE_THRESHOLD && (now - lastShake) > SHAKE_COOLDOWN_MS) {
      lastShake = now;
      addLayer();
    }
  }

  function hideGate() {
    const gate = document.getElementById("gate");
    if (gate) gate.classList.add("gate--hidden");
  }

  function onGateClick() {
    createAudio();
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    enableMotionIfNeeded();
    hideGate();
    playChime(330);
    vibrate([10, 20, 10]);
  }

  // Init
  resize();
  render();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);

  // Interaktionen
  const pointerOpts = { passive: false };
  canvas.addEventListener("pointerdown", onPointer, pointerOpts);
  canvas.addEventListener("pointermove", (e) => { if (e.buttons) onPointer(e); }, pointerOpts);
  canvas.addEventListener("touchstart", onPointer, pointerOpts);
  canvas.addEventListener("touchmove", onPointer, pointerOpts);

  // Gate Button
  const gate = document.getElementById("gate");
  if (gate) {
    gate.addEventListener("click", onGateClick, { passive: true });
    gate.addEventListener("touchstart", (e) => { e.preventDefault(); onGateClick(); }, { passive: false });
  }

  // iOS Audio Unlock Fallback
  window.addEventListener("touchend", () => {
    if (audioContext && audioContext.state !== "running") {
      audioContext.resume().catch(() => {});
    }
  }, { passive: true });
})();

