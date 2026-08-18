// Year auto-update
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });

  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileMenu.classList.remove("show"));
  });
}

// Copy message logic
const copyBtn = document.getElementById("copyBtn");
const msgBox = document.getElementById("msgBox");

if (copyBtn && msgBox) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(msgBox.value);
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.textContent = "Copy Message";
      }, 1200);
    } catch {
      alert("Copy failed. Select the text and copy manually.");
    }
  });
}

// Email button handler
const emailBtn = document.getElementById("emailBtn");

if (emailBtn && msgBox) {
  emailBtn.addEventListener("click", () => {
    const subject = encodeURIComponent("Portfolio Contact - Arnab Ghorai");
    const body = encodeURIComponent(msgBox.value);
    window.location.href = `mailto:arnabghorai349@gmail.com?subject=${subject}&body=${body}`;
  });
}

// Phone number reveal button
const phoneBtn = document.getElementById("revealBtn");
const phoneText = document.getElementById("phoneText");

if (phoneBtn && phoneText) {
  const phone = "+91 89278 26085";
  let revealed = false;

  phoneBtn.addEventListener("click", async () => {
    if (!revealed) {
      revealed = true;
      phoneText.textContent = phone;
      phoneText.classList.remove("reveal-hidden");
      phoneBtn.textContent = "Copy";
      return;
    }

    try {
      await navigator.clipboard.writeText(phone);
      phoneBtn.textContent = "Copied";
      setTimeout(() => {
        phoneBtn.textContent = "Copy";
      }, 1200);
    } catch {}
  });
}

// Image Modal Preview functionality
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const closeBtn = document.getElementById("modalClose");
const openNewTab = document.getElementById("modalOpenNewTab");
const download = document.getElementById("modalDownload");

function openModal(src, title) {
  if (!modal || !modalImg || !modalTitle || !openNewTab || !download || !src) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  modalImg.src = src;
  modalImg.alt = title || "Preview";
  modalTitle.textContent = title || "Preview";
  openNewTab.href = src;
  download.href = src;
  download.setAttribute("download", "");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal || !modalImg) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  modalImg.removeAttribute("src");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-open]");
  if (!target) return;
  const src = target.getAttribute("data-open");
  const title = target.getAttribute("data-title") || "Preview";
  if (src) openModal(src, title);
});

if (closeBtn) closeBtn.addEventListener("click", closeModal);

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Avatar fallback logic
function setProfileAvatarState() {
  const profileAvatar = document.getElementById("profileAvatar");
  if (!profileAvatar) return;

  const wrapper = profileAvatar.closest(".profile-avatar-wrap");
  const fallback = wrapper ? wrapper.querySelector(".profile-avatar-fallback") : null;

  const showFallback = () => {
    profileAvatar.classList.add("is-hidden");
    if (fallback) fallback.style.display = "flex";
  };

  const showImage = () => {
    profileAvatar.classList.remove("is-hidden");
    if (fallback) fallback.style.display = "none";
  };

  if (!profileAvatar.getAttribute("src")) {
    showFallback();
    return;
  }

  const tester = new Image();
  tester.onload = showImage;
  tester.onerror = showFallback;
  tester.src = profileAvatar.getAttribute("src");
}

