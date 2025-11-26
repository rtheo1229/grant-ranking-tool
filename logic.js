console.log("logic.js loaded");

const appSelect = document.getElementById("applicationSelect");
const conflict = document.getElementById("conflictSelect");
const ranking = document.getElementById("rankingSection");

// ✅ 1. Populate dropdown
function populateDropdown() {
  if (!window.appData || !Array.isArray(window.appData)) {
    console.error("appData not found");
    return;
  }

  window.appData.forEach(app => {
    const option = document.createElement("option");
    option.value = app.ProjectName;
    option.textContent = app.ProjectName;
    appSelect.appendChild(option);
  });
}

populateDropdown();

// ✅ 2. ALWAYS show project details when project is selected
appSelect.addEventListener("change", () => {
  const selected = window.appData.find(
    a => a.ProjectName === appSelect.value
  );

  if (!selected) return;

  document.getElementById("projectDescription").innerText =
    selected.ProjectDescription || "";

  document.getElementById("projectBudget").innerText =
    selected.ProjectBudget || "";

  document.getElementById("requestedAmount").innerText =
    selected.AmountRequested || "";

  document.getElementById("projectEvaluation").innerText =
    selected.Evaluation || "";
});

// ✅ 3. ONLY control SCORING visibility with conflict
conflict.addEventListener("change", () => {
  if (conflict.value === "no") {
    ranking.classList.remove("hidden");
  } else {
    ranking.classList.add("hidden");
  }
});
