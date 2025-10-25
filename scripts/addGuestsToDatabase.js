const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

// File paths
const NEW_GUEST_CSV = path.join(__dirname, "../data/newguest.csv");
const USERS_CSV = path.join(__dirname, "../data/users.csv");
const PUBLIC_USERS_CSV = path.join(__dirname, "../public/data/users.csv");

console.log("👥 Adding VIP and Guests to user database...\n");

// Read the new guest CSV
const guestData = fs.readFileSync(NEW_GUEST_CSV, "utf8");
const lines = guestData.split("\n");

const vipGuests = [];
const regularGuests = [];

let isOnStage = false;
let isCategoryA = false;
let isCategoryB = false;

lines.forEach((line) => {
  const trimmed = line.trim();

  // Detect sections
  if (trimmed.includes("On Stage")) {
    isOnStage = true;
    isCategoryA = false;
    isCategoryB = false;
    return;
  }
  if (trimmed.includes("Category - A (VVIP)")) {
    isOnStage = false;
    isCategoryA = true;
    isCategoryB = false;
    return;
  }
  if (trimmed.includes("Category - B (VIP)")) {
    isOnStage = false;
    isCategoryA = false;
    isCategoryB = true;
    return;
  }

  // Skip empty lines and headers
  if (
    !trimmed ||
    trimmed.includes("Sr. No.") ||
    trimmed.includes("Guest Name")
  ) {
    return;
  }

  // Parse line
  const parts = trimmed.split(",");
  if (parts.length < 2) return;

  const serialNo = parts[0]?.trim();
  const name = parts[1]?.trim();
  const designation = parts[2]?.trim() || "";

  // Skip if no name or just numbers
  if (!name || name === serialNo || !isNaN(name)) return;

  // Skip ADC, OSD, etc. - these are staff notes
  if (["ADC", "Principle OSD", "OSD"].includes(name)) return;

  if (name && name.length > 2) {
    const guest = {
      name: name,
      designation: designation,
      email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@vip.com`,
      phone: "N/A",
      category: isOnStage
        ? "VIP - On Stage"
        : isCategoryA
        ? "VIP - Category A"
        : isCategoryB
        ? "VIP - Category B"
        : "Guests",
    };

    if (isOnStage || isCategoryA || isCategoryB) {
      vipGuests.push(guest);
    } else {
      regularGuests.push(guest);
    }
  }
});

console.log(`✅ Found ${vipGuests.length} VIP/VVIP guests`);
console.log(`✅ Found ${regularGuests.length} regular guests`);

// Read existing users (college students)
let existingUsers = [];
if (fs.existsSync(USERS_CSV)) {
  const existingData = fs.readFileSync(USERS_CSV, "utf8");
  const parsed = Papa.parse(existingData, {
    header: true,
    skipEmptyLines: true,
  });
  existingUsers = parsed.data;
  console.log(
    `✅ Found ${existingUsers.length} existing users (college students)`
  );
}

// Create new users array
const newUsers = [...existingUsers];

// Add VIP guests with VIP IDs (VIP1, VIP2, etc.) for VIP seats
vipGuests.forEach((guest, index) => {
  newUsers.push({
    id: `VIP${index + 1}`,
    name: guest.name,
    email: guest.email,
    phone: guest.phone,
    category: "VIP",
  });
});

// ALSO add VIP guests with Guest IDs (G1, G2, etc.) for Guest seats
// This allows manual assignment to BOTH VIP seats AND Guest seats
vipGuests.forEach((guest, index) => {
  newUsers.push({
    id: `G${index + 1}`,
    name: guest.name,
    email: guest.email,
    phone: guest.phone,
    category: "Guests",
  });
});

// Add any remaining regular guests (if any)
regularGuests.forEach((guest, index) => {
  const guestId = vipGuests.length + index + 1; // Continue numbering after VIP guests
  newUsers.push({
    id: `G${guestId}`,
    name: guest.name,
    email: guest.email,
    phone: guest.phone,
    category: "Guests",
  });
});

console.log(`\n📊 Total users in database: ${newUsers.length}`);
console.log(`   - College Students: ${existingUsers.length}`);
console.log(`   - VIP/VVIP: ${vipGuests.length}`);
console.log(`   - Guests: ${regularGuests.length}`);

// Write users.csv
const usersCSV = Papa.unparse(newUsers, {
  columns: ["id", "name", "email", "phone", "category"],
  header: true,
});

fs.writeFileSync(USERS_CSV, usersCSV);
fs.writeFileSync(PUBLIC_USERS_CSV, usersCSV);

console.log("\n✅ Updated: data/users.csv");
console.log("✅ Updated: public/data/users.csv");

// Show some examples
console.log("\n📋 Sample VIP entries:");
vipGuests.slice(0, 5).forEach((g, i) => {
  console.log(`   VIP${i + 1}: ${g.name} (${g.category})`);
});

console.log("\n📋 Sample Guest entries:");
regularGuests.slice(0, 5).forEach((g, i) => {
  console.log(`   G${i + 1}: ${g.name}`);
});

console.log("\n" + "=".repeat(60));
console.log("✅ GUESTS ADDED TO DATABASE!");
console.log("=".repeat(60));
console.log("\n📝 Next steps:");
console.log("   1. Start localhost: npm run dev");
console.log("   2. Open: http://localhost:3000");
console.log("   3. Manually assign seats to VIP and Guests");
console.log("   4. The system will show them in the DataViewer");
console.log("");
