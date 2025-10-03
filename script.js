// =======================
// Particle Animation (Canvas)
// =======================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff66";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#00ff99";

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// Handle Resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// =======================
// Real-time Leaderboard
// =======================
const SHEET_URL ="https://docs.google.com/spreadsheets/d/e/2PACX-1vRtD8hiVqTsVuO4RIE0qPh0ch3VedcMyMVlkRr6VC8IXy0a_fwxtyV606fD9pMNTlg5SBVk5spAr2be/pub?output=csv";

async function loadLeaderboard() {
  try {
    const res = await fetch(SHEET_URL + "&t=" + Date.now());
    const text = await res.text();

    let rows = text.trim().split(/\r?\n/).map(r => r.split(","));
    rows.shift();
    rows = rows.map(r => [r[0].trim().replace(/"/g, ""), Number(r[1]?.replace(/"/g, ""))])
               .filter(r => r[0] !== "" && !isNaN(r[1]));

    const latestScores = {};
    rows.forEach(([team, score]) => { latestScores[team] = score; });
    rows = Object.entries(latestScores).sort((a, b) => b[1] - a[1]);

    const leaderboard = document.getElementById("leaderboard");
    if (!leaderboard) return;
    leaderboard.innerHTML = "";

    if (rows.length === 0) {
      leaderboard.innerHTML = "<li>No data found</li>";
      return;
    }

    let currentRank = 1;
    let previousScore = null;

    rows.forEach(([team, score], i) => {
      if (score !== previousScore) {
        currentRank = i + 1;
      }
      const li = document.createElement("li");
      li.textContent = `${currentRank}. ${team} - ${score}`;
      leaderboard.appendChild(li);
      previousScore = score;
    });

  } catch (e) {
    console.error("❌ Leaderboard error:", e);
  }
}

loadLeaderboard();
setInterval(loadLeaderboard, 5000);

// =======================
// Hamburger Menu Toggle
// =======================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// =======================
// Logo SVG Path Animation
// =======================
function animateLogoLoop(maxLoops = 5) {
  const paths = document.querySelectorAll("#center-logo path");
  if (!paths.length) return;

  paths.forEach((path, i) => {
    const length = path.getTotalLength();
    path.style.setProperty("--path-length", length);
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // Animate sequentially with limited loops
    path.style.animation = `logoCycle 6s ease-in-out ${i * 0.15}s ${maxLoops}`;
    
    // When finished → freeze logo visible with glow
    path.addEventListener("animationend", () => {
      path.style.animation = "none"; // stop looping
      path.style.strokeDashoffset = 0; // fully drawn
      path.style.opacity = 1;
      path.style.filter = "drop-shadow(0 0 5px #03F091)"; // permanent glow
    }, { once: true });
  });
}

// Run only after particles are ready
window.addEventListener("load", () => {
  setTimeout(() => {
    animateLogoLoop(5);
  }, 500);
});
