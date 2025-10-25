const fs = require("fs");
const path = require("path");

const csvPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);

console.log("Reading registration data...");
const content = fs.readFileSync(csvPath, "utf-8");
const lines = content
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());

const students = [];
const degreeCount = {};

lines.forEach((line, index) => {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());

  const name = fields[2];
  const enrollment = fields[3];
  const degree = fields[4];
  const phone = fields[5];

  if (name && degree) {
    students.push({ name, enrollment, degree, phone });
    degreeCount[degree] = (degreeCount[degree] || 0) + 1;
  }
});

console.log("\n📊 Degree Distribution:\n");

// Group by school
const schoolOfManagement = [
  "Master of Business Administration",
  "Bachelor of Business Administration",
];
const schoolOfEngineering = [
  "Doctor of Philosophy",
  "Master of Technology",
  "Master of Computer Application",
  "Bachelor of Technology",
];

console.log("🏫 School of Management:");
schoolOfManagement.forEach((deg) => {
  if (degreeCount[deg]) {
    console.log(`  ${deg}: ${degreeCount[deg]} students`);
  }
});

const managementTotal = schoolOfManagement.reduce(
  (sum, deg) => sum + (degreeCount[deg] || 0),
  0
);
console.log(`  Total: ${managementTotal} students\n`);

console.log("🔬 School of Engineering:");
schoolOfEngineering.forEach((deg) => {
  if (degreeCount[deg]) {
    console.log(`  ${deg}: ${degreeCount[deg]} students`);
  }
});

const engineeringTotal = schoolOfEngineering.reduce(
  (sum, deg) => sum + (degreeCount[deg] || 0),
  0
);
console.log(`  Total: ${engineeringTotal} students\n`);

console.log(`📈 Grand Total: ${students.length} students\n`);

// Show proposed grouping
console.log("📋 Proposed Seat Allocation Order:\n");
console.log("Group 1: School of Management");
console.log("  - MBA + BBA together");
console.log(`  - Seats: D1 to D${managementTotal}\n`);

console.log("Group 2: School of Engineering");
console.log("  - PhD, M.Tech, MCA, B.Tech together");
console.log(
  `  - Seats: D${managementTotal + 1} to D${
    managementTotal + engineeringTotal
  }\n`
);
