const fs = require("fs");
const path = require("path");

const registrationPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);

console.log("📖 Reading registration data...");
const content = fs.readFileSync(registrationPath, "utf-8");
const lines = content
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());

const students = [];

lines.forEach((line) => {
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

  if (name && degree && enrollment) {
    students.push({ name, enrollment, degree });
  }
});

console.log(`✅ Found ${students.length} students\n`);

// Function to extract department from enrollment number
function getDepartment(enrollment, degree) {
  const enroll = enrollment.toUpperCase();

  // M.Tech departments (23MCE, 23MMN, 23MME, 23MEE, 23MCS)
  if (degree === "Master of Technology") {
    if (enroll.includes("MCE")) return "Civil Engineering";
    if (enroll.includes("MMN")) return "Mining Engineering";
    if (enroll.includes("MME")) return "Mechanical Engineering";
    if (enroll.includes("MEE")) return "Electrical Engineering";
    if (enroll.includes("MCS")) return "Computer Science";
    return "Other";
  }

  // B.Tech departments (21CS, 21EC, 21MN, 21ME, 21CD)
  if (degree === "Bachelor of Technology") {
    if (enroll.includes("CS")) return "Computer Science";
    if (enroll.includes("EC")) return "Electronics & Communication";
    if (enroll.includes("MN")) return "Mining Engineering";
    if (enroll.includes("ME")) return "Mechanical Engineering";
    if (enroll.includes("CD")) return "Civil Engineering";
    return "Other";
  }

  return null;
}

// Analyze M.Tech students
const mtechStudents = students.filter(
  (s) => s.degree === "Master of Technology"
);
const mtechByDept = {};

mtechStudents.forEach((s) => {
  const dept = getDepartment(s.enrollment, s.degree);
  if (!mtechByDept[dept]) mtechByDept[dept] = [];
  mtechByDept[dept].push(s);
});

console.log("🎓 M.Tech Students by Department:\n");
Object.keys(mtechByDept)
  .sort()
  .forEach((dept) => {
    console.log(`  ${dept}: ${mtechByDept[dept].length} students`);
  });
console.log(`  Total M.Tech: ${mtechStudents.length}\n`);

// Analyze B.Tech students
const btechStudents = students.filter(
  (s) => s.degree === "Bachelor of Technology"
);
const btechByDept = {};

btechStudents.forEach((s) => {
  const dept = getDepartment(s.enrollment, s.degree);
  if (!btechByDept[dept]) btechByDept[dept] = [];
  btechByDept[dept].push(s);
});

console.log("🎓 B.Tech Students by Department:\n");
Object.keys(btechByDept)
  .sort()
  .forEach((dept) => {
    console.log(`  ${dept}: ${btechByDept[dept].length} students`);
  });
console.log(`  Total B.Tech: ${btechStudents.length}\n`);

// Show proposed order
console.log("📋 Proposed Department Order:\n");
console.log("M.Tech:");
console.log("  1. Mining Engineering");
console.log("  2. Civil Engineering");
console.log("  3. Mechanical Engineering");
console.log("  4. Electrical Engineering");
console.log("  5. Computer Science");
console.log("  6. Other\n");

console.log("B.Tech:");
console.log("  1. Mining Engineering");
console.log("  2. Civil Engineering");
console.log("  3. Mechanical Engineering");
console.log("  4. Electronics & Communication");
console.log("  5. Computer Science");
console.log("  6. Other");
