const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- mobile menu ---------- */
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

/* ---------- copy + email ---------- */
const copyBtn = document.getElementById("copyBtn");
const msgBox = document.getElementById("msgBox");

if (copyBtn && msgBox) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(msgBox.value);
      copyBtn.textContent = "Copied ✅";
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

/* ---------- phone reveal ---------- */
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
      phoneBtn.textContent = "Copied ✅";
      setTimeout(() => (phoneBtn.textContent = "Copy"), 1200);
    } catch {}
  });
}

/* ---------- modal ---------- */
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

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ---------- project image state ---------- */
function updateProjectCardState(card) {
  if (!card) return;

  const previewBtn = card.querySelector(".project-thumb-btn");
  const previewImg = card.querySelector(".project-thumb-img");
  const placeholder = card.querySelector(".project-thumb-placeholder");
  const actions = card.querySelector(".project-actions");
  const uploadWrap = card.querySelector(".project-upload");

  if (!previewBtn || !previewImg || !placeholder || !actions) return;

  const imgSrc = (previewImg.getAttribute("src") || "").trim();
  const hasImage = imgSrc !== "";

  if (hasImage) {
    previewImg.style.display = "block";
    placeholder.style.display = "none";
    previewBtn.setAttribute("data-open", imgSrc);

    if (uploadWrap) uploadWrap.style.display = "none";

    const zoomBtn = actions.querySelector(".project-zoom-btn");
    const newTabBtn = actions.querySelector(".project-newtab-btn");
    const noImageBtn = actions.querySelector(".project-no-image");

    if (zoomBtn) {
      zoomBtn.style.display = "inline-flex";
      zoomBtn.setAttribute("data-open", imgSrc);
      zoomBtn.setAttribute("data-title", previewBtn.getAttribute("data-title") || "Project Image");
    }

    if (newTabBtn) {
      newTabBtn.style.display = "inline-flex";
      newTabBtn.href = imgSrc;
    }

    if (noImageBtn) noImageBtn.style.display = "none";
  } else {
    previewImg.style.display = "none";
    placeholder.style.display = "flex";
    previewBtn.removeAttribute("data-open");

    if (uploadWrap) uploadWrap.style.display = "none";

    const zoomBtn = actions.querySelector(".project-zoom-btn");
    const newTabBtn = actions.querySelector(".project-newtab-btn");
    let noImageBtn = actions.querySelector(".project-no-image");

    if (zoomBtn) zoomBtn.style.display = "none";
    if (newTabBtn) newTabBtn.style.display = "none";

    if (!noImageBtn) {
      noImageBtn = document.createElement("span");
      noImageBtn.className = "btn small ghost project-no-image";
      noImageBtn.textContent = "No Image Uploaded";
      actions.prepend(noImageBtn);
    } else {
      noImageBtn.style.display = "inline-flex";
    }
  }
}

document.querySelectorAll(".project-card").forEach(updateProjectCardState);

/* keep optional upload support if inputs exist */
const projectImageInputs = document.querySelectorAll(".project-image-input");

projectImageInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const projectCard = input.closest(".project-card");
    if (!projectCard) return;

    const previewBtn = projectCard.querySelector(".project-thumb-btn");
    const previewImg = projectCard.querySelector(".project-thumb-img");
    const placeholder = projectCard.querySelector(".project-thumb-placeholder");
    const imageTitle = input.getAttribute("data-title") || "Project Image";

    if (!previewBtn || !previewImg || !placeholder) return;

    const objectUrl = URL.createObjectURL(file);

    previewImg.src = objectUrl;
    previewImg.alt = imageTitle;
    previewBtn.setAttribute("data-title", imageTitle);

    updateProjectCardState(projectCard);
  });
});

/* ---------- 3D background performance optimized ---------- */
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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.2));

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(5, 5, 8);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffffff, 0.45);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  const geo = new THREE.TorusKnotGeometry(1.8, 0.45, isMobile ? 72 : 110, isMobile ? 10 : 14);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x7c5cff,
    metalness: 0.45,
    roughness: 0.32,
    emissive: 0x061027,
    emissiveIntensity: 0.55
  });

  knot = new THREE.Mesh(geo, mat);
  knot.position.set(1.8, 0.7, -1.5);
  scene.add(knot);

  const glowGeo = new THREE.PlaneGeometry(30, 18, 1, 1);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x0b1230,
    transparent: true,
    opacity: 0.38
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

    knot.rotation.x = t * 0.18;
    knot.rotation.y = t * 0.24;
    knot.position.y = 0.7 + Math.sin(t * 0.75) * 0.18;

    const targetX = mouseX * 0.35;
    const targetY = mouseY * 0.2;
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (-targetY - camera.position.y) * 0.03;
    camera.position.z = 10 + Math.min(scrollY / 1400, 1.1);

    renderer.render(scene, camera);
  }

  animate();
}

/* ---------- lighter floating code background ---------- */
const enableCodeFloat = !prefersReducedMotion && window.innerWidth > 900;

if (enableCodeFloat) {
  const codeSnippets = [
    "<html>", "</html>",
    "<div>", "</div>",
    "<section>", "</section>",
    "const",
    "return",
    "class=",
    "id=",
    "querySelector()"
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

    const laneCount = 8;
    const laneGap = 100 / laneCount;

    const currentLane = laneIndex % laneCount;
    laneIndex++;

    const leftBase = currentLane * laneGap;
    const left = leftBase + randomBetween(1.5, laneGap - 8);

    const startY = isInitial ? randomBetween(-5, 100) : randomBetween(-18, -8);
    const driftX = randomBetween(-6, 6);
    const duration = randomBetween(28, 42);
    const delay = randomBetween(0, 8);
    const size = randomBetween(10, 13);
    const opacity = randomBetween(0.03, 0.055);

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

    const total = 8;
    for (let i = 0; i < total; i++) {
      createSingleCodeEl(true);
    }
  }

  createCodeBackground();
}
