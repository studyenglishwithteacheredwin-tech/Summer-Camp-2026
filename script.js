/* ============================================================
   Summer Camp 2026 — LIVE ATTENDANCE
   script.js — shared rendering + localStorage logic.

   Data-only lookups live in teams.js (CAMP). This file only
   contains DISPLAY and STORAGE logic — no roster data here.
   ============================================================ */

/* ---------- tiny DOM helpers ---------- */
function $(sel, root) { return (root || document).querySelector(sel); }
function esc(str) {
  return String(str).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

/* ---------- localStorage: per-team attendance ---------- */
function attendanceKey(teamNum) { return `camp_attendance_v1_team${teamNum}`; }

function getTeam(teamNum) {
  return CAMP.teams.find(t => t.num === teamNum);
}

function loadAttendance(teamNum) {
  const team = getTeam(teamNum);
  const raw = localStorage.getItem(attendanceKey(teamNum));
  let data;
  try { data = raw ? JSON.parse(raw) : null; } catch (e) { data = null; }
  if (!data || !Array.isArray(data.students) || !Array.isArray(data.adults)) {
    data = { students: team.roster.map(() => false), adults: team.adults.map(() => false) };
  }
  // If roster length changed since last save, pad/truncate safely.
  while (data.students.length < team.roster.length) data.students.push(false);
  while (data.adults.length < team.adults.length) data.adults.push(false);
  data.students.length = team.roster.length;
  data.adults.length = team.adults.length;
  return data;
}

function saveAttendance(teamNum, data) {
  data.updatedAt = new Date().toISOString();
  localStorage.setItem(attendanceKey(teamNum), JSON.stringify(data));
}

function countChecked(arr) { return arr.filter(Boolean).length; }

/* ---------- localStorage: Eva's own early-exit handoff log ----------
   NOTE: this is a single-device log (Eva's own phone). There is no
   backend, so it cannot see checkbox taps made on a Team Leader's
   phone. TODO (V2): real-time cross-device sync would need a backend
   or cloud store — out of scope for V1 per the project brief.
------------------------------------------------------------------- */
const EVA_HANDOFF_KEY = "camp_eva_handoffs_v1";

function loadEvaHandoffs() {
  const raw = localStorage.getItem(EVA_HANDOFF_KEY);
  try { return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
}
function saveEvaHandoffs(obj) {
  localStorage.setItem(EVA_HANDOFF_KEY, JSON.stringify(obj));
}
function handoffId(entry) { return `t${entry.team}_r${entry.rosterIndex}`; }

/* ---------- Swim status rendering ---------- */
function swimBadgeHTML(status) {
  const info = CAMP.swimStatus[status];
  if (!info) return "";
  let html = `<span class="status-badge">${info.emoji} ${esc(info.label)}</span>`;
  if (info.tag) html += `<span class="status-tag">${esc(info.tag)}</span>`;
  return html;
}

// Dot-only version (no "CAN SWIM" / "BEGINNER" text) — used on the Master
// Dashboard, which needs a dense, scannable list rather than full badges.
function swimDotHTML(status) {
  const info = CAMP.swimStatus[status];
  if (!info) return "";
  return `<span class="status-dot" title="${esc(info.label)}">${info.emoji}</span>`;
}

function swimSummaryFor(team) {
  const counts = { can_swim: 0, beginner: 0, cannot_swim: 0, unknown: 0 };
  team.roster.forEach(s => { counts[s.status] = (counts[s.status] || 0) + 1; });
  return counts;
}

function swimSummaryChipsHTML(team) {
  const counts = swimSummaryFor(team);
  const order = ["can_swim", "beginner", "cannot_swim", "unknown"];
  return `<div class="swim-summary">` + order
    .filter(k => counts[k] > 0)
    .map(k => `<span class="swim-chip">${CAMP.swimStatus[k].emoji} ${CAMP.swimStatus[k].label} ${counts[k]}</span>`)
    .join("") + `</div>`;
}

/* ---------- Shared banners ---------- */
function chainOfResponsibilityBannerHTML() {
  const p = CAMP.earlyExitProcedure;
  return `
    <div class="banner info">
      <div class="banner-title">🔁 If a swimmer leaves the pool early</div>
      <div>${esc(p.heading)}</div>
      <div class="chain">${esc(p.chain)}</div>
      <div style="margin-top:6px; font-weight:800; color:#7a0000;">${esc(p.alert)}</div>
    </div>`;
}

function swimmingReminderBannerHTML(team) {
  const cannotSwim = team.roster.filter(s => s.status === "cannot_swim");
  if (cannotSwim.length === 0) return "";
  const names = cannotSwim.map(s => esc(s.name)).join(", ");
  return `
    <div class="banner alert">
      <div class="banner-title">🚨 SWIMMING REMINDER</div>
      <div>The following students will join Eva during swimming:</div>
      <div style="font-weight:800; margin:6px 0;">${names}</div>
      <div>Before swimming begins, personally hand these students over to Eva.</div>
    </div>`;
}

function team6TransportNoticeHTML(team) {
  if (team.bus !== "split") return "";
  const s = team.busSplit;
  return `
    <div class="banner warn">
      <div class="banner-title">⚠️ Transportation Only</div>
      <div>Team 6 is split between buses for transportation only:</div>
      <ul>
        <li><strong>Bus 1</strong> — ${esc(s.bus1.note)}</li>
        <li><strong>Bus 2</strong> — ${esc(s.bus2.note)}</li>
      </ul>
      <div style="margin-top:6px;">All Team 6 students regroup with <strong>Edwin</strong> immediately after arriving at Orchard Home Forest.</div>
    </div>`;
}

/* ---------- Live clock (optional nicety) ---------- */
function startClock(el) {
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  tick();
  setInterval(tick, 15000);
}

function ordinal(n) {
  if (n == null) return "";
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function busLabelFor(team) {
  if (team.bus === "split") return "Split — Bus 1 & Bus 2";
  const bus = CAMP.buses[team.bus];
  return `Bus ${bus.number} (${bus.capacity} seats)`;
}

function boardingOrderLabelFor(team) {
  if (team.bus === "split") return "See transportation notice";
  return ordinal(team.boardingOrder);
}

function totalTravellingFor(team) {
  return team.roster.length + team.adults.length + 1; // students + adults + team leader
}

// Reusable "Team Number is the primary identifier" block.
// Team Number is always the largest text, Leader name is always the second line.
// `opts.lines` controls which extra meta lines appear below the leader name.
function teamIdBlockHTML(team, opts = {}) {
  // Compact mode: used for the Team page's STICKY header, which must stay
  // small on mobile (no more than ~20% of the screen). Team Number, Leader,
  // and a large, clear Bus + Boarding Order line — the two facts a Team
  // Leader needs at a glance while boarding. No clock here (the phone's own
  // clock already shows the time). Time, Students, Adults, and Total
  // Travelling live in a normal (non-sticky) card further down the page.
  if (opts.compact) {
    const boardingShort = team.bus === "split" ? "See notice" : ordinal(team.boardingOrder);
    return `
      <div class="team-id-compact">
        <div class="team-number-sm">TEAM ${team.num}</div>
        <div class="team-leader-sm">Leader: ${esc(team.leader)}</div>
        <div class="team-bus-sm">🚌 ${busLabelFor(team)} &nbsp;·&nbsp; 📋 Boarding: ${boardingShort}</div>
      </div>`;
  }

  const lines = [];
  if (opts.time !== false) lines.push(esc(team.time));
  if (opts.boarding) lines.push(`📋 Boarding Order: ${boardingOrderLabelFor(team)}`);
  if (opts.students) lines.push(`👦 Students: ${team.roster.length}`);
  if (opts.adults) {
    const adultsLabel = team.adults.length === 0 ? "None" : esc(team.adults.join(", "));
    lines.push(`👨 Adults: ${adultsLabel}`);
  }
  if (opts.total !== false) lines.push(`👥 Total Travelling: ${totalTravellingFor(team)} <span class="incl-leader">(incl. Leader)</span>`);
  if (opts.bus !== false) lines.push(`🚌 ${busLabelFor(team)}`);
  return `
    <div class="team-id-block">
      <div class="team-number">TEAM ${team.num}</div>
      <div class="team-leader-line">Leader: ${esc(team.leader)}</div>
      ${lines.map(l => `<div class="team-meta-line">${l}</div>`).join("")}
    </div>`;
}

/* ============================================================
   TEAM PAGE
   ============================================================ */
function renderTeamPage(teamNum) {
  const team = getTeam(teamNum);
  const root = $("#app");
  const headerRoot = $("#teamHeader");
  const attendance = loadAttendance(teamNum);

  // Sticky header: pinned at top while scrolling (the .app-header element is
  // already position:sticky in style.css), compact but shows the essentials
  // a Team Leader needs at a glance — team number, leader, bus, boarding
  // order, and total travelling.
  if (headerRoot) {
    headerRoot.innerHTML = teamIdBlockHTML(team, { compact: true });
  }

  // The sticky header only shows Team Number, Leader, Boarding Order, and
  // Bus (kept deliberately tiny on mobile — no more than ~20% of the
  // screen). Everything else — Time, Students, Adults, Total Travelling,
  // and the swim breakdown — lives in this normal (non-sticky) card
  // instead, so nothing is lost, it just isn't pinned on screen anymore.
  function summaryCardHTML() {
    const adultsValue = team.adults.length === 0
      ? "None"
      : `<ul class="adults-summary-list">${team.adults.map(a => `<li>${esc(a)}</li>`).join("")}</ul>`;
    return `
      <div class="card">
        <div class="card-row"><span class="label">🕐 Time</span><span class="value">${esc(team.time)}</span></div>
        <div class="card-row"><span class="label">👦 Students</span><span class="value">${team.roster.length}</span></div>
        <div class="card-row-stacked"><span class="label">👨 Adults</span><span class="value">${adultsValue}</span></div>
        <div class="card-row"><span class="label">👥 Total Travelling<span class="incl-leader-sub">(incl. Leader)</span></span><span class="value">${totalTravellingFor(team)}</span></div>
        ${swimSummaryChipsHTML(team)}
      </div>`;
  }

  function rosterListHTML() {
    const items = team.roster.map((s, i) => {
      const checked = attendance.students[i];
      return `
        <li class="roster-item ${checked ? "checked" : ""}">
          <input type="checkbox" class="big-checkbox" data-kind="student" data-idx="${i}" ${checked ? "checked" : ""} aria-label="${esc(s.name)} present">
          <div class="roster-info">
            <div class="roster-name">${esc(s.name)}</div>
            <div class="roster-status-row">${swimBadgeHTML(s.status)}</div>
            ${s.notes ? `<div class="roster-note">${esc(s.notes)}</div>` : ""}
          </div>
        </li>`;
    }).join("");
    return `<ul class="roster-list">${items}</ul>`;
  }

  function adultsListHTML() {
    if (team.adults.length === 0) return "";
    const items = team.adults.map((name, i) => {
      const checked = attendance.adults[i];
      return `
        <li class="roster-item ${checked ? "checked" : ""}">
          <input type="checkbox" class="big-checkbox" data-kind="adult" data-idx="${i}" ${checked ? "checked" : ""} aria-label="${esc(name)} present">
          <div class="roster-info">
            <div class="roster-name">${esc(name)}</div>
          </div>
        </li>`;
    }).join("");
    return `<div class="section-title">Adults</div><ul class="roster-list">${items}</ul>`;
  }

  function totalsBarHTML() {
    const sPresent = countChecked(attendance.students);
    const aPresent = countChecked(attendance.adults);
    // TOTAL includes the Team Leader (always counted present on their own device).
    const totalPresent = sPresent + aPresent + 1;
    const totalOf = team.roster.length + team.adults.length + 1;
    // The bar itself doubles as the "everyone here" signal — grey by
    // default, turns green once every student and adult is checked. No
    // separate light/button needed.
    const allPresent = sPresent === team.roster.length && aPresent === team.adults.length;
    return `
      <div class="totals-bar ${allPresent ? "all-present" : ""}">
        <div class="stat-grid">
          <div class="stat"><div class="stat-label">Students</div><div class="stat-value">${sPresent} / ${team.roster.length}</div></div>
          <div class="stat"><div class="stat-label">Adults</div><div class="stat-value">${aPresent} / ${team.adults.length}</div></div>
          <div class="stat total"><div class="stat-label">Total</div><div class="stat-value">${totalPresent} / ${totalOf}</div></div>
        </div>
      </div>`;
  }

  function fullRender() {
    root.innerHTML = `
      ${team6TransportNoticeHTML(team)}
      ${summaryCardHTML()}
      ${swimmingReminderBannerHTML(team)}
      <div class="section-title">Attendance</div>
      ${rosterListHTML()}
      ${adultsListHTML()}
      <div class="btn-row">
        <button class="btn secondary" id="resetBtn">↺ Reset</button>
      </div>
      ${chainOfResponsibilityBannerHTML()}
      ${totalsBarHTML()}
      <a class="home-link" href="Summer Camp 2026.html">← Home</a>
    `;

    root.querySelectorAll('input[type="checkbox"][data-kind]').forEach(cb => {
      cb.addEventListener("change", () => {
        const idx = Number(cb.dataset.idx);
        if (cb.dataset.kind === "student") attendance.students[idx] = cb.checked;
        else attendance.adults[idx] = cb.checked;
        saveAttendance(teamNum, attendance);
        fullRender();
      });
    });

    const resetBtn = $("#resetBtn", root);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const ok = window.confirm(`Uncheck everyone for Team ${team.num}? This can't be undone.`);
        if (!ok) return;
        attendance.students = attendance.students.map(() => false);
        attendance.adults = attendance.adults.map(() => false);
        saveAttendance(teamNum, attendance);
        fullRender();
      });
    }
  }

  fullRender();
}

