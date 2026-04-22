const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

const emailBtn = document.getElementById("emailBtn");

if (emailBtn && msgBox) {
  emailBtn.addEventListener("click", () => {
    const subject = encodeURIComponent("Portfolio Contact - Arnab Ghorai");
    const body = encodeURIComponent(msgBox.value);
    window.location.href = `mailto:arnabghorai349@gmail.com?subject=${subject}&body=${body}`;
  });
}

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
    if (profileAvatar.naturalWidth > 0) {
      profileAvatar.classList.remove("is-hidden");
      if (fallback) fallback.style.display = "none";
    } else {
      showFallback();
    }
  };

  profileAvatar.addEventListener("load", showImage);
  profileAvatar.addEventListener("error", showFallback);

  if (profileAvatar.complete) {
    showImage();
  }
}

function getMediaLoadedSrc(img) {
  const attrSrc = (img.getAttribute("src") || "").trim();
  if (!attrSrc) return "";
  if (img.complete && img.naturalWidth > 0) return img.currentSrc || img.src || attrSrc;
  return "";
}

function updateMediaCard(card) {
  if (!card) return;

  const isGallery = card.dataset.mediaCard === "gallery";
  const img = card.querySelector(isGallery ? ".gallery-thumb-img" : ".project-thumb-img");
  const btn = card.querySelector(isGallery ? ".gallery-thumb-btn" : ".project-thumb-btn");
  const placeholder = card.querySelector(isGallery ? ".gallery-thumb-placeholder" : ".project-thumb-placeholder");
  const actions = card.querySelector(isGallery ? ".gallery-actions" : ".project-media-actions");
  const zoomBtn = card.querySelector(isGallery ? ".gallery-zoom-btn" : ".media-zoom-btn");
  const tabBtn = card.querySelector(isGallery ? ".gallery-tab-btn" : ".media-tab-btn");

  if (!img || !btn || !placeholder || !actions) return;

  const loadedSrc = getMediaLoadedSrc(img);
  const hasImage = loadedSrc !== "";

  card.classList.remove("media-has-image", "media-missing");

  if (hasImage) {
    card.classList.add("media-has-image");
    btn.setAttribute("data-open", loadedSrc);
    if (zoomBtn) {
      zoomBtn.setAttribute("data-open", loadedSrc);
      zoomBtn.setAttribute("data-title", btn.getAttribute("data-title") || "Preview");
    }
    if (tabBtn) {
      tabBtn.href = loadedSrc;
      tabBtn.setAttribute("target", "_blank");
      tabBtn.setAttribute("rel", "noreferrer");
    }
    actions.classList.remove("is-hidden");
  } else {
    card.classList.add("media-missing");
    img.removeAttribute("src");
    btn.removeAttribute("data-open");
    if (zoomBtn) zoomBtn.removeAttribute("data-open");
    if (tabBtn) tabBtn.removeAttribute("href");
    actions.classList.add("is-hidden");
  }
}

document.querySelectorAll("[data-media-card]").forEach((card) => {
  const isGallery = card.dataset.mediaCard === "gallery";
  const img = card.querySelector(isGallery ? ".gallery-thumb-img" : ".project-thumb-img");

  if (!img) {
    updateMediaCard(card);
    return;
  }

  img.addEventListener("load", () => {
    updateMediaCard(card);
  });

  img.addEventListener("error", () => {
    img.removeAttribute("src");
    updateMediaCard(card);
  });

  if (img.complete) {
    if (img.naturalWidth === 0) img.removeAttribute("src");
    updateMediaCard(card);
  } else {
    updateMediaCard(card);
  }
});

setProfileAvatarState();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("bg3d");
const isMobile = window.innerWidth < 768;

let renderer = null;
let scene = null;
let camera = null;
let knot = null;

if (canvas && window.THREE && !prefersReducedMotion) {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: "low-power"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.15));

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(5, 5, 8);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffffff, 0.4);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  const geo = new THREE.TorusKnotGeometry(1.8, 0.45, isMobile ? 60 : 96, isMobile ? 9 : 12);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x7c5cff,
    metalness: 0.4,
    roughness: 0.35,
    emissive: 0x061027,
    emissiveIntensity: 0.45
  });

  knot = new THREE.Mesh(geo, mat);
  knot.position.set(1.8, 0.7, -1.5);
  scene.add(knot);

  const glowGeo = new THREE.PlaneGeometry(30, 18, 1, 1);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x0b1230,
    transparent: true,
    opacity: 0.3
  });

  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.set(0, 0, -12);
  scene.add(glow);

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  onResize();
  window.addEventListener("resize", onResize, { passive: true });

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let scrollY = window.scrollY || 0;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        scrollY = window.scrollY || 0;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  let shouldAnimate = true;

  document.addEventListener("visibilitychange", () => {
    shouldAnimate = !document.hidden;
  });

  const clock = new THREE.Clock();

  function animate() {
    if (!renderer || !scene || !camera || !knot) return;

    requestAnimationFrame(animate);
    if (!shouldAnimate) return;

    const t = clock.getElapsedTime();

    knot.rotation.x = t * 0.16;
    knot.rotation.y = t * 0.22;
    knot.position.y = 0.7 + Math.sin(t * 0.7) * 0.16;

    const targetX = mouseX * 0.28;
    const targetY = mouseY * 0.16;

    camera.position.x += (targetX - camera.position.x) * 0.025;
    camera.position.y += (-targetY - camera.position.y) * 0.025;
    camera.position.z = 10 + Math.min(scrollY / 1600, 0.9);

    renderer.render(scene, camera);
  }

  animate();
}

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
