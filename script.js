// ==========================================
// REEF - INTERACTIVE SYSTEM & REAL-TIME 60FPS CANVAS ENGINE
// ==========================================

// Global State
let currentHealthPercent = 72;
let mousePos = { x: -100, y: -100 };
let isAudioPlaying = false;
let audioCtx = null;
let masterGain = null;

document.addEventListener('DOMContentLoaded', () => {
  initOceanCanvas();
  initVoicesAudioSystem();
  initSlider();
  initPulseSystem();
  initAdoptSystem();
  initVolunteerSystem();
  initPromiseWall();
  initNewsletter();
  initScrollObservers();
  initHudTicker();
});

/* ------------------------------------------
   1. FULL VIEWPORT REAL-TIME 60FPS CANVAS ENGINE
   ------------------------------------------ */
function initOceanCanvas() {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    if (Math.random() < 0.3) {
      bubbles.push(new GlassBubble(mousePos.x + (Math.random() * 30 - 15), mousePos.y + 10, true));
    }
  });

  // A. Glass Bubbles Class (Distributed across full viewport height)
  class GlassBubble {
    constructor(x, y, isMouseSpawned = false) {
      this.reset(x, y, isMouseSpawned);
    }

    reset(x, y, isMouseSpawned = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : height + Math.random() * 100;
      this.radius = isMouseSpawned ? Math.random() * 5 + 3 : Math.random() * 11 + 4;
      this.speed = isMouseSpawned ? Math.random() * 1.6 + 1.2 : Math.random() * 0.85 + 0.4;
      this.wiggleSpeed = Math.random() * 0.03 + 0.01;
      this.wiggleAmp = Math.random() * 1.8 + 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.alpha = Math.random() * 0.45 + 0.25;
    }

    update() {
      this.y -= this.speed;
      this.angle += this.wiggleSpeed;
      this.x += Math.sin(this.angle) * this.wiggleAmp * 0.5;

      if (this.y < -35) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      const grad = ctx.createRadialGradient(
        this.x - this.radius * 0.3,
        this.y - this.radius * 0.3,
        this.radius * 0.1,
        this.x,
        this.y,
        this.radius
      );
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.4, 'rgba(93, 217, 193, 0.3)');
      grad.addColorStop(1, 'rgba(0, 180, 216, 0.05)');

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x - this.radius * 0.35, this.y - this.radius * 0.35, this.radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();

      ctx.restore();
    }
  }

  // B. Schooling Tropical Fish Class
  class CanvasFish {
    constructor(y, size, speed, color) {
      this.x = -60 - Math.random() * 400;
      this.y = y;
      this.size = size;
      this.speed = speed;
      this.color = color;
      this.tailAngle = Math.random() * Math.PI * 2;
      this.tailSpeed = Math.random() * 0.16 + 0.1;
    }

    update() {
      this.x += this.speed;
      this.tailAngle += this.tailSpeed;
      if (this.x > width + 120) {
        this.x = -80;
        this.y = Math.random() * (height * 0.9);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = 0.5;

      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      const tailWiggle = Math.sin(this.tailAngle) * 6;
      ctx.beginPath();
      ctx.moveTo(-this.size + 2, 0);
      ctx.lineTo(-this.size - this.size * 0.8, -this.size * 0.5 + tailWiggle);
      ctx.lineTo(-this.size - this.size * 0.8, this.size * 0.5 + tailWiggle);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.size * 0.5, -this.size * 0.15, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fill();

      ctx.restore();
    }
  }

  // C. Canvas Jellyfish Swarm Class
  class CanvasJellyfish {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.baseY = y;
      this.pulse = Math.random() * Math.PI * 2;
      this.speed = 0.025 + Math.random() * 0.01;
    }

    update() {
      this.pulse += this.speed;
      this.y = this.baseY + Math.sin(this.pulse) * 30;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = 0.55;

      const pulseScale = 1 + Math.sin(this.pulse * 2) * 0.09;

      ctx.beginPath();
      ctx.arc(0, 0, 24 * pulseScale, Math.PI, 0, false);
      ctx.quadraticCurveTo(18, 10, 0, 8);
      ctx.quadraticCurveTo(-18, 10, -24 * pulseScale, 0);
      ctx.fillStyle = 'rgba(93, 217, 193, 0.28)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(93, 217, 193, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (let i = -16; i <= 16; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 8);
        const wave = Math.sin(this.pulse * 3 + i) * 8;
        ctx.quadraticCurveTo(i + wave, 35, i - wave * 0.5, 60);
        ctx.strokeStyle = 'rgba(93, 217, 193, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // D. Canvas Sea Turtle Class
  class CanvasSeaTurtle {
    constructor(startX, startY, speed) {
      this.x = startX;
      this.y = startY;
      this.speed = speed;
      this.flipperAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speed;
      this.flipperAngle += 0.04;
      this.y += Math.sin(this.x * 0.005) * 0.35;

      if (this.x > width + 180) {
        this.x = -180;
        this.y = Math.random() * (height * 0.7) + 50;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = 0.6;

      const flipperWave = Math.sin(this.flipperAngle) * 0.35;

      ctx.beginPath();
      ctx.ellipse(0, 0, 32, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1b4d3e';
      ctx.fill();
      ctx.strokeStyle = '#5dd9c1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 14, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(93, 217, 193, 0.4)';
      ctx.stroke();

      ctx.save();
      ctx.rotate(flipperWave);
      ctx.beginPath();
      ctx.ellipse(12, -22, 18, 6, Math.PI * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#143e32';
      ctx.fill();
      ctx.strokeStyle = '#5dd9c1';
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(-flipperWave);
      ctx.beginPath();
      ctx.ellipse(12, 22, 18, 6, -Math.PI * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#143e32';
      ctx.fill();
      ctx.strokeStyle = '#5dd9c1';
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.ellipse(36, 0, 9, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1b4d3e';
      ctx.fill();
      ctx.strokeStyle = '#5dd9c1';
      ctx.stroke();

      ctx.restore();
    }
  }

  // E. Lightning Caustics Light Rays Class
  class LightningRay {
    constructor(x, widthVal, alpha) {
      this.x = x;
      this.width = widthVal;
      this.alpha = alpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.pulse += this.pulseSpeed;
    }

    draw() {
      ctx.save();
      const currentAlpha = (Math.sin(this.pulse) * 0.5 + 0.5) * this.alpha;
      ctx.globalAlpha = currentAlpha;

      const rayGrad = ctx.createLinearGradient(this.x, 0, this.x + 80, height);
      rayGrad.addColorStop(0, 'rgba(93, 217, 193, 0.25)');
      rayGrad.addColorStop(0.5, 'rgba(0, 180, 216, 0.15)');
      rayGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(this.x, 0);
      ctx.lineTo(this.x + this.width, 0);
      ctx.lineTo(this.x + this.width + 120, height);
      ctx.lineTo(this.x + 120, height);
      ctx.closePath();

      ctx.fillStyle = rayGrad;
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate Instances Across Full Viewport Height
  const bubbles = [];
  for (let i = 0; i < 60; i++) {
    bubbles.push(new GlassBubble(Math.random() * width, Math.random() * height));
  }

  const fishList = [
    new CanvasFish(height * 0.12, 14, 1.2, '#5dd9c1'),
    new CanvasFish(height * 0.24, 18, 1.5, '#00b4d8'),
    new CanvasFish(height * 0.36, 12, 0.9, '#ff6b6b'),
    new CanvasFish(height * 0.48, 16, 1.1, '#5dd9c1'),
    new CanvasFish(height * 0.62, 20, 1.4, '#00b4d8'),
    new CanvasFish(height * 0.76, 13, 0.85, '#5dd9c1'),
    new CanvasFish(height * 0.88, 17, 1.3, '#00b4d8'),
    new CanvasFish(height * 0.42, 15, 1.6, '#5dd9c1'),
  ];

  const jellyfishSwarm = [
    new CanvasJellyfish(width * 0.85, height * 0.22),
    new CanvasJellyfish(width * 0.12, height * 0.45),
    new CanvasJellyfish(width * 0.88, height * 0.68),
    new CanvasJellyfish(width * 0.18, height * 0.88),
  ];

  const seaTurtles = [
    new CanvasSeaTurtle(-150, height * 0.3, 0.75),
    new CanvasSeaTurtle(-450, height * 0.7, 0.65),
  ];

  const lightningRays = [
    new LightningRay(width * 0.15, 60, 0.4),
    new LightningRay(width * 0.4, 90, 0.5),
    new LightningRay(width * 0.7, 75, 0.45),
  ];

  // 60FPS Main Render Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw Lightning Light Rays
    for (let i = 0; i < lightningRays.length; i++) {
      lightningRays[i].update();
      lightningRays[i].draw();
    }

    // Draw Floating Bubbles
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].update();
      bubbles[i].draw();
    }

    if (bubbles.length > 70) {
      bubbles.splice(0, bubbles.length - 70);
    }

    // Draw Sea Turtles
    for (let i = 0; i < seaTurtles.length; i++) {
      seaTurtles[i].update();
      seaTurtles[i].draw();
    }

    // Draw Jellyfish Swarm
    for (let i = 0; i < jellyfishSwarm.length; i++) {
      jellyfishSwarm[i].update();
      jellyfishSwarm[i].draw();
    }

    // Draw Schooling Fish
    for (let i = 0; i < fishList.length; i++) {
      fishList[i].update();
      fishList[i].draw();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ------------------------------------------
   2. VOICES OF THE OCEAN AUDIO & FILTER SYSTEM
   ------------------------------------------ */
function initVoicesAudioSystem() {
  const btnToggle = document.getElementById('btnToggleAudio');
  const btnText = document.getElementById('audioBtnText');
  const btnIcon = document.getElementById('audioBtnIcon');
  const waveform = document.getElementById('waveformVisualizer');

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      if (!isAudioPlaying) {
        startOceanSoundscape();
        isAudioPlaying = true;
        if (btnText) btnText.textContent = "Pause Bio-Acoustic Soundscape";
        if (btnIcon) btnIcon.textContent = "⏸️";
        if (waveform) waveform.classList.add('playing');
        showToast("🎧 Hydrophone Array Live: Listening to ambient underwater reef soundscape");
      } else {
        stopOceanSoundscape();
        isAudioPlaying = false;
        if (btnText) btnText.textContent = "Play Bio-Acoustic Soundscape";
        if (btnIcon) btnIcon.textContent = "🔊";
        if (waveform) waveform.classList.remove('playing');
        showToast("⏸️ Hydrophone Soundscape paused");
      }
    });
  }

  const filterTabs = document.querySelectorAll('.filter-tab');
  const voiceCards = document.querySelectorAll('.voice-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      voiceCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  const voiceListenBtns = document.querySelectorAll('.btn-listen-voice');
  voiceListenBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const soundType = btn.getAttribute('data-sound');
      playSpeciesSound(soundType);
    });
  });
}

function startOceanSoundscape() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioCtxClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    whiteNoise.start();

  } catch (err) {
    console.log("Web Audio Context initialized", err);
  }
}

