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

const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const closeBtn = document.getElementById("modalClose");
const openNewTab = document.getElementById("modalOpenNewTab");
const download = document.getElementById("modalDownload");

function openModal(src, title) {
  if (!modal || !modalImg || !modalTitle || !openNewTab || !download) return;
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

const canvas = document.getElementById("bg3d");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
camera.position.set(0, 0, 10);

const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 1.0);
key.position.set(5, 5, 8);
scene.add(key);

const rim = new THREE.DirectionalLight(0xffffff, 0.55);
rim.position.set(-6, -2, -4);
scene.add(rim);

const geo = new THREE.TorusKnotGeometry(2.0, 0.55, 220, 18);
const mat = new THREE.MeshStandardMaterial({
  color: 0x7c5cff,
  metalness: 0.55,
  roughness: 0.25,
  emissive: 0x061027,
  emissiveIntensity: 0.7
});
const knot = new THREE.Mesh(geo, mat);
knot.position.set(1.8, 0.7, -1.5);
scene.add(knot);

const glowGeo = new THREE.PlaneGeometry(30, 18, 1, 1);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0x0b1230,
  transparent: true,
  opacity: 0.55
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
window.addEventListener("resize", onResize);

let mouseX = 0;
let mouseY = 0;
window.addEventListener("mousemove", (e) => {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = (e.clientY / window.innerHeight) * 2 - 1;
  mouseX = nx;
  mouseY = ny;
});

let scrollY = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY || 0;
});

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();

  knot.rotation.x = t * 0.25;
  knot.rotation.y = t * 0.35;
  knot.position.y = 0.7 + Math.sin(t * 0.9) * 0.25;

  const targetX = mouseX * 0.6;
  const targetY = mouseY * 0.35;
  camera.position.x += (targetX - camera.position.x) * 0.04;
  camera.position.y += (-targetY - camera.position.y) * 0.04;
  camera.position.z = 10 + Math.min(scrollY / 900, 2.2);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

const codeSnippets = [
  "<html>", "</html>",
  "<body>", "</body>",
  "<div>", "</div>",
  "<section>", "</section>",
  "<main>", "</main>",
  "<nav>", "</nav>",
  "<header>", "</header>",
  "<footer>", "</footer>",
  "<article>", "</article>",
  "<script>", "</script>",
  "<style>", "</style>",
  "const",
  "let",
  "return",
  "class=",
  "id=",
  "href=",
  "display:flex",
  "border-radius",
  "addEventListener()",
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

  const laneCount = window.innerWidth < 720 ? 10 : 14;
  const laneGap = 100 / laneCount;

  const currentLane = laneIndex % laneCount;
  laneIndex++;

  const leftBase = currentLane * laneGap;
  const left = leftBase + randomBetween(1.5, laneGap - 8);

  const startY = isInitial ? randomBetween(-5, 100) : randomBetween(-18, -8);
  const driftX = randomBetween(-10, 10);
  const duration = randomBetween(38, 70);
  const delay = randomBetween(0, 10);
  const size = randomBetween(10, 15);
  const opacity = randomBetween(0.035, 0.075);

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

  const total = window.innerWidth < 720 ? 18 : 30;

  for (let i = 0; i < total; i++) {
    createSingleCodeEl(true);
  }
}

createCodeBackground();