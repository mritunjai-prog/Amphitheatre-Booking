const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

// Read booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const bookedSeatsContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedSeats = Papa.parse(bookedSeatsContent, {
  header: true,
  skipEmptyLines: true,
}).data;

console.log("📖 Building users from booked_seats.csv...\n");

// Build users array from booked seats
const users = [];
const categories = {
  VIP: 0,
  Guests: 0,
  "Degree Students": 0,
  Parents: 0,
  "College Students": 0,
};

bookedSeats.forEach((seat) => {
  if (!seat.seatNumber || !seat.userName) return;

  let category = "";
  const seatNum = seat.seatNumber.toUpperCase();

  // Determine category from seat number
  if (seatNum.startsWith("VIP-")) {
    category = "VIP";
  } else if (seatNum.startsWith("G-")) {
    category = "Guests";
  } else if (seatNum.startsWith("D")) {
    category = "Degree Students";
  } else if (seatNum.startsWith("P")) {
    category = "Parents";
  } else if (seatNum.match(/^\d+$/)) {
    category = "College Students";
  } else {
    return; // Skip unknown categories
  }

  categories[category]++;

  users.push({
    id: seat.seatNumber, // Use seat number as user ID
    name: seat.userName,
    email: seat.email || "N/A",
    phone: seat.phone || "N/A",
    category: category,
  });
});

console.log("✅ Built users from booked seats:");
Object.keys(categories).forEach((cat) => {
  console.log(`   - ${cat}: ${categories[cat]}`);
});
console.log(`   - TOTAL: ${users.length}\n`);

// Generate CSV
const csv = Papa.unparse(users, {
  columns: ["id", "name", "email", "phone", "category"],
});

// Write to both locations
const dataPath = path.join(__dirname, "../data/users.csv");
const publicDataPath = path.join(__dirname, "../public/data/users.csv");

fs.writeFileSync(dataPath, csv, "utf-8");
fs.writeFileSync(publicDataPath, csv, "utf-8");

console.log("📁 Updated files:");
console.log("   - data/users.csv");
console.log("   - public/data/users.csv");
console.log("\n🎉 SUCCESS! Users CSV synchronized with booked seats.");