/* ============================================================
   BUS BOARDING ORDER
   Which team boards each bus first, and — within a team — which
   students/adults need to board first (motion sickness, boarding with a
   parent, etc). All data reused as-is from CAMP.teams (bus, boardingOrder,
   busSplit, priorityBoarding) — nothing invented here.
   ============================================================ */
function busTeamsSorted(busNum) {
  const entries = [];
  CAMP.teams.forEach(team => {
    if (team.bus === busNum) {
      entries.push({ team, order: team.boardingOrder, splitNote: null });
    } else if (team.bus === "split" && team.busSplit) {
      const split = team.busSplit[busNum === 1 ? "bus1" : "bus2"];
      if (split) entries.push({ team, order: split.order, splitNote: split.note });
    }
  });
  entries.sort((a, b) => a.order - b.order);
  return entries;
}

// Team boarding order only — no priority-boarding info mixed in here.
// Priority boarders for this bus are shown separately in their own box
// (see busPriorityBoxHTML), tagged with which team they're from.
function boardingEntryHTML(entry) {
  const { team, order, splitNote } = entry;
  return `
    <div class="boarding-entry">
      <div class="boarding-order-num">${ordinal(order)}</div>
      <div class="boarding-entry-body">
        <div class="boarding-team-line">TEAM ${team.num} <span class="boarding-leader">— ${esc(team.leader)}</span></div>
        ${splitNote ? `<div class="boarding-split-note">${esc(splitNote)}</div>` : ""}
      </div>
    </div>`;
}

