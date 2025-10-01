// Total questions
const totalQuestions = 200;
const perPage = 10;
const totalPages = totalQuestions / perPage;
let currentPage = 1;

// Demo correct answers: "1", "2", "3"... until 200
let correctAnswers = [];
for (let i = 1; i <= totalQuestions; i++) {
  correctAnswers.push(i.toString());
}

// Render questions for current page
function renderQuestions() {
  const container = document.getElementById("questionContainer");
  container.innerHTML = "";

  let start = (currentPage - 1) * perPage + 1;
  let end = start + perPage - 1;
  if (end > totalQuestions) end = totalQuestions;

  let div = document.createElement("div");
  div.classList.add("inputs", "active");

  for (let i = start; i <= end; i++) {
    div.innerHTML += `
      <div class="input-row">
        ${i}. <input type="text" id="q${i}" required />
      </div>
    `;
  }
  container.appendChild(div);

  // Show/hide navigation buttons
  document.getElementById("prevBtn").style.display = (currentPage === 1) ? "none" : "inline-block";
  document.getElementById("nextBtn").style.display = (currentPage === totalPages) ? "none" : "inline-block";
  document.getElementById("submitBtn").style.display = (currentPage === totalPages) ? "inline-block" : "none";
}

// Navigation
function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    renderQuestions();
  }
}
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderQuestions();
  }
}

// Submit answers
function submitAnswers(event) {
  if (event) event.preventDefault(); // prevent page refresh

  let team = document.getElementById("team").value;
  if (!team) {
    alert("Please select a team!");
    return;
  }

  // Check if all inputs are filled
  for (let i = 1; i <= totalQuestions; i++) {
    let val = document.getElementById("q" + i).value.trim();
    if (val === "") {
      alert("⚠️ Please fill all questions before submitting!");
      return;
    }
  }

  // Count wrong answers
  let wrong = 0;
  for (let i = 1; i <= totalQuestions; i++) {
    let val = document.getElementById("q" + i).value.trim();
    if (val !== correctAnswers[i - 1]) {
      wrong++;
    }
  }

  // Show result
  document.getElementById("result").innerText =
    `✅ Submission received!\nYou got ${wrong} errors out of ${totalQuestions}.`;

  // Add entry to log
  let now = new Date().toLocaleString();
  document.getElementById("log").innerHTML += `${team} submitted at ${now} → Errors: ${wrong}<br>`;
}

// Initial render
renderQuestions();
