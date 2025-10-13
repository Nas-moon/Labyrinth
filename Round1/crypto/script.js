// Particles background
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

// Cryptogram generation
const lines = document.querySelectorAll(".crypto-line");
const lettersToNumbers = {};
let currentNumber = 1;

lines.forEach(line => {
  const words = line.dataset.answer.toUpperCase().split(' ');
  line.innerHTML = "";

  words.forEach(word => {
    const wordDiv = document.createElement("div");
    wordDiv.classList.add("word");

    word.split('').forEach(ch => {
      if (!lettersToNumbers[ch]) lettersToNumbers[ch] = currentNumber++;
      const num = lettersToNumbers[ch];

      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "center";

      const input = document.createElement("input");
      input.setAttribute("maxlength", "1");
      const prefill = Math.random() < 0.15 ? ch : '';
      input.value = prefill;
      input.dataset.letter = ch;
      input.dataset.num = num;

      const numEl = document.createElement("span");
      numEl.classList.add("num");
      numEl.textContent = num;

      container.appendChild(input);
      container.appendChild(numEl);
      wordDiv.appendChild(container);
    });

    line.appendChild(wordDiv);
  });
});

// Verify function
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
    logo.style.animation = "pulse 1s infinite alternate";
    proceedBtn.style.display = "block";
  } else {
    logo.style.animation = "";
    proceedBtn.style.display = "none";
  }
}

// Pulse animation
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyfram
