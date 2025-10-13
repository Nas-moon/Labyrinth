// Particles background
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for(let i=0;i<80;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2+1,
    dx:(Math.random()-0.5)*0.5,
    dy:(Math.random()-0.5)*0.5
  });
}

function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#00ff66";
  ctx.shadowBlur=15;
  ctx.shadowColor="#00ff99";

  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    p.x+=p.dx; p.y+=p.dy;
    if(p.x<0||p.x>canvas.width)p.dx*=-1;
    if(p.y<0||p.y>canvas.height)p.dy*=-1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener("resize",()=>{canvas.width=window.innerWidth; canvas.height=window.innerHeight;});


// Generate cryptogram inputs
const lines = document.querySelectorAll(".crypto-line");
const lettersToNumbers = {}; 
let currentNumber = 1;

lines.forEach(line=>{
  const answer = line.dataset.answer.toUpperCase();
  line.innerHTML = "";

  for(let ch of answer){
    if(ch===' '){
      line.innerHTML+="<div style='width:12px'></div>";
      continue;
    }
    if(!lettersToNumbers[ch]) lettersToNumbers[ch]=currentNumber++;
    const num = lettersToNumbers[ch];
    // prefill some random letters for hints
    const prefill = Math.random()<0.2?ch:'';
    const input = document.createElement("input");
    input.setAttribute("maxlength","1");
    input.value = prefill;
    input.dataset.letter = ch;
    input.dataset.num = num;
    line.appendChild(input);

    const numEl = document.createElement("span");
    numEl.classList.add("num");
    numEl.textContent=num;
    line.appendChild(numEl);
  }
});

// Check correctness
function checkCrypto(){
  let allCorrect = true;
  lines.forEach(line=>{
    line.querySelectorAll("input").forEach(input=>{
      if(input.value.toUpperCase()===input.dataset.letter){
        input.classList.add("correct");
      } else {
        input.classList.remove("correct");
        allCorrect=false;
      }
    });
  });
  // Animate logo when all correct
  if(allCorrect){
    document.getElementById("center-logo").style.animation="pulse 1s infinite alternate";
    document.getElementById("proceed-btn").style.display="block";
  } else {
    document.getElementById("center-logo").style.animation="";
    document.getElementById("proceed-btn").style.display="none";
  }
}

// Pulse animation for logo
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes pulse {
  0%{filter: drop-shadow(0 0 4px #03F091);}
  100%{filter: drop-shadow(0 0 18px #00ff99);}
}`;
document.head.appendChild(styleSheet);

// Input events
document.querySelectorAll(".crypto-line input").forEach(input=>{
  input.addEventListener("input",checkCrypto);
  input.addEventListener("keydown",e=>{
    if(e.key.length===1) input.value=''; 
  });
});
