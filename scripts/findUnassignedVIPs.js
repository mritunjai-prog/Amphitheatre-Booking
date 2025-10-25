import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Finding unassigned VIP guests...\n");

// Read newguest.csv to get all VIP guests
const newguestPath = path.join(__dirname, "../data/newguest.csv");
const newguestContent = fs.readFileSync(newguestPath, "utf-8");
const newguestLines = newguestContent.split("\n");

const allVIPGuests = [];
let currentSection = "";

for (const line of newguestLines) {
  const trimmed = line.trim();

  if (trimmed.includes("On Stage")) {
    currentSection = "On Stage";
    continue;
  } else if (trimmed.includes("Category - A")) {
    currentSection = "Category A (VVIP)";
    continue;
  } else if (trimmed.includes("Category - B")) {
    currentSection = "Category B (VIP)";
    continue;
  }

  const parts = line.split(",");
  if (parts.length >= 2 && parts[0].match(/^\d+$/) && parts[1].trim()) {
    const name = parts[1].trim();
    // Skip staff/ADC entries
    if (!name.includes("ADC") && !name.includes("OSD") && name.length > 3) {
      allVIPGuests.push({
        serialNo: parseInt(parts[0]),
        name: name,
        designation: parts[2] || "",
        section: currentSection,
      });
    }
  }
}

console.log(`📊 Total VIP guests in newguest.csv: ${allVIPGuests.length}\n`);

// Read booked_seats.csv to see who's assigned
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const bookedContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedLines = bookedContent.split("\n");

const assignedVIPNames = new Set();

for (const line of bookedLines) {
  if (line.startsWith("VIP,")) {
    const parts = line.split(",");
    if (parts[3]) {
      assignedVIPNames.add(parts[3].toLowerCase().trim());
    }
  }
}

console.log(`📊 Assigned VIP seats: ${assignedVIPNames.size}\n`);

// Find unassigned guests
const unassignedGuests = allVIPGuests.filter((guest) => {
  return !assignedVIPNames.has(guest.name.toLowerCase().trim());
});

console.log("============================================================");
console.log(`❌ UNASSIGNED VIP GUESTS: ${unassignedGuests.length}`);
console.log("============================================================\n");

// Group by section
const onStage = unassignedGuests.filter((g) => g.section === "On Stage");
const categoryA = unassignedGuests.filter(
  (g) => g.section === "Category A (VVIP)"
);
const categoryB = unassignedGuests.filter(
  (g) => g.section === "Category B (VIP)"
);

if (onStage.length > 0) {
  console.log("🎭 ON STAGE (Not Assigned):");
  onStage.forEach((guest, index) => {
    console.log(`   ${index + 1}. ${guest.name} - ${guest.designation}`);
  });
  console.log("");
}

if (categoryA.length > 0) {
  console.log("⭐ CATEGORY A - VVIP (Not Assigned):");
  categoryA.forEach((guest, index) => {
    console.log(`   ${index + 1}. ${guest.name} - ${guest.designation}`);
  });
  console.log("");
}

if (categoryB.length > 0) {
  console.log("🌟 CATEGORY B - VIP (Not Assigned):");
  categoryB.forEach((guest, index) => {
    console.log(`   ${index + 1}. ${guest.name} - ${guest.designation}`);
  });
  console.log("");
}

// Show summary
console.log("============================================================");
console.log("📊 SUMMARY:");
console.log("============================================================");
console.log(`Total VIP Guests: ${allVIPGuests.length}`);
console.log(`Assigned: ${assignedVIPNames.size}`);
console.log(`Unassigned: ${unassignedGuests.length}`);
console.log(`   - On Stage: ${onStage.length}`);
console.log(`   - Category A (VVIP): ${categoryA.length}`);
console.log(`   - Category B (VIP): ${categoryB.length}\n`);
