// Quick verification script to display seat assignments by degree
const fs = require("fs");
const path = require("path");

const csvPath = path.join(__dirname, "../data/booked_seats.csv");
const csvContent = fs.readFileSync(csvPath, "utf-8");
const lines = csvContent.split("\n").slice(1); // Skip header

const byDegree = {
  "M.Tech": [],
  MCA: [],
  "B.Tech": [],
  MBA: [],
  PhD: [],
  BBA: [],
};

lines.forEach((line) => {
  if (!line.trim()) return;

  const match = line.match(
    /"([^"]+)","([^"]+)",(\d+),"([^"]+)","([^"]+)","([^"]+)","([^"]+)"/
  );
  if (match) {
    const [, category, seatNumber, userId, userName, email, phone, notes] =
      match;
    const degree = notes.split(" - ")[0];
    if (byDegree[degree]) {
      byDegree[degree].push({ seatNumber, userName, notes });
    }
  }
});

console.log(
  "\n╔════════════════════════════════════════════════════════════════╗"
);
console.log(
  "║     DEGREE STUDENTS SEAT ASSIGNMENT VERIFICATION              ║"
);
console.log(
  "╚════════════════════════════════════════════════════════════════╝\n"
);

let totalAssigned = 0;

Object.keys(byDegree).forEach((degree) => {
  const students = byDegree[degree];
  if (students.length > 0) {
    console.log(`\n📚 ${degree} - ${students.length} students`);
    console.log("─".repeat(70));

    students.slice(0, 3).forEach((s) => {
      console.log(
        `   ${s.seatNumber.padEnd(6)} │ ${s.userName.padEnd(35)} │ ${
          s.notes.split(" - ")[1]
        }`
      );
    });

    if (students.length > 6) {
      console.log(`   ${"...".padEnd(6)} │ ${"...".padEnd(35)} │ ...`);
    }

    students.slice(-3).forEach((s) => {
      console.log(
        `   ${s.seatNumber.padEnd(6)} │ ${s.userName.padEnd(35)} │ ${
          s.notes.split(" - ")[1]
        }`
      );
    });

    totalAssigned += students.length;
  }
});

console.log("\n" + "═".repeat(70));
console.log(
  `✅ TOTAL STUDENTS ASSIGNED: ${totalAssigned} (Seats D1 to D${totalAssigned})`
);
console.log("═".repeat(70) + "\n");
