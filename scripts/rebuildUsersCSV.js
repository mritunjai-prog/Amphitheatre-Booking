const fs = require("fs");
const path = require("path");

// Read the old users.csv to extract data
const oldUsersPath = path.join(__dirname, "../data/users.csv");
const collegeStudentsPath = path.join(
  __dirname,
  "../other-data/college-students-data.csv"
);

console.log("Reading old users.csv...");
const oldContent = fs.readFileSync(oldUsersPath, "utf-8");
const oldLines = oldContent.split("\n");

// Parse old data manually to avoid CSV parsing issues
const users = [];

for (let i = 1; i < oldLines.length; i++) {
  const line = oldLines[i].trim();
  if (!line) continue;

  // Split by comma, but handle quoted values
  const parts = [];
  let current = "";
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      parts.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current.trim().replace(/^"|"$/g, ""));

  if (parts.length >= 5) {
    users.push({
      id: parts[0],
      name: parts[1],
      email: parts[2],
      phone: parts[3],
      category: parts[4],
    });
  }
}

console.log(`Parsed ${users.length} users from old file`);

// Remove college students (numeric IDs)
const nonCollegeUsers = users.filter((u) => !/^\d+$/.test(u.id));
console.log(`Kept ${nonCollegeUsers.length} non-college users`);

// Read college students data
console.log("Reading college-students-data.csv...");
const collegeContent = fs.readFileSync(collegeStudentsPath, "utf-8");
const collegeLines = collegeContent.split("\n");

const collegeStudents = [];

for (let i = 1; i < collegeLines.length; i++) {
  const line = collegeLines[i].trim();
  if (!line) continue;

  // Parse: seatNum,name,email,phone
  const parts = [];
  let current = "";
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      parts.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current.trim().replace(/^"|"$/g, ""));

  if (parts.length >= 4) {
    const seatNum = parts[0];
    const name = parts[1];
    const email = parts[2];
    const phone = parts[3];

    collegeStudents.push({
      id: seatNum,
      name: name,
      email: email,
      phone: phone,
      category: "College Students",
    });
  }
}

console.log(`Parsed ${collegeStudents.length} college students`);

// Helper function to escape CSV field
function escapeCSV(value) {
  if (!value) return "";
  const str = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Build new CSV content
const newLines = ["id,name,email,phone,category"];

// Add non-college users in order
const vipUsers = nonCollegeUsers
  .filter((u) => u.id.startsWith("VIP"))
  .sort((a, b) => {
    const numA = parseInt(a.id.replace("VIP", ""));
    const numB = parseInt(b.id.replace("VIP", ""));
    return numA - numB;
  });

const guestUsers = nonCollegeUsers
  .filter((u) => u.id.startsWith("G"))
  .sort((a, b) => {
    const numA = parseInt(a.id.replace("G", ""));
    const numB = parseInt(b.id.replace("G", ""));
    return numA - numB;
  });

const pressUsers = nonCollegeUsers
  .filter((u) => u.id.startsWith("P") && u.category === "Press")
  .sort((a, b) => {
    const numA = parseInt(a.id.replace("P", ""));
    const numB = parseInt(b.id.replace("P", ""));
    return numA - numB;
  });

const facultyUsers = nonCollegeUsers
  .filter((u) => u.id.startsWith("F"))
  .sort((a, b) => {
    const numA = parseInt(a.id.replace("F", ""));
    const numB = parseInt(b.id.replace("F", ""));
    return numA - numB;
  });

const degreeUsers = nonCollegeUsers
  .filter((u) => u.id.startsWith("D"))
  .sort((a, b) => {
    const numA = parseInt(a.id.replace("D", ""));
    const numB = parseInt(b.id.replace("D", ""));
    return numA - numB;
  });

const parentUsers = nonCollegeUsers
  .filter((u) => u.id.startsWith("P") && u.category === "Parents")
  .sort((a, b) => {
    const numA = parseInt(a.id.replace("P", ""));
    const numB = parseInt(b.id.replace("P", ""));
    return numA - numB;
  });

// Add all users
[
  ...vipUsers,
  ...guestUsers,
  ...pressUsers,
  ...facultyUsers,
  ...degreeUsers,
  ...parentUsers,
  ...collegeStudents,
].forEach((user) => {
  const line = [
    escapeCSV(user.id),
    escapeCSV(user.name),
    escapeCSV(user.email),
    escapeCSV(user.phone),
    escapeCSV(user.category),
  ].join(",");
  newLines.push(line);
});

const newContent = newLines.join("\n");

// Write to both locations
const newUsersPath = path.join(__dirname, "../data/users.csv");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");

fs.writeFileSync(newUsersPath, newContent);
fs.writeFileSync(publicUsersPath, newContent);

console.log("\n✅ Created clean users.csv");
console.log(`✅ Total users: ${newLines.length - 1}`);
console.log(`   - VIP: ${vipUsers.length}`);
console.log(`   - Guests: ${guestUsers.length}`);
console.log(`   - Press: ${pressUsers.length}`);
console.log(`   - Faculty: ${facultyUsers.length}`);
console.log(`   - Degree: ${degreeUsers.length}`);
console.log(`   - Parents: ${parentUsers.length}`);
console.log(`   - College Students: ${collegeStudents.length}`);
