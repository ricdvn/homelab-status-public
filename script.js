function tone(status) {
  if (status === "ok") return "ok";
  if (status === "down") return "down";
  return "unknown";
}

function label(status) {
  if (status === "ok") return "OK";
  if (status === "down") return "DOWN";
  return "SIN DATOS";
}

async function loadStatus() {
  const response = await fetch(`./status/public-status.json?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) {
    return;
  }

  const data = await response.json();
  document.getElementById("updated-at").textContent = data.summary.last_updated;
  document.getElementById("source").textContent = data.summary.source;
  document.getElementById("count").textContent = `${data.summary.total_checks}`;

  const overall = document.getElementById("overall");
  overall.textContent = label(data.summary.overall_status);
  overall.className = `badge ${tone(data.summary.overall_status)}`;

  const checks = document.getElementById("checks");
  checks.innerHTML = "";
  for (const check of data.checks) {
    const card = document.createElement("article");
    card.className = "check";
    card.innerHTML = `
      <div class="check-head">
        <div class="check-title">${check.label}</div>
        <div class="badge ${tone(check.status)}">${label(check.status)}${check.latency_ms ? ` · ${check.latency_ms}ms` : ""}</div>
      </div>
      <div class="message">${check.message}</div>
    `;
    checks.appendChild(card);
  }
}

loadStatus();
setInterval(loadStatus, 30000);
