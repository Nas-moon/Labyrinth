// Particles background (same as before)
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff66";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00ff99";

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// --- CRYPTOGRAM GENERATION (fixed prefill logic) ---
const lines = document.querySelectorAll(".crypto-line");
const lettersToNumbers = {};
let currentNumber = 1;

// Count ALL letter positions (non-space) to choose random positions to prefill
let totalLetterPositions = 0;
lines.forEach(line => {
  const answer = line.dataset.answer || "";
  for (let ch of answer) if (ch !== " ") totalLetterPositions++;
});

// how many fields to prefill (max 6)
const TOTAL_TO_PREFILL = Math.min(6, totalLetterPositions);

// pick unique random indices (0 .. totalLetterPositions-1)
const prefillIndices = new Set();
while (prefillIndices.size < TOTAL_TO_PREFILL) {
  prefillIndices.add(Math.floor(Math.random() * totalLetterPositions));
}

// Now build the DOM, using a global index to decide which positions get prefilled
let globalIndex = 0; // increments only on non-space letter occurrences

lines.forEach(line => {
  const answer = (line.dataset.answer || "").toUpperCase();
  line.innerHTML = "";

  for (let ch of answer) {
    if (ch === " ") {
      // spacer between words (small gap)
      const spacer = document.createElement("div");
      spacer.style.width = "14px";
      spacer.style.display = "inline-block";
      line.appendChild(spacer);
      continue;
    }

    // assign number for the letter (same number for same letters)
    if (!lettersToNumbers[ch]) lettersToNumbers[ch] = currentNumber++;
    const num = lettersToNumbers[ch];

    // create input
    const input = document.createElement("input");
    input.setAttribute("maxlength", "1");
    input.dataset.letter = ch;
    input.dataset.num = num;
    input.classList.add("crypto-input");

    // If this global position was chosen, prefill this instance only
    if (prefillIndices.has(globalIndex)) {
      input.value = ch;
    }

    // wrapper for input + number
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";

    wrapper.appendChild(input);

    const numEl = document.createElement("span");
    numEl.classList.add("num");
    numEl.textContent = num;
    wrapper.appendChild(numEl);

    line.appendChild(wrapper);

    globalIndex++;
  }
});

// --- VERIFY / CHECK FUNCTION ---
function checkCrypto() {
  let allCorrect = true;
  lines.forEach(line => {
    line.querySelectorAll("input").forEach(input => {
      if (input.value.toUpperCase() === input.dataset.letter) {
        input.classList.add("correct");
      } else {
        input.classList.remove("correct");
        allCorrect = false;
      }
    });
  });

  const logo = document.getElementById("center-logo");
  const proceedBtn = document.getElementById("proceed-btn");
  if (allCorrect) {
    if (logo) logo.style.animation = "pulse 1s infinite alternate";
    if (proceedBtn) proceedBtn.style.display = "block";
  } else {
    if (logo) logo.style.animation = "";
    if (proceedBtn) proceedBtn.style.display = "none";
  }
}

// Pulse animation CSS injection (unchanged)
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes pulse {
  0%{filter: drop-shadow(0 0 4px #03F091);}
  100%{filter: drop-shadow(0 0 18px #00ff99);}
}`;
document.head.appendChild(styleSheet);

// Attach input listener to dynamic inputs
document.querySelectorAll(".crypto-line input").forEach(input => {
  input.addEventListener("input", checkCrypto);
  input.addEventListener("keydown", e => {
    // allow overwrite quickly: when typing a character, clear and let the typed char land
    if (e.key.length === 1) input.value = '';
  });
});

// initial check so prefilled boxes get their 'correct' state
checkCrypto();