function stopOceanSoundscape() {
  if (masterGain && audioCtx) {
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
  }
}

function playSpeciesSound(type) {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtxClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'whale') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
      showToast("🐋 Listening to Blue Whale low-frequency acoustic call (140Hz)");
    } else if (type === 'turtle') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
      showToast("🐢 Listening to Loggerhead Sea Turtle hydrophone pulse (420Hz)");
    } else if (type === 'coral') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
      showToast("🪸 Listening to Coral Reef bio-acoustic crackle (1.2kHz)");
    } else if (type === 'shark') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.9);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
      showToast("🦈 Listening to Apex Shark telemetry beacon (110Hz)");
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      showToast("🐠 Listening to Reef Fish grazing bio-chatter");
    }
  } catch (e) {
    showToast(`🔊 Listening to ${type} acoustic signal`);
  }
}

/* ------------------------------------------
   3. BEFORE-AFTER SLIDER FUNCTIONALITY
   ------------------------------------------ */
function initSlider() {
  const container = document.getElementById('comparisonContainer');
  const beforeWrapper = document.getElementById('imgBeforeWrapper');
  const handle = document.getElementById('sliderHandle');
  if (!container || !beforeWrapper || !handle) return;

  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    beforeWrapper.style.width = percent + '%';
    handle.style.left = percent + '%';
  };

  container.addEventListener('mousedown', () => { isDragging = true; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) updateSlider(e.clientX);
  });

  container.addEventListener('touchstart', () => { isDragging = true; });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX);
  });
}

