/* ============================================================
   Summer Camp 2026 — LIVE ATTENDANCE
   teams.js — SINGLE SOURCE OF TRUTH for all app data.

   This data is transcribed directly from the master project
   (Summer Camp 2026 - Team Attendance workbook / build.py).
   Do not duplicate or re-type this data elsewhere — every page
   reads from the CAMP object defined here.
   ============================================================ */

const CAMP = {

  // ---- Swimming status labels (use ONLY these four) ----
  swimStatus: {
    can_swim:    { emoji: "🟢", label: "CAN SWIM",      tag: "" },
    beginner:    { emoji: "🟡", label: "BEGINNER",      tag: "🦺 Life Vest Required" },
    cannot_swim: { emoji: "🔴", label: "CANNOT SWIM",   tag: "With Eva during swimming" },
    unknown:     { emoji: "❓", label: "UNKNOWN",       tag: "Confirm before swimming" },
  },

  // ---- Buses ----
  buses: {
    1: { number: 1, capacity: 45, teacher: "Edwin" },
    2: { number: 2, capacity: 29, teacher: "Eva" },
  },

  // ---- Camp Operations Manager ----
  campOperationsManager: {
    name: "Eva",
    title: "Camp Operations Manager (no longer a Team Leader)",
    responsibilities: [
      "Overall camp supervision",
      "Parent communication",
      "Support all team leaders",
      "Behaviour management",
      "Student issues",
      "Float between activity stations",
      "Swimming supervision",
      "Non-swimmer activities",
      "Transition management",
    ],
  },

  // ---- Chain of responsibility (shown on every operational page) ----
  earlyExitProcedure: {
    heading: "If a swimmer wants to leave the pool early:",
    steps: [
      "Student reports to Team Leader.",
      "Team Leader personally escorts the student to Eva.",
      "Eva accepts responsibility for the student.",
      "Student joins the non-swimmer activities.",
    ],
    chain: "Student → Team Leader → Eva",
    alert: "Students must NEVER move between activities on their own.",
  },

  // ---- Teams (roster data is verbatim from build.py) ----
  teams: [
    {
      num: 1,
      time: "T/Th 5:30p + 7:15p",
      leader: "Anna Ho",
      bus: 2,
      boardingOrder: 1,
      priorityBoarding: [
        { name: "Emily", reason: "Motion sickness — front bus" },
      ],
      adults: [],
      roster: [
        { name: "Phạm Trần Hoàng Anh (Ronaldo)", status: "can_swim", notes: "" },
        { name: "Trần Phương Trà (Tracy)", status: "beginner", notes: "" },
        { name: "Nguyễn Thiên Lương (Matt)", status: "can_swim", notes: "" },
        { name: "Nguyễn Vũ Phương Linh (Lucy)", status: "can_swim", notes: "" },
        { name: "Nguyễn Vũ Mai Hương (Anna)", status: "can_swim", notes: "" },
        { name: "Phạm Tiến Dũng (Kim)", status: "can_swim", notes: "" },
        { name: "Emily", status: "cannot_swim", notes: "Motion sickness (Front bus)" },
        { name: "Alex", status: "cannot_swim", notes: "" },
        { name: "Nguyễn Quỳnh Thiên Ân (Lucy)", status: "cannot_swim", notes: "" },
        { name: "Mai Phương Anh (Anna)", status: "cannot_swim", notes: "" },
        { name: "Teddy", status: "can_swim", notes: "" },
        { name: "Panda", status: "beginner", notes: "" },
      ],
    },
    {
      num: 2,
      time: "W/F 5:30p + S/S 8:00a",
      leader: "Tina",
      bus: 2,
      boardingOrder: 2,
      priorityBoarding: [],
      adults: [],
      roster: [
        { name: "Ken", status: "beginner", notes: "" },
        { name: "Ben Le", status: "can_swim", notes: "" },
        { name: "Anna", status: "beginner", notes: "" },
        { name: "Ben Nguyen (Demarcus)", status: "can_swim", notes: "" },
        { name: "Helen", status: "can_swim", notes: "" },
        { name: "Remy", status: "can_swim", notes: "" },
        { name: "Bean", status: "can_swim", notes: "" },
        { name: "Anna Đào", status: "can_swim", notes: "" },
      ],
    },
    {
      num: 3,
      time: "W/F 7:15p",
      leader: "Anna Vu",
      bus: 1,
      boardingOrder: 1,
      priorityBoarding: [
        { name: "Tim", reason: "Front bus" },
        { name: "Nguyễn Cát Hoàng Anh", reason: "Tim's cousin" },
        { name: "Nguyễn Minh Nhật", reason: "Tim's cousin (5 years old)" },
        { name: "Ben", reason: "Boards with parent" },
        { name: "Tim's mom", reason: "Adult" },
        { name: "Tim's aunt", reason: "Adult" },
        { name: "Ben's mom", reason: "Adult" },
      ],
      adults: ["Ben's mom", "Tim's mom", "Tim's aunt"],
      roster: [
        { name: "David", status: "cannot_swim", notes: "" },
        { name: "Ben", status: "can_swim", notes: "" },
        { name: "Tim", status: "beginner", notes: "Front bus" },
        { name: "Lê Minh Tâm", status: "cannot_swim", notes: "" },
        { name: "Anna", status: "beginner", notes: "" },
        { name: "Nguyễn Cát Hoàng Anh", status: "unknown", notes: "Tim's cousin" },
        { name: "Nguyễn Minh Nhật", status: "unknown", notes: "Tim's cousin (5 years old)" },
      ],
    },
    {
      num: 4,
      time: "S/S 10:00a",
      leader: "Sophia",
      bus: 1,
      boardingOrder: 2,
      priorityBoarding: [
        { name: "Jay", reason: "Seat behind driver if possible" },
        { name: "Gia Hân", reason: "Jay's sister" },
        { name: "Jay's mom", reason: "Adult" },
        { name: "Jay's dad", reason: "Adult" },
      ],
      adults: ["Jay's mom", "Jay's dad"],
      roster: [
        { name: "Nari", status: "can_swim", notes: "" },
        { name: "Ben", status: "can_swim", notes: "" },
        { name: "Alice", status: "can_swim", notes: "" },
        { name: "Lisa", status: "can_swim", notes: "" },
        { name: "Matt", status: "can_swim", notes: "" },
        { name: "Carl", status: "cannot_swim", notes: "" },
        { name: "Jay", status: "unknown", notes: "Seat behind driver if possible" },
        { name: "Minnie", status: "can_swim", notes: "" },
        { name: "Nguyễn Vũ Trà My", status: "can_swim", notes: "Lisa's cousin" },
        { name: "Vũ Nguyễn Hoàng Long", status: "can_swim", notes: "Lisa's cousin" },
        { name: "Gia Hân", status: "unknown", notes: "Jay's sister" },
      ],
    },
    {
      num: 5,
      time: "S/S 2:00p",
      leader: "Kitty",
      bus: 1,
      boardingOrder: 3,
      priorityBoarding: [],
      adults: ["Sue's dad"],
      roster: [
        { name: "Ben", status: "beginner", notes: "" },
        { name: "Sue", status: "unknown", notes: "" },
        { name: "Philip", status: "beginner", notes: "" },
        { name: "Alex", status: "can_swim", notes: "" },
        { name: "Dao Quynh Chi", status: "can_swim", notes: "Alex's sister" },
        { name: "Anna", status: "can_swim", notes: "" },
        { name: "Mint", status: "beginner", notes: "" },
        { name: "Kara", status: "beginner", notes: "" },
        { name: "Lê Ngọc Anh", status: "cannot_swim", notes: "" },
        { name: "Elsa", status: "cannot_swim", notes: "" },
      ],
    },
    {
      num: 6,
      time: "S/S 4:00p + 6:00p",
      leader: "Spring",
      bus: "split",
      boardingOrder: null,
      busSplit: {
        bus1: { order: 4, note: "Saturday/Sunday 4:00pm class" },
        bus2: { order: 3, note: "Saturday/Sunday 6:00pm class" },
      },
      priorityBoarding: [
        { name: "Fire", reason: "Motion sickness — front bus, preferably near Helen" },
      ],
      adults: [],
      roster: [
        { name: "Kitty", status: "can_swim", notes: "" },
        { name: "Dan", status: "can_swim", notes: "" },
        { name: "Anna", status: "can_swim", notes: "" },
        { name: "Julie", status: "can_swim", notes: "" },
        { name: "Kuromi", status: "can_swim", notes: "" },
        { name: "Fire", status: "can_swim", notes: "Motion sickness (Front bus, preferably near Helen)" },
        { name: "Bill", status: "can_swim", notes: "" },
        { name: "Elena", status: "can_swim", notes: "" },
        { name: "Annie", status: "can_swim", notes: "" },
        { name: "David", status: "can_swim", notes: "" },
        { name: "Peter", status: "can_swim", notes: "" },
        { name: "Rose", status: "can_swim", notes: "" },
        { name: "Mbappe", status: "unknown", notes: "6:00pm class" },
      ],
    },
  ],
};

