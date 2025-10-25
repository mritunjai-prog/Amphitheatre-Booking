const fs = require("fs");
const path = require("path");

// Fix users.csv column order for college students
const usersPath = path.join(__dirname, "../data/users.csv");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");

console.log("Reading users.csv...");
const usersContent = fs.readFileSync(usersPath, "utf-8");
const lines = usersContent.split("\n");

const header = lines[0]; // id,name,email,phone,category
console.log("Header:", header);

const fixedLines = [header];
let fixedCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const parts = line.split(",");
  const id = parts[0];

  // Check if this is a college student (numeric ID)
  if (/^\d+$/.test(id)) {
    // Current format: id,name,category,email,phone
    // Need format: id,name,email,phone,category
    const name = parts[1];
    const category = parts[2]; // Currently has "College Students"
    const email = parts[3];
    const phone = parts[4];

    // Reorder to: id,name,email,phone,category
    const fixedLine = `${id},${name},${email},${phone},${category}`;
    fixedLines.push(fixedLine);
    fixedCount++;
  } else {
    // Non-college student, keep as-is
    fixedLines.push(line);
  }
}

console.log(`Fixed ${fixedCount} college student entries`);

const newContent = fixedLines.join("\n");
fs.writeFileSync(usersPath, newContent);
fs.writeFileSync(publicUsersPath, newContent);

console.log("✅ Fixed column order in users.csv");
console.log(`✅ Total lines: ${fixedLines.length}`);