// Media Cards Initialization (Projects & Gallery)
function setMediaCardState(card, hasImage, loadedSrc) {
  if (!card) return;

  const isGallery = card.dataset.mediaCard === "gallery";
  const img = card.querySelector(isGallery ? ".gallery-thumb-img" : ".project-thumb-img");
  const btn = card.querySelector(isGallery ? ".gallery-thumb-btn" : ".project-thumb-btn");
  const actions = card.querySelector(isGallery ? ".gallery-actions" : ".project-media-actions");
  const zoomBtn = card.querySelector(isGallery ? ".gallery-zoom-btn" : ".media-zoom-btn");
  const tabBtn = card.querySelector(isGallery ? ".gallery-tab-btn" : ".media-tab-btn");

  if (!img || !btn || !actions) return;

  card.classList.remove("media-has-image", "media-missing");

  if (hasImage && loadedSrc) {
    card.classList.add("media-has-image");
    img.style.display = "block";
    btn.setAttribute("data-open", loadedSrc);

    if (zoomBtn) {
      zoomBtn.style.display = "inline-flex";
      zoomBtn.setAttribute("data-open", loadedSrc);
      zoomBtn.setAttribute("data-title", btn.getAttribute("data-title") || "Preview");
    }

    if (tabBtn) {
      tabBtn.style.display = "inline-flex";
      tabBtn.href = loadedSrc;
      tabBtn.setAttribute("target", "_blank");
      tabBtn.setAttribute("rel", "noreferrer");
    }

    actions.classList.remove("is-hidden");
  } else {
    card.classList.add("media-missing");
    img.style.display = "none";
    img.removeAttribute("src");
    btn.removeAttribute("data-open");

    if (zoomBtn) {
      zoomBtn.style.display = "none";
      zoomBtn.removeAttribute("data-open");
    }

    if (tabBtn) {
      tabBtn.style.display = "none";
      tabBtn.removeAttribute("href");
    }

    actions.classList.add("is-hidden");
  }
}

function initMediaCards() {
  document.querySelectorAll("[data-media-card]").forEach((card) => {
    const isGallery = card.dataset.mediaCard === "gallery";
    const img = card.querySelector(isGallery ? ".gallery-thumb-img" : ".project-thumb-img");

    if (!img) {
      setMediaCardState(card, false, "");
      return;
    }

    const rawSrc = (img.getAttribute("src") || "").trim();

    if (!rawSrc) {
      setMediaCardState(card, false, "");
      return;
    }

    const tester = new Image();

    tester.onload = () => {
      setMediaCardState(card, true, rawSrc);
    };

    tester.onerror = () => {
      setMediaCardState(card, false, "");
    };

    tester.src = rawSrc;
  });
}

setProfileAvatarState();
initMediaCards();

/* =========================================================================
   CUSTOM TYPEWRITER ANIMATION WITH DELIBERATE TYPO ('Arnab Ghoria' -> 'Arnab Ghorai')
   ========================================================================= */
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const typoText = "Arnab Ghoria";
  const fullName = "Arnab Ghorai";
  const typeDelay = 110;
  const eraseDelay = 70;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function loop() {
    while (true) {
      el.textContent = "";

      for (let i = 1; i <= typoText.length; i += 1) {
        el.textContent = typoText.slice(0, i);
        await sleep(typeDelay);
      }

      await sleep(650);

      el.textContent = "Arnab Ghori";
      await sleep(eraseDelay + 30);
      el.textContent = "Arnab Ghor";
      await sleep(eraseDelay + 30);

      await sleep(250);

      el.textContent = "Arnab Ghora";
      await sleep(typeDelay);
      el.textContent = "Arnab Ghorai";
      await sleep(typeDelay);

      await sleep(2800);

      for (let i = fullName.length - 1; i >= 0; i -= 1) {
        el.textContent = fullName.slice(0, i);
        await sleep(eraseDelay);
      }

      await sleep(550);
    }
  }

  loop();
}

initTypewriter();

/* =========================================================================
   HIGH-BRIGHTNESS MULTI-COLORED NEON CANVAS GALAXY (GLOW + HIGH CONTRAST)
   ========================================================================= */