/* ---------- Derived helpers (computed, never hand-typed) ---------- */

// All non-swimmers across every team, with home-team label — this is
// both "the non-swimmer list" and "who's with Eva during swimming."
CAMP.nonSwimmers = CAMP.teams.flatMap(t =>
  t.roster
    .map((s, i) => ({ ...s, team: t.num, teamLabel: `Team ${t.num}`, rosterIndex: i }))
    .filter(s => s.status === "cannot_swim")
);

// Every swimmer (can_swim / beginner) across every team — these are the
// students who could potentially leave the pool early and get handed to Eva.
CAMP.potentialEarlyExits = CAMP.teams.flatMap(t =>
  t.roster
    .map((s, i) => ({ ...s, team: t.num, teamLabel: `Team ${t.num}`, rosterIndex: i }))
    .filter(s => s.status === "can_swim" || s.status === "beginner")
);

// Notes that look medical (very small V1 heuristic — see TODO below).
CAMP.medicalReminders = CAMP.teams.flatMap(t =>
  t.roster
    .map((s, i) => ({ ...s, team: t.num, teamLabel: `Team ${t.num}`, rosterIndex: i }))
    .filter(s => /sick|allerg|medical|asthma|epipen/i.test(s.notes || ""))
);
// TODO (V2): there is no dedicated "behaviour flag" field in the source
// roster data yet. If/when one is added to the master project, surface it
// here as CAMP.behaviourReminders instead of leaving the section empty.