// A single box per bus listing everyone (across all teams on that bus) who
// needs to board first, each tagged with their team so it's still clear
// which team they belong to.
function busPriorityBoxHTML(busNum) {
  const entries = busTeamsSorted(busNum);
  const rows = [];
  entries.forEach(({ team }) => {
    (team.priorityBoarding || []).forEach(p => rows.push({ ...p, teamNum: team.num }));
  });
  if (rows.length === 0) return "";
  return `
    <div class="boarding-priority-box">
      <div class="boarding-priority-box-heading">🥇 Boards First</div>
      <ul class="boarding-priority-box-list">
        ${rows.map(r => `
          <li>
            <span class="bp-name">${esc(r.name)}</span>
            ${r.reason ? `<span class="bp-reason"> — ${esc(r.reason)}</span>` : ""}
            <span class="bp-team">Team ${r.teamNum}</span>
          </li>`).join("")}
      </ul>
    </div>`;
}

function busSectionHTML(busNum) {
  const bus = CAMP.buses[busNum];
  const entries = busTeamsSorted(busNum);
  return `
    <div class="card">
      <h2>🚌 Bus ${bus.number} <span class="bus-cap">(${bus.capacity} seats — ${esc(bus.teacher)})</span></h2>
      ${entries.map(boardingEntryHTML).join("")}
      ${busPriorityBoxHTML(busNum)}
    </div>`;
}

