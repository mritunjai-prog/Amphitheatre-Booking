const fs = require("fs");
const path = require("path");

const registrationPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");

console.log("📖 Reading registration and seat data...\n");

// Read registration data
const regContent = fs.readFileSync(registrationPath, "utf-8");
const regLines = regContent
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());

const studentMap = {};

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

  if (name && enrollment && degree) {
    studentMap[name.toLowerCase()] = { enrollment, degree };
  }
});

// Read booked seats
const seatsContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const seatLines = seatsContent
  .split("\n")
  .filter((l) => l.startsWith("Degree Students,"));

console.log("🎓 DEPARTMENT IDENTIFICATION GUIDE:\n");
console.log("Look at the ENROLLMENT NUMBER to identify department:\n");

console.log("MBA Programs:");
console.log("  23MBA_____ or 22MBA_____ = MBA\n");

console.log("BBA Programs:");
console.log("  22BBA_____ or 23L3BBA___ = BBA\n");

console.log("M.Tech Departments:");
console.log("  23MCE_____ = Civil Engineering");
console.log("  23MMN_____ = Mining Engineering");
console.log("  23MME_____ = Mechanical Engineering");
console.log("  23MEE_____ = Electrical Engineering");
console.log("  23MCS_____ = Computer Science\n");

console.log("B.Tech Departments:");
console.log("  21CS______ or 22L3CS____ = Computer Science");
console.log("  21EC______ = Electronics & Communication");
console.log("  21MN______ or 23L5MN____ = Mining Engineering");
console.log("  21ME______ or 22L3ME____ = Mechanical Engineering");
console.log("  21CD______ = Civil Engineering\n");

console.log("Other Programs:");
console.log("  23MCA_____ = MCA");
console.log("  __DP______ (18DP, 19DP, 20DP, 21DP) = PhD\n");

console.log("═".repeat(80));
console.log("\n📋 YOUR SEAT ASSIGNMENTS WITH DEPARTMENTS:\n");

// Process each seat
const assignments = seatLines
  .map((line) => {
    const parts = line.split(",");
    const seatNum = parts[1];
    const name = parts[3].replace(/"/g, "");

    const studentInfo = studentMap[name.toLowerCase()];

    if (studentInfo) {
      const enrollment = studentInfo.enrollment;
      const degree = studentInfo.degree;

      let dept = "Unknown";
      const enroll = enrollment.toUpperCase();

      // Identify department
      if (enroll.includes("MBA")) dept = "MBA";
      else if (enroll.includes("BBA")) dept = "BBA";
      else if (enroll.includes("DP")) dept = "PhD";
      else if (enroll.includes("MCA")) dept = "MCA";
      else if (enroll.includes("MCE")) dept = "M.Tech Civil";
      else if (enroll.includes("MMN")) dept = "M.Tech Mining";
      else if (enroll.includes("MME")) dept = "M.Tech Mechanical";
      else if (enroll.includes("MEE")) dept = "M.Tech Electrical";
      else if (enroll.includes("MCS")) dept = "M.Tech CS";
      else if (enroll.includes("CS")) dept = "B.Tech CS";
      else if (enroll.includes("EC")) dept = "B.Tech EC";
      else if (enroll.includes("MN")) dept = "B.Tech Mining";
      else if (enroll.includes("ME")) dept = "B.Tech Mechanical";
      else if (enroll.includes("CD")) dept = "B.Tech Civil";

      return { seatNum, name, enrollment, dept };
    }

    return null;
  })
  .filter((a) => a !== null);

// Group by department
const byDept = {};
assignments.forEach((a) => {
  if (!byDept[a.dept]) byDept[a.dept] = [];
  byDept[a.dept].push(a);
});

// Display by department
const deptOrder = [
  "MBA",
  "BBA",
  "PhD",
  "M.Tech Mining",
  "M.Tech Civil",
  "M.Tech Mechanical",
  "M.Tech Electrical",
  "M.Tech CS",
  "MCA",
  "B.Tech Mining",
  "B.Tech Civil",
  "B.Tech Mechanical",
  "B.Tech EC",
  "B.Tech CS",
];

deptOrder.forEach((dept) => {
  if (byDept[dept] && byDept[dept].length > 0) {
    console.log(`\n${dept}: ${byDept[dept].length} students`);
    console.log(
      `  Seats: ${byDept[dept][0].seatNum} to ${
        byDept[dept][byDept[dept].length - 1].seatNum
      }`
    );
    console.log(`  Sample students:`);
    byDept[dept].slice(0, 3).forEach((s) => {
      console.log(`    ${s.seatNum}: ${s.name} (${s.enrollment})`);
    });
  }
});

console.log("\n" + "═".repeat(80));
console.log(
  `\n✅ Total: ${assignments.length} degree students organized by department`
);
console.log(
  "\nTo identify a student's department: Look at their enrollment number!"
);
