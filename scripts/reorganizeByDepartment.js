const fs = require("fs");
const path = require("path");

const registrationPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);
const usersPath = path.join(__dirname, "../data/users.csv");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
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

  if (name && degree && enrollment) {
    registeredStudents.push({ name, enrollment, degree, phone, email });
  }
});

console.log(`✅ Found ${registeredStudents.length} registered students\n`);

// Function to extract department from enrollment number
function getDepartment(enrollment, degree) {
  const enroll = enrollment.toUpperCase();

  if (degree === "Master of Technology") {
    if (enroll.includes("MMN")) return "A_Mining";
    if (enroll.includes("MCE")) return "B_Civil";
    if (enroll.includes("MME")) return "C_Mechanical";
    if (enroll.includes("MEE")) return "D_Electrical";
    if (enroll.includes("MCS")) return "E_CS";
    return "Z_Other";
  }

  if (degree === "Bachelor of Technology") {
    if (enroll.includes("MN")) return "A_Mining";
    if (enroll.includes("CD")) return "B_Civil";
    if (enroll.includes("ME")) return "C_Mechanical";
    if (enroll.includes("EC")) return "D_Electronics";
    if (enroll.includes("CS")) return "E_CS";
    return "Z_Other";
  }

  return "Z_None";
}

// Group students
const mbaStudents = registeredStudents.filter(
  (s) => s.degree === "Master of Business Administration"
);
const bbaStudents = registeredStudents.filter(
  (s) => s.degree === "Bachelor of Business Administration"
);
const phdStudents = registeredStudents.filter(
  (s) => s.degree === "Doctor of Philosophy"
);
const mtechStudents = registeredStudents.filter(
  (s) => s.degree === "Master of Technology"
);
const mcaStudents = registeredStudents.filter(
  (s) => s.degree === "Master of Computer Application"
);
const btechStudents = registeredStudents.filter(
  (s) => s.degree === "Bachelor of Technology"
);

// Sort M.Tech by department
mtechStudents.sort((a, b) => {
  const deptA = getDepartment(a.enrollment, a.degree);
  const deptB = getDepartment(b.enrollment, b.degree);
  return deptA.localeCompare(deptB);
});

// Sort B.Tech by department
btechStudents.sort((a, b) => {
  const deptA = getDepartment(a.enrollment, a.degree);
  const deptB = getDepartment(b.enrollment, b.degree);
  return deptA.localeCompare(deptB);
});

console.log("📊 Organization Order:\n");
console.log("Group 1: School of Management");
console.log("  - MBA:", mbaStudents.length);
console.log("  - BBA:", bbaStudents.length);

console.log("\nGroup 2: School of Engineering");
console.log("  - PhD:", phdStudents.length);

console.log("  - M.Tech (by department):");
const mtechByDept = {};
mtechStudents.forEach((s) => {
  const dept = getDepartment(s.enrollment, s.degree).substring(2);
  mtechByDept[dept] = (mtechByDept[dept] || 0) + 1;
});
Object.keys(mtechByDept)
  .sort()
  .forEach((dept) => {
    console.log(`    • ${dept}: ${mtechByDept[dept]}`);
  });

console.log("  - MCA:", mcaStudents.length);

console.log("  - B.Tech (by department):");
const btechByDept = {};
btechStudents.forEach((s) => {
  const dept = getDepartment(s.enrollment, s.degree).substring(2);
  btechByDept[dept] = (btechByDept[dept] || 0) + 1;
});
Object.keys(btechByDept)
  .sort()
  .forEach((dept) => {
    console.log(`    • ${dept}: ${btechByDept[dept]}`);
  });

// Combine in order
const orderedStudents = [
  ...mbaStudents,
  ...bbaStudents,
  ...phdStudents,
  ...mtechStudents, // Now sorted by department
  ...mcaStudents,
  ...btechStudents, // Now sorted by department
];

console.log("\n📖 Reading current booked_seats.csv...");
const bookedContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedLines = bookedContent.split("\n");
const header = bookedLines[0];

// Filter out old Degree Students entries
const nonDegreeLines = bookedLines
  .slice(1)
  .filter((line) => !line.startsWith("Degree Students,"));

console.log("🔄 Creating new seat assignments with department grouping...\n");

// Helper function
function escapeCSV(value) {
  if (!value) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// First, update users.csv with degree students
console.log("💾 Updating users.csv with degree students...");
const usersContent = fs.readFileSync(usersPath, "utf-8");
const usersLines = usersContent.split("\n");
const usersHeader = usersLines[0];

// Keep non-degree students
const nonDegreeUsers = usersLines.slice(1).filter((line) => {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return !trimmed.includes(",Degree Students");
});

// Create new degree student user entries
const newDegreeUsers = [];
orderedStudents.forEach((student, index) => {
  const userId = `D${index + 1}`;
  const userLine = [
    userId,
    escapeCSV(student.name),
    escapeCSV(student.email),
    escapeCSV(student.phone),
    "Degree Students",
  ].join(",");
  newDegreeUsers.push(userLine);
});

// Combine: header + non-degree users + new degree users
const finalUsersLines = [usersHeader, ...nonDegreeUsers, ...newDegreeUsers];
const finalUsersContent = finalUsersLines.join("\n");

fs.writeFileSync(usersPath, finalUsersContent);
fs.writeFileSync(publicUsersPath, finalUsersContent);
console.log(
  `✅ Updated users.csv with ${orderedStudents.length} degree students\n`
);

// Create new degree student seat assignments
const newDegreeLines = [];
let seatCounter = 1;

orderedStudents.forEach((student, index) => {
  const seatNumber = `D${seatCounter++}`;
  const line = [
    "Degree Students",
    seatNumber,
    `D${index + 1}`,
    escapeCSV(student.name),
    escapeCSV(student.email),
    escapeCSV(student.phone),
    "",
  ].join(",");
  newDegreeLines.push(line);
});

// Combine all lines
const finalLines = [header, ...nonDegreeLines, ...newDegreeLines];
const finalContent = finalLines.join("\n");

console.log("💾 Writing updated booked_seats.csv...");
fs.writeFileSync(bookedSeatsPath, finalContent);
fs.writeFileSync(publicBookedSeatsPath, finalContent);

console.log("\n✅ Seat assignments updated with department grouping!\n");
console.log("📊 Final Seat Allocation:");
let counter = 1;
console.log(
  `  D${counter}-D${counter + mbaStudents.length - 1}: MBA (${
    mbaStudents.length
  })`
);
counter += mbaStudents.length;
console.log(
  `  D${counter}-D${counter + bbaStudents.length - 1}: BBA (${
    bbaStudents.length
  })`
);
counter += bbaStudents.length;
console.log(
  `  D${counter}-D${counter + phdStudents.length - 1}: PhD (${
    phdStudents.length
  })`
);
counter += phdStudents.length;
console.log(
  `  D${counter}-D${counter + mtechStudents.length - 1}: M.Tech - Dept wise (${
    mtechStudents.length
  })`
);
counter += mtechStudents.length;
console.log(
  `  D${counter}-D${counter + mcaStudents.length - 1}: MCA (${
    mcaStudents.length
  })`
);
counter += mcaStudents.length;
console.log(
  `  D${counter}-D${counter + btechStudents.length - 1}: B.Tech - Dept wise (${
    btechStudents.length
  })`
);

console.log(`\n  Total: D1 to D${orderedStudents.length}`);
