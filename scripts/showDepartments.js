const fs = require("fs");
const path = require("path");

const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");

console.log("📖 Reading degree student seat assignments...\n");
const content = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = content
  .split("\n")
  .filter((l) => l.startsWith("Degree Students,"));

console.log("🎓 Department Identification Guide:\n");
console.log("Enrollment codes in the student ID tell you the department:\n");

console.log("M.Tech Departments:");
console.log("  MCE = Civil Engineering");
console.log("  MMN = Mining Engineering");
console.log("  MME = Mechanical Engineering");
console.log("  MEE = Electrical Engineering");
console.log("  MCS = Computer Science\n");

console.log("B.Tech Departments:");
console.log("  CS = Computer Science");
console.log("  EC = Electronics & Communication");
console.log("  MN = Mining Engineering");
console.log("  ME = Mechanical Engineering");
console.log("  CD = Civil Engineering\n");

console.log("MBA = Master of Business Administration");
console.log("BBA = Bachelor of Business Administration");
console.log("MCA = Master of Computer Application");
console.log("DP = Doctor of Philosophy (PhD)\n");

console.log("═".repeat(80));
console.log("\n📊 Current Seat Allocation with Departments:\n");

function getDepartment(line) {
  const parts = line.split(",");
  const seatNum = parts[1];
  const userId = parts[2];
  const name = parts[3].replace(/"/g, "");

  let dept = "Unknown";

  // Check enrollment pattern in userId
  const id = userId.toUpperCase();

  // M.Tech
  if (id.includes("MCE")) dept = "M.Tech - Civil Engineering";
  else if (id.includes("MMN")) dept = "M.Tech - Mining Engineering";
  else if (id.includes("MME")) dept = "M.Tech - Mechanical Engineering";
  else if (id.includes("MEE")) dept = "M.Tech - Electrical Engineering";
  else if (id.includes("MCS")) dept = "M.Tech - Computer Science";
  // B.Tech
  else if (id.includes("CS") && !id.includes("MCS"))
    dept = "B.Tech - Computer Science";
  else if (id.includes("EC")) dept = "B.Tech - Electronics & Communication";
  else if (id.includes("MN")) dept = "B.Tech - Mining Engineering";
  else if (id.includes("ME") && !id.includes("MME") && !id.includes("MEE"))
    dept = "B.Tech - Mechanical Engineering";
  else if (id.includes("CD")) dept = "B.Tech - Civil Engineering";
  // Others
  else if (id.includes("MBA")) dept = "MBA";
  else if (id.includes("BBA")) dept = "BBA";
  else if (id.includes("MCA")) dept = "MCA";
  else if (id.includes("DP")) dept = "PhD";

  return { seatNum, userId, name, dept };
}

// Group by department
const byDept = {};
lines.forEach((line) => {
  const info = getDepartment(line);
  if (!byDept[info.dept]) byDept[info.dept] = [];
  byDept[info.dept].push(info);
});

// Display grouped by department
const deptOrder = [
  "MBA",
  "BBA",
  "PhD",
  "M.Tech - Mining Engineering",
  "M.Tech - Civil Engineering",
  "M.Tech - Mechanical Engineering",
  "M.Tech - Electrical Engineering",
  "M.Tech - Computer Science",
  "MCA",
  "B.Tech - Mining Engineering",
  "B.Tech - Civil Engineering",
  "B.Tech - Mechanical Engineering",
  "B.Tech - Electronics & Communication",
  "B.Tech - Computer Science",
  "Unknown",
];

deptOrder.forEach((dept) => {
  if (byDept[dept]) {
    console.log(`\n${dept}: ${byDept[dept].length} students`);
    console.log(
      `  Seats: ${byDept[dept][0].seatNum} to ${
        byDept[dept][byDept[dept].length - 1].seatNum
      }`
    );
    console.log(`  First 3 students:`);
    byDept[dept].slice(0, 3).forEach((s) => {
      console.log(`    ${s.seatNum}: ${s.name} (${s.userId})`);
    });
  }
});

console.log("\n" + "═".repeat(80));
console.log(`\nTotal Degree Students: ${lines.length}`);
