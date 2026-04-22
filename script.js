
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("show"));
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => mobileMenu.classList.remove("show")));
}

const copyBtn = document.getElementById("copyBtn");
const msgBox = document.getElementById("msgBox");
if (copyBtn && msgBox) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(msgBox.value);
      copyBtn.textContent = "Copied";
      setTimeout(() => (copyBtn.textContent = "Copy Message"), 1200);
    } catch {
      alert("Copy failed. Select the text and copy manually.");
    }
  });
}

const emailBtn = document.getElementById("emailBtn");
if (emailBtn && msgBox) {
  emailBtn.addEventListener("click", () => {
    const subject = encodeURIComponent("Portfolio Contact — Arnab Ghorai");
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
      setTimeout(() => (phoneBtn.textContent = "Copy"), 1200);
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
  if (!src || !modal || !modalImg || !modalTitle || !openNewTab || !download) return;
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
  modalImg.src = "";
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
if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

function setMediaState(card, hasImage, src, title) {
  const button = card.querySelector(".project-thumb-btn, .gallery-thumb-btn");
  const image = card.querySelector(".project-thumb-img, .gallery-thumb-img");
  const zoomBtn = card.querySelector(".media-zoom-btn, .gallery-zoom-btn");
  const tabBtn = card.querySelector(".media-tab-btn, .gallery-tab-btn");
  const actions = card.querySelector(".project-media-actions, .gallery-actions");

  card.classList.toggle("media-has-image", hasImage);
  card.classList.toggle("media-missing", !hasImage);

  if (button) {
    button.setAttribute("data-open", hasImage ? src : "");
    button.setAttribute("data-title", title || "Preview");
    button.disabled = !hasImage;
  }
  if (image) {
    if (hasImage) {
      image.src = src;
      image.alt = title || image.alt || "Preview";
    } else {
      image.removeAttribute("src");
      image.setAttribute("aria-hidden", "true");
    }
  }
  if (zoomBtn) {
    zoomBtn.setAttribute("data-open", hasImage ? src : "");
    zoomBtn.setAttribute("data-title", title || "Preview");
  }
  if (tabBtn) {
    tabBtn.href = hasImage ? src : "#";
    tabBtn.tabIndex = hasImage ? 0 : -1;
  }
  if (actions) actions.classList.toggle("is-hidden", !hasImage);
}

function setupProfileAvatar() {
  const avatar = document.getElementById("profileAvatar");
  if (!avatar) return;
  const showFallback = () => avatar.classList.add("is-hidden");
  const showImage = () => avatar.classList.remove("is-hidden");
  avatar.addEventListener("error", showFallback);
  avatar.addEventListener("load", showImage);
  if (!avatar.getAttribute("src")) showFallback();
}

function setupCardMedia() {
  document.querySelectorAll("[data-project-card], [data-gallery-card]").forEach((card) => {
    const image = card.querySelector(".project-thumb-img, .gallery-thumb-img");
    const button = card.querySelector(".project-thumb-btn, .gallery-thumb-btn");
    if (!image || !button) return;
    const src = image.getAttribute("src") || "";
    const title = button.getAttribute("data-title") || image.alt || "Preview";
    if (!src.trim()) {
      setMediaState(card, false, "", title);
      return;
    }
    const tester = new Image();
    tester.onload = () => setMediaState(card, true, src, title);
    tester.onerror = () => setMediaState(card, false, "", title);
    tester.src = src;
  });
}
setupProfileAvatar();
setupCardMedia();

const canvas = document.getElementById("bg3d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.innerWidth < 768;
const enable3D = !!(canvas && window.THREE && !prefersReducedMotion);

if (enable3D) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 0, 10);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(5, 5, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.45);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  const geo = new THREE.TorusKnotGeometry(2.0, 0.5, isMobile ? 80 : 110, isMobile ? 10 : 12);
  const mat = new THREE.MeshStandardMaterial({ color: 0x7c5cff, metalness: 0.48, roughness: 0.3, emissive: 0x061027, emissiveIntensity: 0.55 });
  const knot = new THREE.Mesh(geo, mat);
  knot.position.set(1.8, 0.7, -1.5);
  scene.add(knot);

  const glow = new THREE.Mesh(new THREE.PlaneGeometry(28, 18, 1, 1), new THREE.MeshBasicMaterial({ color: 0x0b1230, transparent: true, opacity: 0.42 }));
  glow.position.set(0, 0, -12);
  scene.add(glow);

  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  onResize();
  window.addEventListener("resize", onResize, { passive: true });

  let mouseX = 0, mouseY = 0, targetScrollY = 0, smoothScrollY = 0, shouldAnimate = !document.hidden;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  window.addEventListener("scroll", () => { targetScrollY = window.scrollY || 0; }, { passive: true });
  document.addEventListener("visibilitychange", () => { shouldAnimate = !document.hidden; });

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    if (!shouldAnimate) return;
    const t = clock.getElapsedTime();
    smoothScrollY += (targetScrollY - smoothScrollY) * 0.08;
    knot.rotation.x = t * 0.18;
    knot.rotation.y = t * 0.26;
    knot.position.y = 0.7 + Math.sin(t * 0.7) * 0.18;
    camera.position.x += ((mouseX * 0.45) - camera.position.x) * 0.03;
    camera.position.y += ((-mouseY * 0.26) - camera.position.y) * 0.03;
    camera.position.z = 10 + Math.min(smoothScrollY / 1300, 1.2);
    renderer.render(scene, camera);
  })();
} else if (canvas) {
  canvas.style.display = "none";
}

const codeSnippets = ["<html>","</html>","<body>","</body>","<section>","</section>","<main>","</main>","<nav>","</nav>","const","let","return","class=","id=","href=","addEventListener()","querySelector()"];
let codeLayer = null, laneIndex = 0;
const randomBetween = (min, max) => Math.random() * (max - min) + min;

function createSingleCodeEl(isInitial = false) {
  if (!codeLayer) return;
  const el = document.createElement("span");
  el.className = "code-float";
  el.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
  const laneCount = window.innerWidth < 720 ? 6 : 10, laneGap = 100 / laneCount, currentLane = laneIndex % laneCount;
  laneIndex++;
  const left = currentLane * laneGap + randomBetween(1.5, Math.max(2, laneGap - 8));
  el.style.left = `${left}%`;
  el.style.top = `${isInitial ? randomBetween(-5, 100) : randomBetween(-18, -8)}%`;
  el.style.setProperty("--driftX", `${randomBetween(-8, 8)}px`);
  el.style.setProperty("--fallDur", `${randomBetween(24, 36)}s`);
  el.style.setProperty("--fallDelay", `${randomBetween(0, 8)}s`);
  el.style.setProperty("--codeOpacity", randomBetween(0.02, 0.05));
  el.style.fontSize = `${randomBetween(10, 14)}px`;
  codeLayer.appendChild(el);
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
    if (!document.hidden) createSingleCodeEl(false);
  }, 42000);
}
function createCodeBackground() {
  if (prefersReducedMotion || window.innerWidth < 980) return;
  codeLayer = document.createElement("div");
  codeLayer.className = "code-float-layer";
  document.body.appendChild(codeLayer);
  for (let i = 0; i < 10; i++) createSingleCodeEl(true);
}
createCodeBackground();