/* ------------------------------------------
   4. REEF VITALITY & PULSE SYSTEM
   ------------------------------------------ */
function initPulseSystem() {
  const heroHeart = document.getElementById('heroPulseHeart');
  const btnBoost = document.getElementById('btnBoostHealth');

  if (heroHeart) {
    heroHeart.addEventListener('click', () => {
      boostReefHealth(1, "💓 Interactive Core Pulse triggered! Vitality boosted.");
    });
  }

  if (btnBoost) {
    btnBoost.addEventListener('click', () => {
      boostReefHealth(1, "✨ Conservation Action Boost applied! Vitality +1%");
    });
  }
}

function boostReefHealth(amount, message) {
  if (currentHealthPercent < 99) {
    currentHealthPercent += amount;
    if (currentHealthPercent > 99) currentHealthPercent = 99;
    updateHealthDisplays();
  }
  if (message) showToast(message);
}

function updateHealthDisplays() {
  const meterVal = document.getElementById('meterHealthVal');
  const navVal = document.getElementById('navPulseValue');
  const hudVal = document.getElementById('hudPulseText');
  const circle = document.getElementById('healthProgressCircle');

  if (meterVal) meterVal.textContent = currentHealthPercent + '%';
  if (navVal) navVal.textContent = currentHealthPercent + '%';
  if (hudVal) hudVal.textContent = currentHealthPercent + '%';

  if (circle) {
    const offset = 408 - (408 * (currentHealthPercent / 100));
    circle.style.strokeDashoffset = offset;
  }
}

