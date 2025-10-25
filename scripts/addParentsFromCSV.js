const fs = require("fs");
const path = require("path");

// Read the parents CSV file
const parentsCSVPath = path.join(
  __dirname,
  "../data/Security Pass Candidate _ Parents _ Family Member (Responses).csv"
);
const usersPath = path.join(__dirname, "../data/users.csv");
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

console.log("Reading parents data...");
const parentsContent = fs.readFileSync(parentsCSVPath, "utf-8");
const parentsLines = parentsContent.split("\n");

// Parse parents data
const parents = [];
let parentIdCounter = 1;

for (let i = 1; i < parentsLines.length; i++) {
  const line = parentsLines[i].trim();
  if (!line) continue;

  // Parse CSV line manually to handle quoted fields
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

  const studentName = fields[0];
  const studentPhone = fields[1];
  const parent1 = fields[2];
  const parent2 = fields[3];

  // Add parent 1 if exists
  if (parent1) {
    // Clean up the name (remove relation info in parentheses)
    let cleanName = parent1
      .replace(/\([^)]*\)/g, "")
      .replace(/\/[^\/]*$/g, "")
      .trim();
    // Remove number prefixes like "1.", "2."
    cleanName = cleanName.replace(/^\d+\.\s*/, "");

    if (cleanName) {
      parents.push({
        id: `P${parentIdCounter++}`,
        name: cleanName,
        email: `parent${parentIdCounter}@family.com`,
        phone: studentPhone || "N/A",
        category: "Parents",
        relatedStudent: studentName,
      });
    }
  }

  // Add parent 2 if exists
  if (parent2) {
    let cleanName = parent2
      .replace(/\([^)]*\)/g, "")
      .replace(/\/[^\/]*$/g, "")
      .trim();
    cleanName = cleanName.replace(/^\d+\.\s*/, "");

    if (cleanName) {
      parents.push({
        id: `P${parentIdCounter++}`,
        name: cleanName,
        email: `parent${parentIdCounter}@family.com`,
        phone: studentPhone || "N/A",
        category: "Parents",
        relatedStudent: studentName,
      });
    }
  }
}

console.log(`Parsed ${parents.length} parents from CSV`);

// Read existing users.csv
console.log("Reading existing users.csv...");
const usersContent = fs.readFileSync(usersPath, "utf-8");
const usersLines = usersContent.split("\n");
const existingUsers = usersLines
  .slice(1)
  .filter((line) => line.trim())
  .map((line) => {
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

    return {
      id: parts[0],
      name: parts[1],
      email: parts[2],
      phone: parts[3],
      category: parts[4],
    };
  });

// Find existing parent IDs and get next available
const existingParentIds = existingUsers
  .filter((u) => u.id.startsWith("P") && u.category === "Parents")
  .map((u) => parseInt(u.id.replace("P", "")));

const maxParentId =
  existingParentIds.length > 0 ? Math.max(...existingParentIds) : 0;
console.log(
  `Found ${existingParentIds.length} existing parents, max ID: P${maxParentId}`
);

// Renumber new parents starting after existing ones
parents.forEach((parent, index) => {
  parent.id = `P${maxParentId + index + 1}`;
});

// Helper function to escape CSV field
function escapeCSV(value) {
  if (!value) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Add new parents to users.csv
console.log("Adding parents to users.csv...");
const newUsersLines = [usersLines[0]]; // Keep header

// Add all existing users
existingUsers.forEach((user) => {
  const line = [
    escapeCSV(user.id),
    escapeCSV(user.name),
    escapeCSV(user.email),
    escapeCSV(user.phone),
    escapeCSV(user.category),
  ].join(",");
  newUsersLines.push(line);
});

// Add new parents
parents.forEach((parent) => {
  const line = [
    escapeCSV(parent.id),
    escapeCSV(parent.name),
    escapeCSV(parent.email),
    escapeCSV(parent.phone),
    escapeCSV(parent.category),
  ].join(",");
  newUsersLines.push(line);
});

const newUsersContent = newUsersLines.join("\n");
fs.writeFileSync(usersPath, newUsersContent);
fs.writeFileSync(publicUsersPath, newUsersContent);

console.log(`✅ Added ${parents.length} parents to users.csv`);
console.log(`✅ Total users now: ${existingUsers.length + parents.length}`);

// Now assign seats to parents
console.log("\nAssigning seats to parents...");
const bookedSeatsContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedSeatsLines = bookedSeatsContent.split("\n");

// Find existing parent seat numbers
const existingParentSeats = bookedSeatsLines
  .filter((line) => line.startsWith("Parents,"))
  .map((line) => {
    const match = line.match(/^Parents,P(\d+),/);
    return match ? parseInt(match[1]) : 0;
  })
  .filter((num) => num > 0);

const maxParentSeat =
  existingParentSeats.length > 0 ? Math.max(...existingParentSeats) : 0;
console.log(
  `Found ${existingParentSeats.length} existing parent seat assignments, max seat: P${maxParentSeat}`
);

// Create new seat assignments
const newSeatAssignments = [];
parents.forEach((parent, index) => {
  const seatNumber = `P${maxParentSeat + index + 1}`;
  const line = [
    "Parents",
    seatNumber,
    parent.id,
    escapeCSV(parent.name),
    escapeCSV(parent.email),
    escapeCSV(parent.phone),
    escapeCSV(`Related to ${parent.relatedStudent}`),
  ].join(",");
  newSeatAssignments.push(line);
});

// Add to booked_seats.csv
const updatedBookedSeats =
  bookedSeatsContent.trim() + "\n" + newSeatAssignments.join("\n");
fs.writeFileSync(bookedSeatsPath, updatedBookedSeats);
fs.writeFileSync(publicBookedSeatsPath, updatedBookedSeats);

console.log(
  `✅ Added ${newSeatAssignments.length} parent seat assignments to booked_seats.csv`
);
console.log(`\n📊 Summary:`);
console.log(`   - New parents added: ${parents.length}`);
console.log(
  `   - Seat numbers: P${maxParentSeat + 1} to P${
    maxParentSeat + parents.length
  }`
);
console.log(
  `   - Total booked seats: ${bookedSeatsLines.length - 1 + parents.length}`
);
