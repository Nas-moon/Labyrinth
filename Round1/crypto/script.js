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

// Cryptogram input generation
const lines = document.querySelectorAll(".crypto-line");
const lettersToNumbers = {}; 
let currentNumber = 1;

lines.forEach(line=>{
  const answer = line.dataset.answer.toUpperCase().split(' ');
  line.innerHTML="";
  answer.forEach(word=>{
    const wordDiv = document.createElement("div");
    wordDiv.classList.add("word");
    wordDiv.style.marginRight = "12px";
    for(let ch of word){
      if(!lettersToNumbers[ch]) lettersToNumbers[ch]=currentNumber++;
      const num = lettersToNumbers[ch];
      const prefill = Math.random()<0.15?ch:'';
      const input = document.createElement("input");
      input.setAttribute("maxlength","1");
      input.value = prefill;
      input.dataset.letter = ch;
      input.dataset.num = num;
      wordDiv.appendChild(input);

      const numEl = document.createElement("span");
      numEl.classList.add("num");
      numEl.textContent=num;
      wordDiv.appendChild(numEl);
    }
    line.appendChild(wordDiv);
  });
});

// Verify function
function checkCrypto(){
  let allCorrect=true;
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

  const logo = document.getElementById("center-logo");
  const proceedBtn = document.getElementById("proceed-btn");
  if(allCorrect){
    logo.style.animation="pulse 1s infinite alternate";
    proceedBtn.style.display="block";
  } else {
    logo.style.animation="";
    proceedBtn.style.display="none";
  }
}

// Pulse animation
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes pulse {
  0%{filter: drop-shadow(0 0 4px #03F091);}
  100%{filter: drop-shadow(0 0 18px #00ff99);}
}`;
document.head.appendChild(styleSheet);

document.querySelectorAll(".crypto-line input").forEach(input=>{
  input.addEventListener("input",checkCrypto);
  input.addEventListener("keydown",e=>{
    if(e.key.length===1) input.value='';
  });
});