const canvas = document.getElementById("galaxyCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  const starCount = 6500;
  const stars = [];

  // Vibrant Neon Palette: Hot Pink, Electric Cyan, Neon Purple, Bright Yellow & Pure White
  const neonColors = [
    { r: 255, g: 255, b: 255, str: "rgb(255, 255, 255)" }, // Pure White
    { r: 255, g: 16,  b: 240, str: "rgb(255, 16, 240)"  }, // Hot Pink (#FF10F0)
    { r: 0,   g: 255, b: 255, str: "rgb(0, 255, 255)"   }, // Electric Cyan (#00FFFF)
    { r: 191, g: 0,   b: 255, str: "rgb(191, 0, 255)"   }, // Neon Purple (#BF00FF)
    { r: 255, g: 255, b: 0,   str: "rgb(255, 255, 0)"   }, // Bright Yellow (#FFFF00)
    { r: 0,   g: 160, b: 255, str: "rgb(0, 160, 255)"   }  // Electric Blue (#00A0FF)
  ];

  const arms = 4;
  const maxRadius = 560;

  for (let i = 0; i < starCount; i += 1) {
    const isCore = Math.random() < 0.35;
    const isSuperBright = Math.random() < 0.08;
    let r, theta;

    if (isCore) {
      r = Math.pow(Math.random(), 1.8) * (maxRadius * 0.30);
      theta = Math.random() * Math.PI * 2;
    } else {
      const armIndex = i % arms;
      const armAngle = (armIndex * 2 * Math.PI) / arms;
      const distPercent = Math.pow(Math.random(), 0.80);
      r = 18 + distPercent * maxRadius;

      const spiralAngle = distPercent * 4.2;
      const scatter = (Math.random() - 0.5) * (0.58 / (distPercent + 0.12));
      theta = armAngle + spiralAngle + scatter;
    }

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const heightFactor = Math.max(0.1, 1 - (r / maxRadius));
    const y = (Math.random() - 0.5) * 95 * heightFactor;

    // Pick vibrant neon colors randomly
    const color = isCore && Math.random() < 0.4
      ? neonColors[0]
      : neonColors[Math.floor(Math.random() * neonColors.length)];

    // Core super-bright stars vs regular stars
    let size, alpha;
    if (isSuperBright) {
      size = Math.random() * 2.2 + 2.4; // 2.4px - 4.6px
      alpha = Math.random() * 0.2 + 0.85; // High contrast
    } else {
      size = Math.random() * 1.5 + 0.75; // 0.75px - 2.25px
      alpha = Math.random() * 0.35 + 0.65; // High base opacity
    }

    stars.push({
      x, y, z,
      color,
      size,
      alpha,
      baseAlpha: alpha,
      isSuperBright
    });
  }

  // Animation States
  let idleAngleY = 0;

  let targetPitch = 0.75;
  let targetYaw = 0;
  let targetPanX = 0;
  let targetPanY = 0;

  let currentPitch = 0.75;
  let currentYaw = 0;
  let currentPanX = 0;
  let currentPanY = 0;

  let targetZoom = 1.0;
  let currentZoom = 1.0;

  // Hover Parallax
  window.addEventListener("mousemove", (e) => {
    const normX = (e.clientX / width - 0.5) * 2;
    const normY = (e.clientY / height - 0.5) * 2;

    targetPitch = 0.75 + normY * 0.32;
    targetYaw = normX * 0.35;
    targetPanX = normX * 50;
    targetPanY = normY * 35;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    targetPitch = 0.75;
    targetYaw = 0;
    targetPanX = 0;
    targetPanY = 0;
  });

  // Scroll Zoom
  function updateScrollZoom() {
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min(Math.max(window.scrollY / scrollMax, 0), 1);
    targetZoom = 1.0 + scrollProgress * 2.2;
  }

  window.addEventListener("scroll", updateScrollZoom, { passive: true });
  updateScrollZoom();

  // Render Loop
  function renderGalaxy() {
    ctx.clearRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      idleAngleY += 0.0018;
    }

    const lerpFactor = 0.07;
    currentPitch += (targetPitch - currentPitch) * lerpFactor;
    currentYaw += (targetYaw - currentYaw) * lerpFactor;
    currentPanX += (targetPanX - currentPanX) * lerpFactor;
    currentPanY += (targetPanY - currentPanY) * lerpFactor;
    currentZoom += (targetZoom - currentZoom) * lerpFactor;

    const centerX = width / 2 + currentPanX;
    const centerY = height / 2 + currentPanY;
    const fov = 420;

    const totalAngleY = idleAngleY + currentYaw;
    const cosY = Math.cos(totalAngleY);
    const sinY = Math.sin(totalAngleY);
    const cosX = Math.cos(currentPitch);
    const sinX = Math.sin(currentPitch);

    // Multi-Layer Neon Galactic Core Glow (Cyan + Pink + White Core)
    const coreGlowRad = 220 * currentZoom;
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreGlowRad);
    coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.40)");
    coreGrad.addColorStop(0.2, "rgba(0, 255, 255, 0.28)");
    coreGrad.addColorStop(0.5, "rgba(255, 16, 240, 0.18)");
    coreGrad.addColorStop(0.8, "rgba(191, 0, 255, 0.08)");
    coreGrad.addColorStop(1, "rgba(7, 10, 18, 0)");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreGlowRad, 0, Math.PI * 2);
    ctx.fill();

    // 3D Projection Calculations
    const projectedStars = [];

    for (let i = 0; i < starCount; i += 1) {
      const s = stars[i];

      const x1 = s.x * cosY - s.z * sinY;
      const z1 = s.x * sinY + s.z * cosY;

      const y2 = s.y * cosX - z1 * sinX;
      const z2 = s.y * sinX + z1 * cosX;

      const x3 = x1 * currentZoom;
      const y3 = y2 * currentZoom;
      const z3 = z2 * currentZoom;

      const depth = fov + z3 + 320;
      if (depth <= 10) continue;

      const scale = fov / depth;
      const projX = centerX + x3 * scale;
      const projY = centerY + y3 * scale;

      if (projX < -60 || projX > width + 60 || projY < -60 || projY > height + 60) continue;

      const renderSize = Math.max(0.5, s.size * scale * (0.8 + currentZoom * 0.22));
      const depthAlpha = Math.min(1, Math.max(0.35, (scale * 1.3) * s.baseAlpha));

      projectedStars.push({
        x: projX,
        y: projY,
        size: renderSize,
        color: s.color,
        alpha: depthAlpha,
        depth: z3,
        isSuperBright: s.isSuperBright
      });
    }

    // Sort far to near
    projectedStars.sort((a, b) => a.depth - b.depth);

    // Draw Particles with Dynamic Canvas Neon Glow Effects
    for (let i = 0; i < projectedStars.length; i += 1) {
      const p = projectedStars[i];

      if (p.isSuperBright || p.size > 1.8) {
        ctx.shadowColor = p.color.str;
        ctx.shadowBlur = Math.min(16, Math.max(6, p.size * 4.5));
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Reset shadowBlur
    ctx.shadowBlur = 0;

    requestAnimationFrame(renderGalaxy);
  }

  renderGalaxy();
}

