import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Analyzing Guest and VIP seat assignments...\n");

// Read booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const content = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = content.trim().split("\n");

// Parse guest and VIP assignments
const vipAssignments = [];
const guestAssignments = [];

for (const line of lines) {
  if (
    line.startsWith("#") ||
    line.startsWith("category,") ||
    line.trim() === ""
  ) {
    continue;
  }

  const [category, seatNumber, userId, userName, email, phone, notes] =
    line.split(",");

  if (category === "VIP" && seatNumber && userName) {
    vipAssignments.push({
      seatNumber,
      userId,
      userName,
      email,
      phone,
      category: "VIP",
    });
  } else if (category === "Guests" && seatNumber && userName) {
    guestAssignments.push({
      seatNumber,
      userId,
      userName,
      email,
      phone,
      category: "Guests",
    });
  }
}

console.log("📊 Summary:");
console.log(`   - VIP seats (Row 1): ${vipAssignments.length} assigned`);
console.log(
  `   - Guest seats (Rows 2-3): ${guestAssignments.length} assigned\n`
);

// Check for duplicate names
console.log("🔍 Checking for duplicate guests...\n");

const vipNames = new Map();
const guestNames = new Map();
const duplicates = [];

// Build maps
vipAssignments.forEach((v) => {
  vipNames.set(v.userName.toLowerCase().trim(), v);
});

guestAssignments.forEach((g) => {
  const nameLower = g.userName.toLowerCase().trim();
  guestNames.set(nameLower, g);

  // Check if this name exists in VIP
  if (vipNames.has(nameLower)) {
    const vipEntry = vipNames.get(nameLower);
    duplicates.push({
      name: g.userName,
      vipSeat: vipEntry.seatNumber,
      vipUserId: vipEntry.userId,
      guestSeat: g.seatNumber,
      guestUserId: g.userId,
    });
  }
});

if (duplicates.length > 0) {
  console.log(`⚠️  Found ${duplicates.length} duplicate assignments:\n`);
  duplicates.forEach((dup, index) => {
    console.log(`${index + 1}. ${dup.name}`);
    console.log(`   - VIP Seat: ${dup.vipSeat} (${dup.vipUserId})`);
    console.log(`   - Guest Seat: ${dup.guestSeat} (${dup.guestUserId})`);
    console.log("");
  });
  console.log(
    "❌ ACTION REQUIRED: Please remove one assignment for each duplicate!\n"
  );
} else {
  console.log(
    "✅ No duplicates found! Each person is assigned to only one seat.\n"
  );
}

// Generate guest list CSV
const otherDataDir = path.join(__dirname, "../other-data");
if (!fs.existsSync(otherDataDir)) {
  fs.mkdirSync(otherDataDir, { recursive: true });
}

// Combined guest list (VIP + Guests)
const allGuests = [
  ...vipAssignments.map((v) => ({ ...v, row: "Row 1 (VIP)" })),
  ...guestAssignments.map((g) => ({
    ...g,
    row:
      g.seatNumber.startsWith("G") && parseInt(g.seatNumber.slice(1)) <= 28
        ? "Row 2 (Guests)"
        : "Row 3 (Guests)",
  })),
];

// Sort by seat number
allGuests.sort((a, b) => {
  const aSeat = a.seatNumber;
  const bSeat = b.seatNumber;

  // VIP seats first
  if (aSeat.startsWith("VIP") && !bSeat.startsWith("VIP")) return -1;
  if (!aSeat.startsWith("VIP") && bSeat.startsWith("VIP")) return 1;

  // Then Guest seats
  const aNum = parseInt(aSeat.replace(/[A-Z]/g, ""));
  const bNum = parseInt(bSeat.replace(/[A-Z]/g, ""));
  return aNum - bNum;
});

// Create CSV content
let csvContent = "Seat Number,Row,Guest Name,User ID,Email,Phone\n";

allGuests.forEach((guest) => {
  csvContent += `${guest.seatNumber},${guest.row},${guest.userName},${guest.userId},${guest.email},${guest.phone}\n`;
});

const guestListPath = path.join(otherDataDir, "guest-list.csv");
fs.writeFileSync(guestListPath, csvContent, "utf-8");

console.log("✅ Created: other-data/guest-list.csv");
console.log(
  `   Total guests: ${allGuests.length} (${vipAssignments.length} VIP + ${guestAssignments.length} Guests)\n`
);

// Create separate VIP and Guest files
const vipCsvContent =
  "Seat Number,Guest Name,User ID,Email,Phone\n" +
  vipAssignments
    .map(
      (v) => `${v.seatNumber},${v.userName},${v.userId},${v.email},${v.phone}`
    )
    .join("\n") +
  "\n";

const guestCsvContent =
  "Seat Number,Guest Name,User ID,Email,Phone\n" +
  guestAssignments
    .map(
      (g) => `${g.seatNumber},${g.userName},${g.userId},${g.email},${g.phone}`
    )
    .join("\n") +
  "\n";

fs.writeFileSync(
  path.join(otherDataDir, "vip-guests-row1.csv"),
  vipCsvContent,
  "utf-8"
);
fs.writeFileSync(
  path.join(otherDataDir, "regular-guests-rows2-3.csv"),
  guestCsvContent,
  "utf-8"
);

console.log("✅ Created: other-data/vip-guests-row1.csv");
console.log("✅ Created: other-data/regular-guests-rows2-3.csv\n");

console.log("============================================================");
console.log("✅ GUEST LIST ANALYSIS COMPLETE!");
console.log("============================================================\n");

// Show preview of guest list
console.log("📋 Preview of guest list (first 10 entries):\n");
allGuests.slice(0, 10).forEach((guest, index) => {
  console.log(
    `${index + 1}. ${guest.seatNumber} (${guest.row}) - ${guest.userName}`
  );
});

if (allGuests.length > 10) {
  console.log(`   ... and ${allGuests.length - 10} more guests\n`);
}
