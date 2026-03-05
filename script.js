// -----------------------------
// Small UI helpers
// -----------------------------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => mobileMenu.classList.remove("show"));
  });
}

// Copy message
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

// Email this message
const emailBtn = document.getElementById("emailBtn");
if (emailBtn && msgBox) {
  emailBtn.addEventListener("click", () => {
    const subject = encodeURIComponent("Portfolio Contact — Arnab Ghorai");
    const body = encodeURIComponent(msgBox.value);
    window.location.href = `mailto:arnabghorai349@gmail.com?subject=${subject}&body=${body}`;
  });
}

// LinkedIn link placeholder - put your real LinkedIn URL here later
const linkedinLink = document.getElementById("linkedinLink");
if (linkedinLink) {
  // Replace this once you have your exact LinkedIn profile URL.
  linkedinLink.href = "#";
  linkedinLink.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Add your LinkedIn profile URL in script.js (linkedinLink.href = 'https://linkedin.com/in/...').");
  });
}

// Resume button placeholder (you can add resume.pdf in the same folder)
const resumeBtn = document.getElementById("resumeBtn");
if (resumeBtn) {
  resumeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Add a file named resume.pdf in the folder and change the button link to './resume.pdf'.");
  });
}

// -----------------------------
// 3D Background (Three.js)
// -----------------------------
const canvas = document.getElementById("bg3d");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
camera.position.set(0, 0, 10);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 1.0);
key.position.set(5, 5, 8);
scene.add(key);

const rim = new THREE.DirectionalLight(0xffffff, 0.55);
rim.position.set(-6, -2, -4);
scene.add(rim);

// Main object (TorusKnot) with a soft, glassy look
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

// Particle field
const pCount = 1200;
const pGeo = new THREE.BufferGeometry();
const positions = new Float32Array(pCount * 3);

for (let i = 0; i < pCount; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 60;
  positions[i3 + 1] = (Math.random() - 0.5) * 40;
  positions[i3 + 2] = (Math.random() - 0.5) * 60;
}

pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const pMat = new THREE.PointsMaterial({
  color: 0x00d4ff,
  size: 0.06,
  transparent: true,
  opacity: 0.55
});

const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

// Subtle floating plane glow
const glowGeo = new THREE.PlaneGeometry(30, 18, 1, 1);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0x0b1230,
  transparent: true,
  opacity: 0.55
});
const glow = new THREE.Mesh(glowGeo, glowMat);
glow.position.set(0, 0, -12);
scene.add(glow);

// Resize handler
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
onResize();
window.addEventListener("resize", onResize);

// Mouse parallax
let mouseX = 0, mouseY = 0;
window.addEventListener("mousemove", (e) => {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = (e.clientY / window.innerHeight) * 2 - 1;
  mouseX = nx;
  mouseY = ny;
});

// Scroll influence
let scrollY = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY || 0;
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();

  // Rotate + float
  knot.rotation.x = t * 0.25;
  knot.rotation.y = t * 0.35;
  knot.position.y = 0.7 + Math.sin(t * 0.9) * 0.25;

  // Parallax
  const targetX = mouseX * 0.6;
  const targetY = mouseY * 0.35;
  camera.position.x += (targetX - camera.position.x) * 0.04;
  camera.position.y += (-targetY - camera.position.y) * 0.04;

  // Scroll adds depth motion
  camera.position.z = 10 + Math.min(scrollY / 900, 2.2);

  // Particle drift
  particles.rotation.y = t * 0.03;
  particles.rotation.x = t * 0.015;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();