/* ==========================================
   MINIMALIST CODE RAIN OVERLAY
   ========================================== */
const enableCodeFloat = !prefersReducedMotion && window.innerWidth > 1100;

if (enableCodeFloat) {
  const codeSnippets = [
    "<html>",
    "</html>",
    "<div>",
    "</div>",
    "<section>",
    "</section>",
    "const",
    "return",
    "class=",
    "id="
  ];

  let codeLayer = null;
  let laneIndex = 0;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createSingleCodeEl(isInitial = false) {
    if (!codeLayer) return;

    const el = document.createElement("span");
    el.className = "code-float";
    el.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];

    const laneCount = 6;
    const laneGap = 100 / laneCount;
    const currentLane = laneIndex % laneCount;

    laneIndex += 1;

    const leftBase = currentLane * laneGap;
    const left = leftBase + randomBetween(1.5, laneGap - 8);
    const startY = isInitial ? randomBetween(-5, 100) : randomBetween(-18, -8);
    const driftX = randomBetween(-5, 5);
    const duration = randomBetween(30, 44);
    const delay = randomBetween(0, 8);
    const size = randomBetween(10, 12);
    const opacity = randomBetween(0.025, 0.045);

    el.style.left = `${left}%`;
    el.style.top = `${startY}%`;
    el.style.setProperty("--driftX", `${driftX}px`);
    el.style.setProperty("--fallDur", `${duration}s`);
    el.style.setProperty("--fallDelay", `${delay}s`);
    el.style.setProperty("--codeOpacity", opacity);
    el.style.fontSize = `${size}px`;

    codeLayer.appendChild(el);

    const totalLife = (duration + delay + 2) * 1000;

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      createSingleCodeEl(false);
    }, totalLife);
  }

  function createCodeBackground() {
    codeLayer = document.createElement("div");
    codeLayer.className = "code-float-layer";
    document.body.appendChild(codeLayer);

    const total = 6;
    for (let i = 0; i < total; i += 1) {
      createSingleCodeEl(true);
    }
  }

  createCodeBackground();
}
