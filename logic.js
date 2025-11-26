// logic.js

// ====== DOM ELEMENTS ======
const raterNameInput      = document.getElementById("raterName");
const appSelect           = document.getElementById("applicationSelect");
const conflictSelect      = document.getElementById("conflictSelect");
const rankingSection      = document.getElementById("rankingSection");

const projectDescription  = document.getElementById("projectDescription");
const projectBudget       = document.getElementById("projectBudget");
const requestedAmount     = document.getElementById("requestedAmount");
const projectEvaluation   = document.getElementById("projectEvaluation");

const scoreAlignment      = document.getElementById("scoreAlignment");
const scoreInnovation     = document.getElementById("scoreInnovation");
const scoreBudget         = document.getElementById("scoreBudget");
const scoreEval           = document.getElementById("scoreEvaluation");
const commentsInput       = document.getElementById("comments");

const submitBtn           = document.getElementById("submitBtn");
const statusMessage       = document.getElementById("statusMessage");


// ====== POPULATE DROPDOWN ======
document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("applicationSelect");

  if (!select) {
    alert("Dropdown element not found");
    return;
  }

  if (!window.appData || !Array.isArray(appData)) {
    alert("appData not loaded");
    return;
  }

  select.innerHTML = '<option value="">-- Select Project --</option>';

  appData.forEach(app => {
    const option = document.createElement("option");
    option.value = app.ProjectName;
    option.textContent = app.ProjectName;
    select.appendChild(option);
  });

  console.log("✅ Project dropdown loaded:", appData.length);
});

// ====== UPDATE PROJECT DETAILS WHEN SELECTED ======
function handleApplicationChange() {
  const selected = appData.find(a => a.ProjectName === appSelect.value);
  if (!selected) {
    projectDescription.innerText = "";
    projectBudget.innerText = "";
    requestedAmount.innerText = "";
    projectEvaluation.innerText = "";
    return;
  }

  projectDescription.innerText = selected.ProjectDescription || "";
  projectBudget.innerText      = selected.ProjectBudget || "";
  requestedAmount.innerText    = selected.AmountRequested || "";
  projectEvaluation.innerText  = selected.Evaluation || "";
}


// ====== CONFLICT LOGIC ======
function handleConflictChange() {
  if (conflictSelect.value === "no") {
    rankingSection.classList.remove("hidden");
  } else {
    rankingSection.classList.add("hidden");
  }
}


// ====== SIMPLE FRONT-END VALIDATION ======
function validateForm() {
  if (!raterNameInput.value.trim()) {
    alert("Please enter your name.");
    return false;
  }

  if (!appSelect.value) {
    alert("Please select an application.");
    return false;
  }

  if (!conflictSelect.value) {
    alert("Please indicate if you have a conflict of interest.");
    return false;
  }

  if (conflictSelect.value === "yes") {
    alert("You indicated a conflict of interest. You should not rank this application.");
    return false;
  }

  if (!scoreAlignment.value || !scoreInnovation.value ||
      !scoreBudget.value || !scoreEval.value) {
    alert("Please score all criteria (Alignment, Innovation, Budget, Evaluation).");
    return false;
  }

  return true;
}


// ====== MICROSOFT FORMS SUBMIT ======
// ⚠️ IMPORTANT:
// Replace FORMS_ENDPOINT and FIELD_IDS.* with the values from your actual Microsoft Form.
// You typically get these from the "Collect responses via web" / API sample for your form.

const FORMS_ENDPOINT = "https://forms.office.com/formapi/api/9188040d-6c67-4c5b-b112-36a304b66dad/users/00000000-0000-0000-0003-400187f80e9d/forms('DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAANAAYf4Dp1UOFdPS1gyRkNIR0dIMlVGN0JSVVpPUTE4WS4u')/responses";

// Map our local fields to your Microsoft Forms question IDs
// (Use the IDs from your own form – the ones that look like "r1234567890abcdef")
const FIELD_IDS = {
  name:        "rb79731a456d34faf8dd28e9b569cf8f1",
  project:     "r93cc29f3bcf24a19a1a54fbf57cc2a58",
  alignment:   "rad03939b68d6435dbe06f20864a13d1d",
  innovation:  "r79fb96bce620427a9c2cc17cc1bc82ab",
  budget:      "rb251f09acb564e73a01bf2d66bf48189",
  evaluation:  "rfe8e6339ce1f4349803c40b60a9293cc",
  comments:    "rff5c599fb71d49bab9a1f41d2d0442ce"
};


async function submitToMicrosoftForms() {
  if (!validateForm()) return;

  statusMessage.textContent = "Submitting...";
  
  const payload = {
    // This structure MUST match what Microsoft Forms expects.
    // Adjust according to your Form's API example.
   answers: [
      { questionId: FIELD_IDS.name,       answer1: raterNameInput.value.trim() },
      { questionId: FIELD_IDS.project,    answer1: appSelect.value },
      { questionId: FIELD_IDS.alignment,  answer1: scoreAlignment.value },
      { questionId: FIELD_IDS.innovation, answer1: scoreInnovation.value },
      { questionId: FIELD_IDS.budget,     answer1: scoreBudget.value },
      { questionId: FIELD_IDS.evaluation, answer1: scoreEval.value },
      { questionId: FIELD_IDS.comments,   answer1: commentsInput.value.trim() }
    ]
  };

  try {
    const res = await fetch(FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Non-200 response: " + res.status);
    }

    statusMessage.textContent = "Thank you! Your ranking has been submitted.";
    // Optional: clear scores
    scoreAlignment.value = "";
    scoreInnovation.value = "";
    scoreBudget.value = "";
    scoreEval.value = "";
    commentsInput.value = "";

  } catch (err) {
    console.error(err);
    statusMessage.textContent = "There was an error submitting your ranking. Please try again or contact the administrator.";
  }
}


// ====== WIRE UP EVENTS ======
function init() {
  populateDropdown();

  conflictSelect.addEventListener("change", handleConflictChange);
  appSelect.addEventListener("change", handleApplicationChange);
  submitBtn.addEventListener("click", submitToMicrosoftForms);
}

document.addEventListener("DOMContentLoaded", init);



