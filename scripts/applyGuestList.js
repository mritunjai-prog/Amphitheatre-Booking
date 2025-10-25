const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

/**
 * Guest List Manual Application Script
 *
 * This script allows you to manually apply a guest list CSV file to update bookings.
 *
 * HOW TO USE:
 * 1. Place your guest_list.csv file in the 'data' folder
 * 2. Run: node scripts/applyGuestList.js
 * 3. The script will update booked_seats.csv and users.csv
 * 4. Tickets will be regenerated automatically
 *
 * CSV FORMAT EXPECTED:
 * - name, email, phone, category (Guests, Faculty, etc.)
 * OR
 * - any format - the script will try to auto-detect columns
 */

// File paths
const GUEST_LIST_CSV = path.join(__dirname, "../data/guest_list.csv");
const BOOKED_SEATS_CSV = path.join(__dirname, "../data/booked_seats.csv");
const PUBLIC_BOOKED_SEATS_CSV = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);
const USERS_CSV = path.join(__dirname, "../data/users.csv");
const PUBLIC_USERS_CSV = path.join(__dirname, "../public/data/users.csv");

console.log("🎯 GUEST LIST APPLICATION SCRIPT");
console.log("=".repeat(60));

// Check if guest_list.csv exists
if (!fs.existsSync(GUEST_LIST_CSV)) {
  console.error("❌ ERROR: guest_list.csv not found in data folder!");
  console.log("\n📋 Please create a file at: data/guest_list.csv");
  console.log("   Expected columns: name, email, phone, category (optional)");
  process.exit(1);
}

// Read the guest list
console.log("\n📂 Reading guest_list.csv...");
const guestListData = fs.readFileSync(GUEST_LIST_CSV, "utf8");
const parsedGuestList = Papa.parse(guestListData, {
  header: true,
  skipEmptyLines: true,
});

console.log(`   Found ${parsedGuestList.data.length} entries in guest list`);

// Show the first entry to confirm format
if (parsedGuestList.data.length > 0) {
  console.log("\n📋 Sample entry (first row):");
  console.log("   ", JSON.stringify(parsedGuestList.data[0], null, 2));
}

// Auto-detect column names (case-insensitive)
function findColumn(data, possibleNames) {
  const headers = Object.keys(data);
  for (const header of headers) {
    const lowerHeader = header.toLowerCase().trim();
    for (const name of possibleNames) {
      if (lowerHeader.includes(name.toLowerCase())) {
        return header;
      }
    }
  }
  return null;
}

// Detect columns
const firstEntry = parsedGuestList.data[0] || {};
const nameCol = findColumn(firstEntry, ["name", "student", "guest", "faculty"]);
const emailCol = findColumn(firstEntry, ["email", "mail"]);
const phoneCol = findColumn(firstEntry, [
  "phone",
  "contact",
  "mobile",
  "number",
]);
const categoryCol = findColumn(firstEntry, ["category", "type", "group"]);

console.log("\n🔍 Detected columns:");
console.log(`   Name: ${nameCol || "NOT FOUND"}`);
console.log(`   Email: ${emailCol || "NOT FOUND"}`);
console.log(`   Phone: ${phoneCol || "NOT FOUND"}`);
console.log(`   Category: ${categoryCol || 'Will default to "Guests"'}`);

if (!nameCol) {
  console.error("\n❌ ERROR: Could not detect name column!");
  console.log(
    '   Please ensure your CSV has a column with "name" in the header'
  );
  process.exit(1);
}

// Ask for confirmation
console.log("\n⚠️  IMPORTANT: This will update booking data!");
console.log("   - Guest seat numbers will start from G1");
console.log("   - Faculty seat numbers will start from F1");
console.log("   - Existing degree and college students will be preserved");

// Process guest list
console.log("\n📊 Processing guest list...");

const guestsByCategory = {
  Guests: [],
  Faculty: [],
  VIP: [],
  Other: [],
};

