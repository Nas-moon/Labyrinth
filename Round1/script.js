// =======================
// Particle Animation
// =======================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for(let i=0;i<60;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    radius:Math.random()*2+1,
    dx:(Math.random()-0.5)*0.5,
    dy:(Math.random()-0.5)*0.5
  });
}

function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#00ff66";
  ctx.shadowBlur=20;
  ctx.shadowColor="#00ff99";

  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fill();
    p.x+=p.dx; p.y+=p.dy;
    if(p.x<0||p.x>canvas.width)p.dx*=-1;
    if(p.y<0||p.y>canvas.height)p.dy*=-1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener("resize",()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});

// =======================
// SVG Logo Animation (Draw Once)
// =======================
function animateLogo(){
  const paths=document.querySelectorAll("#center-logo path");
  paths.forEach((p,i)=>{
    const length=p.getTotalLength();
    p.style.strokeDasharray=length;
    p.style.strokeDashoffset=length;
    p.style.opacity=1;
    p.style.transition=`stroke-dashoffset 3s ease ${i*0.02}s, opacity 0.5s ease`;
    setTimeout(()=>{p.style.strokeDashoffset=0;},50);
  });
}
window.addEventListener("load",()=>{animateLogo();});

// =======================
// Team Name Handling & Enter Button
// =======================
const enterBtn=document.getElementById("enter-btn");
enterBtn?.addEventListener("click",()=>{
  const teamName=document.getElementById("team-name").value.trim();
  if(!teamName){ alert("Please enter your team name."); return; }
  localStorage.setItem("teamName",teamName);
  window.location.href="memory.html";
});

// =======================
// Directly show Google Form (no timer)
// =======================
const formEl = document.getElementById("memory-form");
const imgEl = document.getElementById("memory-img");
const timerEl = document.getElementById("timer");

// Hide unused elements if they exist
if (imgEl) imgEl.style.display = "none";
if (timerEl) timerEl.style.display = "none";

// Show the Google Form immediately
if (formEl) formEl.style.display = "block";