/* ------------------------------------------
   5. ADOPT A CORAL FRAGMENT SYSTEM
   ------------------------------------------ */
function initAdoptSystem() {
  const options = document.querySelectorAll('.coral-option');
  const titleEl = document.getElementById('selectedCoralTitle');
  const descEl = document.getElementById('selectedCoralDesc');
  const growthEl = document.getElementById('selectedCoralGrowth');
  const progressFill = document.getElementById('adoptProgressFill');
  const btnAdopt = document.getElementById('btnAdoptNow');

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const name = opt.getAttribute('data-name');
      const desc = opt.getAttribute('data-desc');
      const growth = opt.getAttribute('data-growth');

      if (titleEl) titleEl.textContent = name + ' Fragment';
      if (descEl) descEl.textContent = desc;
      if (growthEl) growthEl.textContent = growth;

      if (progressFill) {
        const randWidth = 25 + Math.floor(Math.random() * 50);
        progressFill.style.width = randWidth + '%';
      }
    });
  });

  if (btnAdopt) {
    btnAdopt.addEventListener('click', () => {
      const activeOpt = document.querySelector('.coral-option.active');
      const name = activeOpt ? activeOpt.getAttribute('data-name') : 'Coral';
      boostReefHealth(2);
      showToast(`🪸 Congratulations! You adopted a ${name} fragment. Certificate & GPS tracking sent.`);
    });
  }
}

/* ------------------------------------------
   6. VOLUNTEER & DIVE RESERVATION SYSTEM
   ------------------------------------------ */