function renderBoardingPage() {
  const root = $("#app");
  if (!root) return;
  root.innerHTML = `
    ${busSectionHTML(1)}
    ${busSectionHTML(2)}
    <div class="footnote">Board in this order. Anyone listed under "Boards First" should board before the rest of their team.</div>
    <a class="home-link" href="Summer Camp 2026.html">← Home</a>
  `;
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function renderHomePage() {
  const root = $("#navGrid");
  if (!root) return;

  // Bus Boarding Order is the very first button — which team boards
  // which bus first, and who within a team boards first.
  const boardingHTML = `<a class="nav-btn boarding" href="boarding.html">🚌 Bus Boarding Order<small>Which team — and who — boards first</small></a>`;

  // Schedule stays near the top (quick reference for everyone).
  const scheduleHTML = `<a class="nav-btn schedule" href="schedule.html">📅 Today's Schedule<small>Quick reference — everyone</small></a>`;

  const teamButtonsHTML = CAMP.teams.map(team => `
    <a class="nav-btn" href="team${team.num}.html">
      ${teamIdBlockHTML(team, { boarding: false })}
    </a>`).join("");

  // Master Dashboard and Eva sit below all 6 team buttons.
  const bottomLinks = [
    { href: "master.html", cls: "master", label: "Master Dashboard", sub: "Edwin — all teams" },
    { href: "eva.html", cls: "eva", label: "Eva", sub: "Camp Operations Manager" },
  ];
  const bottomHTML = bottomLinks.map(l =>
    `<a class="nav-btn ${l.cls}" href="${l.href}">${esc(l.label)}<small>${esc(l.sub)}</small></a>`
  ).join("");

  root.innerHTML = boardingHTML + scheduleHTML + teamButtonsHTML + bottomHTML;
}

/* ============================================================
   MASTER DASHBOARD (Edwin)
   NOTE: live present/absent counts only reflect this device's
   localStorage. If each Team Leader uses their own phone, this
   dashboard will show 0 checked until attendance has also been
   taken on this same device. TODO (V2): cross-device sync.
   ============================================================ */
// Who from this team needs to board first (per the master project's bus
// seating priority list) — e.g. a student with motion sickness who needs
// the front seat, or a family group boarding together. Empty for teams
// with no priority-boarding individuals.
// Set of names (per team) that are on the bus-seating priority-boarding
// list, so the full roster list below can tag them inline instead of
// showing them in a separate block.
function priorityNameSet(team) {
  return new Set((team.priorityBoarding || []).map(p => p.name));
}

function masterStudentListHTML(team) {
  const priority = priorityNameSet(team);
  const items = team.roster.map(s => {
    const tag = priority.has(s.name) ? `<span class="priority-tag">🥇</span>` : "";
    return `<li>
      <span class="roster-mini-name">${esc(s.name)}${tag}</span>
      <span class="roster-mini-status">${swimDotHTML(s.status)}</span>
    </li>`;
  }).join("");
  return `<ul class="roster-mini-list">${items}</ul>`;
}

function masterAdultListHTML(team) {
  if (team.adults.length === 0) {
    return `<div class="priority-none">None</div>`;
  }
  const priority = priorityNameSet(team);
  const items = team.adults.map(name => {
    const tag = priority.has(name) ? `<span class="priority-tag">🥇</span>` : "";
    return `<li><span class="roster-mini-name">${esc(name)}${tag}</span></li>`;
  }).join("");
  return `<ul class="roster-mini-list">${items}</ul>`;
}

function renderMasterDashboard() {
  // Static reference only — this app has no backend/sync, so the Master
  // Dashboard cannot know what's been checked off on each Team Leader's own
  // phone. Live present/absent counts belong on the individual Team pages
  // only. See: /sessions/.../README or the project brief for this rule.
  const root = $("#app");
  const cardsHTML = CAMP.teams.map(team => {
    const totalTravelling = totalTravellingFor(team);
    return `
      <div class="card">
        <div class="card-id-header">
          <div class="team-number">TEAM ${team.num}</div>
          <div class="team-leader-line">Leader: ${esc(team.leader)}</div>
        </div>
        <div class="card-row"><span class="label">🚌 Bus</span><span class="value">${busLabelFor(team)}</span></div>
        <div class="card-row"><span class="label">📋 Boarding Order</span><span class="value">${boardingOrderLabelFor(team)}</span></div>
        <div class="section-title-mini">👦 Students (${team.roster.length})</div>
        ${masterStudentListHTML(team)}
        <div class="section-title-mini">👨 Adults (${team.adults.length})</div>
        ${masterAdultListHTML(team)}
        <div class="card-row"><span class="label">👥 Total Travelling<span class="incl-leader-sub">(incl. Leader)</span></span><span class="value">${totalTravelling}</span></div>
      </div>`;
  }).join("");

  const overall = campOverallTotals();

  root.innerHTML = `
    ${chainOfResponsibilityBannerHTML()}
    ${cardsHTML}
    <div class="card">
      <h2>Overall Attendance</h2>
      <div class="card-row"><span class="label">Students</span><span class="value">${overall.students}</span></div>
      <div class="card-row"><span class="label">Adults</span><span class="value">${overall.adults}</span></div>
      <div class="card-row"><span class="label">Team Members</span><span class="value">${overall.teamMembers}</span></div>
      <div class="card-row"><span class="label">TOTAL</span><span class="value">${overall.total}</span></div>
    </div>
    <div class="footnote">This is a quick reference only. Live attendance is tracked on each Team page, on that Team Leader's own device.</div>
    <div class="btn-row">
      <a class="nav-btn eva" href="eva.html">Eva<small>Camp Operations Manager</small></a>
    </div>
    <a class="home-link" href="Summer Camp 2026.html">← Home</a>
  `;
}

/* ============================================================
   EVA PAGE
   ============================================================ */
function renderEvaPage() {
  const root = $("#app");
  const handoffs = loadEvaHandoffs();

  function nonSwimmerListHTML() {
    const items = CAMP.nonSwimmers.map(s => `
      <li class="roster-item">
        <div class="roster-info">
          <div class="roster-name">${esc(s.name)} <span class="status-tag">(${esc(s.teamLabel)})</span></div>
          <div class="roster-status-row">${swimBadgeHTML(s.status)}</div>
          ${s.notes ? `<div class="roster-note">${esc(s.notes)}</div>` : ""}
        </div>
      </li>`).join("");
    return `<ul class="roster-list">${items}</ul>`;
  }

  function medicalRemindersHTML() {
    if (CAMP.medicalReminders.length === 0) {
      return `<div class="roster-note">No medical reminders on file.</div>`;
    }
    const items = CAMP.medicalReminders.map(s => `
      <li class="roster-item">
        <div class="roster-info">
          <div class="roster-name">${esc(s.name)} <span class="status-tag">(${esc(s.teamLabel)})</span></div>
          <div class="roster-note">${esc(s.notes)}</div>
        </div>
      </li>`).join("");
    return `<ul class="roster-list">${items}</ul>`;
  }

  function behaviourRemindersHTML() {
    // TODO (V2): no behaviour-flag field exists in the source roster data yet.
    return `<div class="roster-note">No behaviour reminders on file.</div>`;
  }

  function handoffListHTML() {
    const items = CAMP.potentialEarlyExits.map(s => {
      const id = handoffId(s);
      const checked = !!handoffs[id];
      return `
        <li class="roster-item ${checked ? "checked" : ""}">
          <input type="checkbox" class="big-checkbox" data-handoff="${id}" ${checked ? "checked" : ""} aria-label="${esc(s.name)} handed over">
          <div class="roster-info">
            <div class="roster-name">${esc(s.name)} <span class="status-tag">(${esc(s.teamLabel)})</span></div>
            <div class="roster-status-row">${swimBadgeHTML(s.status)}</div>
          </div>
        </li>`;
    }).join("");
    return `<ul class="roster-list">${items}</ul>`;
  }

  root.innerHTML = `
    <div class="card">
      <h2>${esc(CAMP.campOperationsManager.name)} — Camp Operations Manager</h2>
      <div class="roster-note">${esc(CAMP.campOperationsManager.title)}</div>
    </div>

    ${chainOfResponsibilityBannerHTML()}

    <div class="section-title">🏊 With Eva During Swimming (Non-Swimmers)</div>
    ${nonSwimmerListHTML()}

    <div class="section-title">🩹 Medical Reminders</div>
    <div class="card">${medicalRemindersHTML()}</div>

    <div class="section-title">🧭 Behaviour Reminders</div>
    <div class="card">${behaviourRemindersHTML()}</div>

    <div class="section-title">↩️ Handed Over Early From Swimming</div>
    <div class="roster-note">Tap to mark a swimmer as received. This list is on Eva's device only.</div>
    ${handoffListHTML()}

    <a class="home-link" href="Summer Camp 2026.html">← Home</a>
  `;

  root.querySelectorAll("input[data-handoff]").forEach(cb => {
    cb.addEventListener("change", () => {
      const h = loadEvaHandoffs();
      h[cb.dataset.handoff] = cb.checked;
      saveEvaHandoffs(h);
      renderEvaPage();
    });
  });
}

/* ============================================================
   TODAY'S SCHEDULE
   Quick reference for all Team Leaders — available to everyone.
   ============================================================ */
function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// A point-in-time event (no end) counts as "current" for a short window
// after its start, so it briefly highlights instead of never lighting up.
const SCHEDULE_POINT_EVENT_WINDOW_MIN = 15;

function currentScheduleIndex(nowMinutes) {
  for (let i = 0; i < CAMP.schedule.length; i++) {
    const item = CAMP.schedule[i];
    const start = timeToMinutes(item.start);
    const end = item.end ? timeToMinutes(item.end) : start + SCHEDULE_POINT_EVENT_WINDOW_MIN;
    if (nowMinutes >= start && nowMinutes < end) return i;
  }
  return -1;
}

function scheduleBlockHTML(block) {
  switch (block.type) {
    case "title":
      return `<div class="sched-title">${esc(block.text)}</div>`;
    case "activity":
      return `<div class="sched-activity">${esc(block.text)}</div>`;
    case "group":
      return `<div class="sched-group"><span class="sched-group-label">${esc(block.label)}</span>${esc(block.text)}</div>`;
    case "shared":
      return `<div class="sched-shared">
        <div class="sched-shared-heading">${esc(block.heading)}</div>
        <ul>${block.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>`;
    case "note":
      return `<div class="sched-note">${esc(block.text)}</div>`;
    case "reminder":
      return `<div class="sched-reminder">
        <div class="sched-reminder-heading">${esc(block.heading)}</div>
        ${block.intro ? `<div class="sched-reminder-intro">${esc(block.intro)}</div>` : ""}
        ${block.subheading ? `<div class="sched-reminder-subheading">${esc(block.subheading)}</div>` : ""}
        ${block.items ? `<ul class="sched-reminder-list">${block.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
        ${block.note ? `<div class="sched-reminder-note">${esc(block.note)}</div>` : ""}
      </div>`;
    default:
      return "";
  }
}

function scheduleTimeLabel(item) {
  return item.end ? `${item.start} – ${item.end}` : item.start;
}

// Local "YYYY-MM-DD" for a Date object, so it can be compared against
// CAMP.date without timezone/UTC drift.
function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatCampDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function renderSchedulePage() {
  const root = $("#app");
  const now = new Date();
  const isCampDay = !CAMP.date || localDateStr(now) === CAMP.date;
  const currentIdx = isCampDay ? currentScheduleIndex(now.getHours() * 60 + now.getMinutes()) : -1;

  const cardsHTML = CAMP.schedule.map((item, i) => {
    const isCurrent = i === currentIdx;
    return `
      <div class="timeline-item ${isCurrent ? "current" : ""}">
        ${isCurrent ? `<div class="current-badge">🟢 CURRENT ACTIVITY</div>` : ""}
        <div class="timeline-time">${item.icon} ${esc(scheduleTimeLabel(item))}</div>
        <div class="timeline-body">
          ${item.blocks.map(scheduleBlockHTML).join("")}
        </div>
      </div>`;
  }).join("");

  const campDayNoticeHTML = (!isCampDay && CAMP.date)
    ? `<div class="banner info">
        <div class="banner-title">📅 Camp Day: ${esc(formatCampDate(CAMP.date))}</div>
        <div>This is the plan for camp day. Nothing is marked "current" until that day.</div>
      </div>`
    : "";

  root.innerHTML = `
    ${campDayNoticeHTML}
    <div class="timeline">${cardsHTML}</div>

    <div class="section-title">Important Reminders</div>

    <div class="banner warn">
      <div class="banner-title">🏊 Swimming</div>
      <div>🟡 Beginners must wear life vests.</div>
      <div>🔴 Cannot Swim students stay with Eva.</div>
    </div>

    ${chainOfResponsibilityBannerHTML()}

    <div class="banner info">
      <div class="banner-title">🚌 Before Leaving ANY Location</div>
      <ul>
        <li>✓ Team attendance</li>
        <li>✓ Adult attendance</li>
        <li>✓ Head count</li>
        <li>✓ Report any missing student immediately</li>
      </ul>
    </div>

    <a class="home-link" href="Summer Camp 2026.html">← Home</a>
  `;
}
