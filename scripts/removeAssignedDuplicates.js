import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔄 Removing alternate IDs for assigned guests...\n");

// Read booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const bookedContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedLines = bookedContent.trim().split("\n");

// Parse assigned users
const assignedUserIds = new Set();
const assignedNames = new Map(); // Track which ID was assigned for each name

for (const line of bookedLines) {
  if (
    line.startsWith("#") ||
    line.startsWith("category,") ||
    line.trim() === ""
  ) {
    continue;
  }

  const [category, seatNumber, userId, userName] = line.split(",");

  if (userId && userName) {
    assignedUserIds.add(userId);
    const nameLower = userName.toLowerCase().trim();
    assignedNames.set(nameLower, userId);
  }
}

console.log(`📊 Found ${assignedUserIds.size} assigned users\n`);

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

console.log(`📊 Total users before cleanup: ${users.length}\n`);

// Remove alternate IDs for assigned users
const cleanedUsers = [];
const removedUsers = [];

for (const user of users) {
  const nameLower = user.name.toLowerCase().trim();

  // Check if this person is assigned
  const assignedId = assignedNames.get(nameLower);

  if (assignedId) {
    // This person is assigned
    if (user.id === assignedId) {
      // Keep the ID that was assigned
      cleanedUsers.push(user);
    } else {
      // Remove the alternate ID
      removedUsers.push(user);
      console.log(
        `❌ Removing alternate ID: ${user.id} (${user.name}) - Already assigned as ${assignedId}`
      );
    }
  } else {
    // Not assigned yet, keep both IDs
    cleanedUsers.push(user);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   - Users before: ${users.length}`);
console.log(`   - Users after: ${cleanedUsers.length}`);
console.log(`   - Removed: ${removedUsers.length}\n`);

// Write back to file
const newContent =
  [header, ...cleanedUsers.map((u) => u.line)].join("\n") + "\n";

fs.writeFileSync(usersPath, newContent, "utf-8");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
fs.writeFileSync(publicUsersPath, newContent, "utf-8");

console.log("✅ Updated: data/users.csv");
console.log("✅ Updated: public/data/users.csv\n");

console.log("============================================================");
console.log("✅ DUPLICATE IDs REMOVED FOR ASSIGNED USERS!");
console.log("============================================================\n");

console.log("📝 Next steps:");
console.log("   1. Refresh localhost (Ctrl+F5)");
console.log("   2. Assigned users will only appear in their assigned category");
console.log("   3. Unassigned users still have both VIP and Guest IDs\n");
