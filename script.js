// =======================
// Particle Animation (Canvas)
// =======================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
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
// Real-time Leaderboard from Google Sheets
// =======================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtD8hiVqTsVuO4RIE0qPh0ch3VedcMyMVlkRr6VC8IXy0a_fwxtyV606fD9pMNTlg5SBVk5spAr2be/pub?output=csv";

async function loadLeaderboard() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    console.log("Raw CSV:", text); // 👈 debug output

    // Split into rows safely (handle CRLF or LF)
    let rows = text.trim().split(/\r?\n/).map(r => r.split(","));
    rows.shift(); // remove header row (Team Name, Score)

    // Filter valid rows and parse numbers
    rows = rows
      .map(r => [r[0].trim().replace(/"/g, ""), Number(r[1].replace(/"/g, ""))])
      .filter(r => r[0] !== "" && !isNaN(r[1]));

    // Sort by score (descending)
    rows.sort((a, b) => b[1] - a[1]);

    // ✅ Get leaderboard element BEFORE appending
    const leaderboard = document.getElementById("leaderboard");
    if (!leaderboard) return;

    // Clear previous list
    leaderboard.innerHTML = "";

    if (rows.length === 0) {
      leaderboard.innerHTML = "<li>No data found</li>";
      return;
    }

    // Now append sorted rows
    rows.forEach((row, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${row[0]} - ${row[1]} pts`;
      leaderboard.appendChild(li);
    });

  } catch (e) {
    console.error("Leaderboard error:", e);
  }
}

// First load + refresh every 5s
loadLeaderboard();
setInterval(loadLeaderboard, 5000);
