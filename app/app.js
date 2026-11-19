"use strict";
// GTA VI trophy tracker: loads the 55 trophies from data/trophies.json,
// renders them as a filterable checklist, and keeps progress in localStorage.
// Query params preset the view (?tier=Silver, ?kind=Story) so a link opens
// straight onto one slice of the list.
const STORE_KEY = "gta6-trophy-progress-v1";
const grid = document.getElementById("grid");
const emptyBox = document.getElementById("empty");
const pctEl = document.getElementById("pct");
const barEl = document.getElementById("barfill");
const spoilerToggle = document.getElementById("spoilerToggle");

const params = new URLSearchParams(location.search);
let tierFilter = "all";
let kindFilter = "all";
let query = "";
if (params.get("tier")) tierFilter = params.get("tier");
if (params.get("kind")) kindFilter = params.get("kind");

let TROPHIES = [];
let earned = {};
try {
  earned = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {};
} catch (e) {
  earned = {};
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(earned));
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function updateProgress() {
  const n = Object.keys(earned).filter((k) => earned[k]).length;
  const pct = Math.round((n / TROPHIES.length) * 100);
  pctEl.textContent = n + " / " + TROPHIES.length + " · " + pct + "%";
  barEl.style.width = pct + "%";
}

function markActive(container, attr, value) {
  container.querySelectorAll("button").forEach((b) => {
    b.classList.toggle("active", b.dataset[attr] === value);
  });
}

function render() {
  const hideSpoilers = spoilerToggle.checked;
  const q = query.trim().toLowerCase();
  grid.innerHTML = "";
  let shown = 0;
  for (const t of TROPHIES) {
    if (tierFilter !== "all" && t.grade !== tierFilter.toLowerCase()) continue;
    if (kindFilter !== "all" && t.kind !== kindFilter) continue;
    if (q && !t.name.toLowerCase().includes(q)) continue;
    shown++;
    const isEarned = !!earned[t.id];
    const hidden = hideSpoilers && t.spoiler && !isEarned;
    const card = document.createElement("article");
    card.className = "trophy" + (isEarned ? " earned" : "");
    const nameHtml = hidden
      ? '<h3 class="hidden-name">??? (story trophy — hidden until earned)</h3>'
      : "<h3>" + esc(t.name) + "</h3>";
    const descHtml = hidden ? "" : '<p class="desc">“' + esc(t.description) + "”</p>";
    const guideHtml = hidden ? "" : '<p class="guide"><b>How:</b> ' + esc(t.guide) + "</p>";
    const flags = [];
    if (t.missable) flags.push('<span class="flag missable">Possibly missable</span>');
    if (t.spoiler) flags.push('<span class="flag spoiler">Story spoiler</span>');
    card.innerHTML =
      '<div class="top">' + nameHtml +
      '<span class="tier ' + t.grade + '">' + esc(t.grade) + "</span></div>" +
      '<div class="kind">' + esc(t.kind) + "</div>" +
      descHtml + guideHtml +
      (flags.length ? '<div class="flags">' + flags.join("") + "</div>" : "") +
      '<label class="check"><input type="checkbox" data-id="' + esc(t.id) + '"' +
      (isEarned ? " checked" : "") + "> Earned</label>";
    grid.appendChild(card);
  }
  emptyBox.hidden = shown !== 0;
  grid.querySelectorAll("input[type=checkbox][data-id]").forEach((cb) => {
    cb.addEventListener("change", () => {
      if (cb.checked) earned[cb.dataset.id] = true;
      else delete earned[cb.dataset.id];
      save();
      render();
    });
  });
  updateProgress();
}

document.getElementById("search").addEventListener("input", (e) => {
  query = e.target.value;
  render();
});

document.getElementById("tierFilters").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tier]");
  if (!b) return;
  tierFilter = b.dataset.tier;
  markActive(document.getElementById("tierFilters"), "tier", tierFilter);
  render();
});

document.getElementById("kindFilters").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-kind]");
  if (!b) return;
  kindFilter = b.dataset.kind;
  markActive(document.getElementById("kindFilters"), "kind", kindFilter);
  render();
});

spoilerToggle.addEventListener("change", render);

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob(
    [JSON.stringify({ game: "GTA VI", earned: Object.keys(earned).filter((k) => earned[k]), exported: new Date().toISOString() }, null, 2)],
    { type: "application/json" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gta6-trophy-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const list = Array.isArray(data) ? data : data.earned || [];
      const next = {};
      for (const id of list) {
        if (TROPHIES.some((t) => t.id === id)) next[id] = true;
      }
      earned = next;
      save();
      render();
    } catch (err) {
      alert("That file is not a valid progress export.");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Clear all earned trophies?")) return;
  earned = {};
  save();
  render();
});

const data = await (await fetch("data/trophies.json")).json();
TROPHIES = data.trophies;
markActive(document.getElementById("tierFilters"), "tier", tierFilter);
markActive(document.getElementById("kindFilters"), "kind", kindFilter);
render();
// Deep-link: ?scroll=grid jumps to the checklist, ?scroll=roadmap to the
// roadmap, after the cards have rendered so the target is in place.
const scrollTarget = params.get("scroll");
if (scrollTarget) {
  const el = document.getElementById(scrollTarget);
  if (el) el.scrollIntoView();
}
