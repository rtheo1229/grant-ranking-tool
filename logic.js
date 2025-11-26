console.log("✅ logic.js loaded");

function forcePopulateDropdown() {
  const select = document.getElementById("applicationSelect");

  if (!select) {
    console.error("❌ applicationSelect NOT found");
    return;
  }

  if (!window.appData || window.appData.length === 0) {
    console.error("❌ appData NOT found on window");
    return;
  }

  console.log("✅ Found", window.appData.length, "projects");

  select.innerHTML = '<option value="">-- Select Project --</option>';

  window.appData.forEach(app => {
    const option = document.createElement("option");
    option.value = app.ProjectName;
    option.textContent = app.ProjectName;
    select.appendChild(option);
  });
}

// Run multiple times to defeat GoDaddy iframe delays
setTimeout(forcePopulateDropdown, 500);
setTimeout(forcePopulateDropdown, 1500);
setTimeout(forcePopulateDropdown, 3000);