parsedGuestList.data.forEach((row, index) => {
  const name = row[nameCol]?.trim();
  const email = emailCol ? row[emailCol]?.trim() : "";
  const phone = phoneCol ? row[phoneCol]?.trim() : "";
  const category = categoryCol ? row[categoryCol]?.trim() : "Guests";

  if (!name) {
    console.log(`   ⚠️  Skipping row ${index + 1}: No name found`);
    return;
  }

  // Normalize category
  let normalizedCategory = "Guests";
  const catLower = category.toLowerCase();
  if (
    catLower.includes("faculty") ||
    catLower.includes("teacher") ||
    catLower.includes("staff")
  ) {
    normalizedCategory = "Faculty";
  } else if (catLower.includes("vip") || catLower.includes("chief")) {
    normalizedCategory = "VIP";
  } else if (catLower.includes("guest")) {
    normalizedCategory = "Guests";
  }

  guestsByCategory[normalizedCategory].push({
    name,
    email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@guest.com`,
    phone: phone || "N/A",
    category: normalizedCategory,
  });
});

console.log("\n📈 Summary by category:");
console.log(`   VIP: ${guestsByCategory.VIP.length}`);
console.log(`   Guests: ${guestsByCategory.Guests.length}`);
console.log(`   Faculty: ${guestsByCategory.Faculty.length}`);
console.log(`   Other: ${guestsByCategory.Other.length}`);

// Read existing booked seats to preserve degree and college students
console.log("\n📂 Reading existing bookings...");
const bookedSeatsData = fs.readFileSync(BOOKED_SEATS_CSV, "utf8");
const parsedBookedSeats = Papa.parse(bookedSeatsData, {
  header: true,
  skipEmptyLines: true,
});

// Keep degree and college students
const degreeStudents = parsedBookedSeats.data.filter(
  (row) => row.category === "Degree Students"
);
const collegeStudents = parsedBookedSeats.data.filter(
  (row) => row.category === "College Students"
);
const parents = parsedBookedSeats.data.filter(
  (row) => row.category === "Parents"
);

console.log(`   Preserving ${degreeStudents.length} degree students`);
console.log(`   Preserving ${collegeStudents.length} college students`);
console.log(`   Preserving ${parents.length} parents`);

// Create new booked seats
const newBookedSeats = [];

// Add VIP (VIP-1, VIP-2, etc.)
guestsByCategory.VIP.forEach((guest, index) => {
  newBookedSeats.push({
    category: "VIP",
    seatNumber: `VIP-${index + 1}`,
    userId: `VIP-${index + 1}`,
    userName: guest.name,
    email: guest.email,
    phone: guest.phone,
    notes: "VIP Guest",
  });
});

// Add Guests (G1, G2, etc.)
guestsByCategory.Guests.forEach((guest, index) => {
  newBookedSeats.push({
    category: "Guests",
    seatNumber: `G${index + 1}`,
    userId: `G${index + 1}`,
    userName: guest.name,
    email: guest.email,
    phone: guest.phone,
    notes: "Guest",
  });
});

// Add Faculty (F1, F2, etc.)
guestsByCategory.Faculty.forEach((faculty, index) => {
  newBookedSeats.push({
    category: "Faculty",
    seatNumber: `F${index + 1}`,
    userId: `F${index + 1}`,
    userName: faculty.name,
    email: faculty.email,
    phone: faculty.phone,
    notes: "Faculty Member",
  });
});

// Add preserved categories
newBookedSeats.push(...degreeStudents);
newBookedSeats.push(...parents);
newBookedSeats.push(...collegeStudents);

console.log(`\n✅ Total bookings: ${newBookedSeats.length}`);

// Write updated booked_seats.csv
const bookedSeatsCSV = Papa.unparse(newBookedSeats, {
  columns: [
    "category",
    "seatNumber",
    "userId",
    "userName",
    "email",
    "phone",
    "notes",
  ],
});

fs.writeFileSync(BOOKED_SEATS_CSV, bookedSeatsCSV);
fs.writeFileSync(PUBLIC_BOOKED_SEATS_CSV, bookedSeatsCSV);
console.log("✅ Updated: data/booked_seats.csv");
console.log("✅ Updated: public/data/booked_seats.csv");

// Create users.csv for guests and faculty only
const usersData = [
  ...guestsByCategory.VIP.map((g, i) => ({
    id: `VIP-${i + 1}`,
    name: g.name,
    email: g.email,
    phone: g.phone,
  })),
  ...guestsByCategory.Guests.map((g, i) => ({
    id: `G${i + 1}`,
    name: g.name,
    email: g.email,
    phone: g.phone,
  })),
  ...guestsByCategory.Faculty.map((f, i) => ({
    id: `F${i + 1}`,
    name: f.name,
    email: f.email,
    phone: f.phone,
  })),
];

const usersCSV = Papa.unparse(usersData, {
  columns: ["id", "name", "email", "phone"],
});

fs.writeFileSync(USERS_CSV, usersCSV);
fs.writeFileSync(PUBLIC_USERS_CSV, usersCSV);
console.log("✅ Updated: data/users.csv");
console.log("✅ Updated: public/data/users.csv");

console.log("\n" + "=".repeat(60));
console.log("✅ GUEST LIST APPLIED SUCCESSFULLY!");
console.log("=".repeat(60));

console.log("\n📋 Next steps:");
console.log("   1. Check localhost:3000 to verify the bookings");
console.log("   2. Generate tickets: node scripts/generateTickets.js");
console.log(
  '   3. Commit changes: git add . && git commit -m "Apply guest list"'
);
console.log("   4. Deploy: git push origin main");

console.log(
  "\n💡 Tip: You can edit data/guest_list.csv and run this script again"
);
console.log("");