function campOverallTotals() {
  let students = 0, adults = 0;
  CAMP.teams.forEach(t => { students += t.roster.length; adults += t.adults.length; });
  const teamMembers = CAMP.teams.length + 1; // 6 leaders + Eva
  return { students, adults, teamMembers, total: students + adults + teamMembers };
}

/* ---------- Camp date ----------
   The actual date camp runs. Used so the Schedule page only highlights a
   "CURRENT ACTIVITY" when it's actually being viewed on camp day — not on
   any other day whose clock time happens to match a schedule slot.
   Format: "YYYY-MM-DD" (local date, no time component). ------------------ */
CAMP.date = "2026-08-03"; // Monday, August 3, 2026

/* ---------- Today's Schedule ----------
   Each entry: start/end in 24h "HH:MM" (end is null for a single point-in-time
   event like Check-in or Departure). `blocks` describes the card body as a
   small set of simple, generically-rendered pieces (title / activity line /
   half-group meal / shared dish list / note) so schedule.html doesn't need
   any bespoke per-entry markup.
------------------------------------------------------------------- */
CAMP.schedule = [
  {
    start: "07:30", end: null, icon: "🧑‍🏫",
    blocks: [{ type: "title", text: "Team Meeting" }],
  },
  {
    start: "07:45", end: null, icon: "📋",
    blocks: [
      { type: "title", text: "Meet & Group Your Team" },
      { type: "note", text: "Take attendance" },
    ],
  },
  {
    start: "08:00", end: null, icon: "🚌",
    blocks: [{ type: "title", text: "Bus Departs" }],
  },
  {
    start: "09:00", end: null, icon: "🕘",
    blocks: [{ type: "title", text: "CHECK-IN" }],
  },
  {
    start: "09:30", end: "11:30", icon: "🕤",
    blocks: [
      { type: "activity", text: "🌿 Trekking" },
      { type: "activity", text: "🌱 Planting Activities" },
    ],
  },
  {
    start: "11:30", end: "12:30", icon: "🍱",
    blocks: [
      { type: "title", text: "LUNCH" },
      { type: "group", label: "½ đoàn", text: "Gà kho gừng" },
      { type: "group", label: "½ đoàn", text: "Tôm rim ba rọi" },
      { type: "shared", heading: "Shared dishes", items: ["Trứng chiên hành", "Canh bầu nấu tôm", "Rau xào", "Cơm trắng", "Tráng miệng"] },
    ],
  },
  {
    start: "12:30", end: "13:30", icon: "😴",
    blocks: [
      { type: "title", text: "Rest" },
      { type: "note", text: "Nhà Cộng Đồng" },
      {
        type: "reminder",
        heading: "🏠 Rest Period",
        intro: "Only students and adults who intend to sleep or rest quietly should go to the Community House.",
        subheading: "Before going upstairs, each Team Leader should:",
        items: [
          "Ask who would like to rest.",
          "Explain that this area is for sleeping/resting only (no playing or making noise).",
          "Count the number of people from their team who will be resting.",
          "Report the final headcount to Eva.",
        ],
        note: "Eva will submit the final total to the venue.",
      },
    ],
  },
  {
    start: "13:45", end: "14:30", icon: "🥔",
    blocks: [
      { type: "title", text: "Prepare Cassava" },
      { type: "note", text: "Cooking Activity" },
      { type: "note", text: "Coconut Water" },
    ],
  },
  {
    start: "14:30", end: "15:30", icon: "🏊",
    blocks: [{ type: "title", text: "Swimming" }],
  },
  {
    start: "15:30", end: "16:00", icon: "🥔",
    blocks: [{ type: "title", text: "Steamed Cassava Snack" }],
  },
  {
    start: "16:30", end: null, icon: "🚌",
    blocks: [{ type: "title", text: "Depart Orchard Home Forest" }],
  },
];
