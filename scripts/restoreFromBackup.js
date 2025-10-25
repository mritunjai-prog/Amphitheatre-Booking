// Convert backup CSV (old format) to new simplified format
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const backupPath = path.join(__dirname, "../data/booked_seats_backup_utf8.csv");
const dataPath = path.join(__dirname, "../data/booked_seats.csv");
const publicPath = path.join(__dirname, "../public/data/booked_seats.csv");

console.log("📝 Converting backup CSV to new format...\n");

// Read the backup file
const csvContent = fs.readFileSync(backupPath, "utf-8");

// Parse using Papa Parse
const parsed = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
});

console.log(`📊 Found ${parsed.data.length} entries\n`);

// Group entries by category
const categories = {
  VIP: [],
  Press: [],
  Guests: [],
  "Degree Students": [],
  Parents: [],
  "College Students": [],
};

parsed.data.forEach((row) => {
  const category = row.category;
  const seatNumber = row.seatNumber;
  const userName = row.userName;
  const email = row.email || "";
  const phone = row.phone || "";
  const notes = row.notes || "";

  if (!category || !seatNumber || !userName) return;

  const entry = {
    seatNumber,
    userName,
    email,
    phone,
    notes,
  };

  if (categories[category]) {
    categories[category].push(entry);
  }
});

console.log("📊 Parsed entries by category:");
let total = 0;
Object.entries(categories).forEach(([category, list]) => {
  console.log(`   - ${category}: ${list.length} entries`);
  total += list.length;
});
console.log(`   - TOTAL: ${total} entries\n`);

// Build new CSV content
const header = "seatNumber,userName,email,phone,notes";
let newCsvContent = header + "\n";

// Add each category with header
Object.entries(categories).forEach(([category, entries]) => {
  if (entries.length > 0) {
    newCsvContent += `# ${category.toUpperCase()}\n`;
    entries.forEach((entry) => {
      // Escape commas in fields
      const escapedName = entry.userName.includes(",")
        ? `"${entry.userName}"`
        : entry.userName;
      const escapedEmail = entry.email.includes(",")
        ? `"${entry.email}"`
        : entry.email;
      const escapedPhone = entry.phone.includes(",")
        ? `"${entry.phone}"`
        : entry.phone;
      const escapedNotes = entry.notes.includes(",")
        ? `"${entry.notes}"`
        : entry.notes;

      newCsvContent += `${entry.seatNumber},${escapedName},${escapedEmail},${escapedPhone},${escapedNotes}\n`;
    });
  }
});

// Write to both locations
fs.writeFileSync(dataPath, newCsvContent, "utf-8");
fs.writeFileSync(publicPath, newCsvContent, "utf-8");

console.log("✅ CSV conversion complete!\n");
console.log("📁 Updated files:");
console.log("   - data/booked_seats.csv");
console.log("   - public/data/booked_seats.csv\n");
console.log("📋 New format: seatNumber,userName,email,phone,notes");
console.log("   (Removed: category, userId columns)\n");

if (total === 800) {
  console.log("✅ SUCCESS: All 800 seats restored!\n");
} else {
  console.log(`⚠️  WARNING: Expected 800 seats but got ${total}\n`);
}