function initVolunteerSystem() {
  const btnReserve = document.getElementById('btnReserveDive');
  const spotsCount = document.getElementById('diveSpotsCount');
  let spotsLeft = 4;

  if (btnReserve) {
    btnReserve.addEventListener('click', () => {
      if (spotsLeft > 0) {
        spotsLeft--;
        if (spotsCount) spotsCount.textContent = `${spotsLeft} Spots Left`;
        boostReefHealth(1);
        showToast("🤿 Reserved 1 spot for Key Largo Reef Dive! Check your email for expedition details.");
      } else {
        showToast("⚠️ This dive event is fully booked! Explore shoreline activities below.");
      }
    });
  }

  const activityBtns = document.querySelectorAll('.btn-activity-join');
  activityBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      boostReefHealth(1);
      showToast("🤝 Thank you for joining our conservation team! We will be in touch shortly.");
    });
  });
}

/* ------------------------------------------
   7. PROMISE WALL & MODAL FUNCTIONALITY
   ------------------------------------------ */
function initPromiseWall() {
  const promiseInput = document.getElementById('promiseInput');
  const promiseBtn = document.getElementById('promiseBtn');
  const promiseWall = document.getElementById('promiseWall');

  const starterPromises = [
    "I will stop using single-use plastic",
    "I will pick up litter at the beach",
    "I will choose reef-safe sunscreen"
  ];

  if (promiseWall) {
    starterPromises.forEach(text => addPromiseCard(text, promiseWall));
  }

  if (promiseBtn && promiseInput) {
    promiseBtn.addEventListener('click', () => {
      const text = promiseInput.value.trim();
      if (!text) return;
      addPromiseCard(text, promiseWall);
      promiseInput.value = '';
      boostReefHealth(1, "🌊 Promise added to the wall! Reef health boosted.");
    });

    promiseInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') promiseBtn.click();
    });
  }

  const modalBtn = document.getElementById('promiseInfoBtn');
  const modalOverlay = document.getElementById('promiseModalOverlay');
  const modalClose = document.getElementById('promiseModalClose');

  if (modalBtn && modalOverlay) {
    modalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
  }
  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay) modalOverlay.classList.remove('active');
  });
}

function addPromiseCard(text, wallEl) {
  if (!wallEl) return;
  const card = document.createElement('div');
  card.className = 'promise-card';
  card.textContent = '🌊 ' + text;
  wallEl.appendChild(card);
}

/* ------------------------------------------
   8. NEWSLETTER SYSTEM
   ------------------------------------------ */
function initNewsletter() {
  const btn = document.getElementById('btnNewsletter');
  const emailInput = document.getElementById('newsletterEmail');

  if (btn && emailInput) {
    btn.addEventListener('click', () => {
      if (emailInput.value.includes('@')) {
        showToast("📨 Subscribed to Field Notes! Welcome to the REEF conservation network.");
        emailInput.value = '';
      } else {
        showToast("⚠️ Please enter a valid email address.");
      }
    });
  }
}

/* ------------------------------------------
   9. SCROLL REVEAL & COUNT-UP OBSERVERS
   ------------------------------------------ */
function initScrollObservers() {
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.25 });

  revealElements.forEach(el => revealObserver.observe(el));

  const statNumbers = document.querySelectorAll('.stat-number');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countObserver.observe(el));
}

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(progress * target);
    el.textContent = currentValue.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ------------------------------------------
   10. DYNAMIC HUD TICKER
   ------------------------------------------ */
function initHudTicker() {
  const depthEl = document.getElementById('hudDepth');
  if (!depthEl) return;

  setInterval(() => {
    const randomOffset = Math.floor(Math.random() * 3) - 1;
    let depth = parseInt(depthEl.textContent) + randomOffset;
    if (depth < 140) depth = 140;
    if (depth > 146) depth = 146;
    depthEl.textContent = depth;
  }, 4000);
}

/* ------------------------------------------
   11. TOAST NOTIFICATION UTILITY
   ------------------------------------------ */
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}