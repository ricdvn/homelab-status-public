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

function formatUpdatedAt(value) {
  const match = /^(\d{2}\/\d{2})\s+(\d{2}:\d{2}:\d{2})$/.exec(value || "");
  if (!match) return value || "-";
  return `${match[2]} - ${match[1]}`;
}

function formatMessage(value) {
  if (value === "reachable") return "ping";
  if (value === "HTTP 200") return "http request";
  return value;
}

async function loadStatus() {
  const response = await fetch(`./status/public-status.json?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) {
    return;
  }

  const data = await response.json();
  document.getElementById("updated-at").textContent = formatUpdatedAt(data.summary.last_updated);

  const checks = document.getElementById("checks");
  checks.innerHTML = "";
  for (const check of data.checks) {
    const card = document.createElement("article");
    card.className = `check${check.variant ? ` ${check.variant}` : ""}`;
    card.innerHTML = `
      <div class="check-head">
        <div class="check-title">${check.label}</div>
        <div class="check-status">
          <div class="badge ${tone(check.status)}">${label(check.status)}${check.latency_ms ? ` · ${check.latency_ms}ms` : ""}</div>
          <div class="check-detail">${formatMessage(check.message)}</div>
        </div>
      </div>
    `;
    checks.appendChild(card);
  }
}

loadStatus();
setInterval(loadStatus, 30000);
