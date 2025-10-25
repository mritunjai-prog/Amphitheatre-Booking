const fs = require("fs");
const path = require("path");

const registrationPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

console.log("📖 Reading registration data...");
const regContent = fs.readFileSync(registrationPath, "utf-8");
const regLines = regContent
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());

const registeredStudents = [];

regLines.forEach((line) => {
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
  const email = fields[6];

  if (name && degree) {
    registeredStudents.push({ name, enrollment, degree, phone, email });
  }
});

console.log(`✅ Found ${registeredStudents.length} registered students\n`);

// Group students by school
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

const managementStudents = registeredStudents.filter((s) =>
  schoolOfManagement.includes(s.degree)
);
const engineeringStudents = registeredStudents.filter((s) =>
  schoolOfEngineering.includes(s.degree)
);

console.log("🏫 School of Management:", managementStudents.length, "students");
console.log(
  "🔬 School of Engineering:",
  engineeringStudents.length,
  "students\n"
);

// Combine in order: Management first, then Engineering
const orderedStudents = [...managementStudents, ...engineeringStudents];

console.log("📖 Reading current booked_seats.csv...");
const bookedContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedLines = bookedContent.split("\n");
const header = bookedLines[0];

// Filter out old Degree Students entries
const nonDegreeLines = bookedLines
  .slice(1)
  .filter((line) => !line.startsWith("Degree Students,"));

console.log("🔄 Creating new seat assignments by school grouping...\n");

// Helper function to escape CSV
function escapeCSV(value) {
  if (!value) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Create new degree student seat assignments
const newDegreeLines = [];
let seatCounter = 1;

orderedStudents.forEach((student, index) => {
  const seatNumber = `D${seatCounter++}`;
  const line = [
    "Degree Students",
    seatNumber,
    `D${index + 1}`, // userId matches old format
    escapeCSV(student.name),
    escapeCSV(student.email),
    escapeCSV(student.phone),
    "", // notes
  ].join(",");
  newDegreeLines.push(line);
});

// Combine all lines: header + non-degree + new degree (ordered)
const finalLines = [header, ...nonDegreeLines, ...newDegreeLines];
const finalContent = finalLines.join("\n");

console.log("💾 Writing updated booked_seats.csv...");
fs.writeFileSync(bookedSeatsPath, finalContent);
fs.writeFileSync(publicBookedSeatsPath, finalContent);

console.log("\n✅ Seat assignments updated successfully!\n");
console.log("📊 Summary:");
console.log(
  `  Group 1 (Management): MBA + BBA = Seats D1 to D${managementStudents.length}`
);
console.log(
  `  Group 2 (Engineering): PhD + M.Tech + MCA + B.Tech = Seats D${
    managementStudents.length + 1
  } to D${orderedStudents.length}`
);
console.log(`\n  Total Degree Students: ${orderedStudents.length} students`);

// Show breakdown
console.log("\n📋 Detailed Breakdown:");
console.log("  School of Management:");
console.log(
  `    - MBA: ${
    managementStudents.filter(
      (s) => s.degree === "Master of Business Administration"
    ).length
  }`
);
console.log(
  `    - BBA: ${
    managementStudents.filter(
      (s) => s.degree === "Bachelor of Business Administration"
    ).length
  }`
);
console.log("  School of Engineering:");
console.log(
  `    - PhD: ${
    engineeringStudents.filter((s) => s.degree === "Doctor of Philosophy")
      .length
  }`
);
console.log(
  `    - M.Tech: ${
    engineeringStudents.filter((s) => s.degree === "Master of Technology")
      .length
  }`
);
console.log(
  `    - MCA: ${
    engineeringStudents.filter(
      (s) => s.degree === "Master of Computer Application"
    ).length
  }`
);
console.log(
  `    - B.Tech: ${
    engineeringStudents.filter((s) => s.degree === "Bachelor of Technology")
      .length
  }`
);
