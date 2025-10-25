// Convert entire booked_seats.csv to new simplified format
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const dataPath = path.join(__dirname, "../data/booked_seats.csv");
const publicPath = path.join(__dirname, "../public/data/booked_seats.csv");

console.log("📝 Converting CSV to new format...\n");

// Read current CSV
const csvContent = fs.readFileSync(dataPath, "utf-8");
const lines = csvContent
  .split("\n")
  .filter((line) => line.trim() && !line.startsWith("#"));

console.log(`📊 Found ${lines.length - 1} data lines (excluding header)\n`);

// Detect format: Check if first data line has 5 or 7 columns
const firstDataLine = lines[1];
const columnCount = firstDataLine.split(",").length;
const isOldFormat = columnCount >= 7;

console.log(
  `📋 Detected format: ${isOldFormat ? "OLD (7 columns)" : "NEW (5 columns)"}\n`
);

// Parse all lines manually to handle mixed formats
const entries = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const parts = line.split(",");

  let seatNumber, userName, email, phone, notes;

  if (parts.length >= 7) {
    // Old format: category,seatNumber,userId,userName,email,phone,notes
    seatNumber = parts[2]; // userId is actually the seat number
    userName = parts[3];
    email = parts[4];
    phone = parts[5];
    notes = parts.slice(6).join(","); // Handle commas in notes
  } else if (parts.length >= 5) {
    // New format: seatNumber,userName,email,phone,notes
    seatNumber = parts[0];
    userName = parts[1];
    email = parts[2];
    phone = parts[3];
    notes = parts.slice(4).join(","); // Handle commas in notes
  } else {
    continue; // Skip invalid lines
  }

  if (!seatNumber || !userName) continue;

  entries.push({ seatNumber, userName, email, phone, notes });
}

console.log(`✅ Parsed ${entries.length} total entries\n`);

// Group by category
let categoryGroups = {
  VIP: [],
  Guests: [],
  "Degree Students": [],
  Parents: [],
  "College Students": [],
};

entries.forEach((entry) => {
  const seatNumber = entry.seatNumber;

  let category;
  if (seatNumber.startsWith("VIP-")) category = "VIP";
  else if (seatNumber.startsWith("G-")) category = "Guests";
  else if (seatNumber.startsWith("D")) category = "Degree Students";
  else if (seatNumber.startsWith("P")) category = "Parents";
  else if (seatNumber.match(/^\d+$/)) category = "College Students";
  else {
    console.log(`⚠️  Unknown seat format: ${seatNumber}`);
    return;
  }

  categoryGroups[category].push(entry);
});

// New header (simplified format)
const newHeader = "seatNumber,userName,email,phone,notes";

// Build new CSV content with category sections
let csvContent2 = newHeader + "\n";

// Add each category with header
Object.entries(categoryGroups).forEach(([category, entries]) => {
  if (entries.length > 0) {
    csvContent2 += `# ${category.toUpperCase()}\n`;
    entries.forEach((entry) => {
      csvContent2 += `${entry.seatNumber},${entry.userName},${entry.email},${entry.phone},${entry.notes}\n`;
    });
  }
});

// Write to both locations
fs.writeFileSync(dataPath, csvContent2, "utf-8");
fs.writeFileSync(publicPath, csvContent2, "utf-8");

console.log("✅ CSV conversion complete!\n");
console.log("📊 Converted entries by category:");
Object.entries(categoryGroups).forEach(([category, entries]) => {
  if (entries.length > 0) {
    console.log(`   - ${category}: ${entries.length} entries`);
  }
});

const total = Object.values(categoryGroups).reduce(
  (sum, arr) => sum + arr.length,
  0
);
console.log(`   - TOTAL: ${total} entries\n`);

console.log("✅ Updated files:");
console.log("   - data/booked_seats.csv");
console.log("   - public/data/booked_seats.csv\n");
console.log("📋 New format: seatNumber,userName,email,phone,notes");
console.log("   (Removed: category, userId columns)\n");
