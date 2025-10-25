import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🧹 Cleaning duplicate VIP and Guest entries...\n");

// Read users.csv
const usersPath = path.join(__dirname, "../data/users.csv");
const usersContent = fs.readFileSync(usersPath, "utf-8");
const lines = usersContent.trim().split("\n");
const header = lines[0];
const userLines = lines.slice(1);

// Parse users
const users = userLines.map((line) => {
  const [id, name, email, phone, category] = line.split(",");
  return { id, name, email, phone, category, line };
});

// Separate by type
const collegeStudents = users.filter((u) => /^[0-9]+$/.test(u.id));
const degreeStudents = users.filter((u) => /^D[0-9]+$/.test(u.id));
const vipUsers = users.filter((u) => /^VIP[0-9]+$/.test(u.id));
const guestUsers = users.filter((u) => /^G[0-9]+$/.test(u.id));

console.log(`✅ Found ${collegeStudents.length} college students`);
console.log(`✅ Found ${degreeStudents.length} degree students`);
console.log(`✅ Found ${vipUsers.length} VIP entries (expecting 48)`);
console.log(`✅ Found ${guestUsers.length} Guest entries (expecting 48)\n`);

// Remove duplicates - keep only unique IDs
const uniqueVIP = [];
const seenVIPIds = new Set();
for (const user of vipUsers) {
  if (!seenVIPIds.has(user.id)) {
    seenVIPIds.add(user.id);
    uniqueVIP.push(user);
  }
}

const uniqueGuest = [];
const seenGuestIds = new Set();
for (const user of guestUsers) {
  if (!seenGuestIds.has(user.id)) {
    seenGuestIds.add(user.id);
    uniqueGuest.push(user);
  }
}

console.log(`🧹 After deduplication:`);
console.log(`   - VIP entries: ${uniqueVIP.length}`);
console.log(`   - Guest entries: ${uniqueGuest.length}\n`);

// Rebuild users array
const cleanUsers = [
  ...collegeStudents,
  ...degreeStudents,
  ...uniqueVIP,
  ...uniqueGuest,
];

// Write back to file
const newContent = [header, ...cleanUsers.map((u) => u.line)].join("\n") + "\n";

fs.writeFileSync(usersPath, newContent, "utf-8");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
fs.writeFileSync(publicUsersPath, newContent, "utf-8");

console.log(`📊 Total users in clean database: ${cleanUsers.length}`);
console.log(`   - College Students: ${collegeStudents.length}`);
console.log(`   - Degree Students: ${degreeStudents.length}`);
console.log(`   - VIP: ${uniqueVIP.length}`);
console.log(`   - Guests: ${uniqueGuest.length}\n`);

console.log(`✅ Updated: data/users.csv`);
console.log(`✅ Updated: public/data/users.csv\n`);

console.log("============================================================");
console.log("✅ DUPLICATES CLEANED!");
console.log("============================================================\n");
