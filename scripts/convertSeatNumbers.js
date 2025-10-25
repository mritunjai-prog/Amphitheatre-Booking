import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔄 Converting seat numbers to new format...\n");

// Read booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const content = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = content.trim().split("\n");

const convertedLines = [];
const header = lines[0];
convertedLines.push(header);

// Conversion maps
const vipConversion = {
  // Left side: VIP-1 to VIP-13 → VIP-L13 to VIP-L1 (reversed)
  "VIP-1": "VIP-L13",
  "VIP-2": "VIP-L12",
  "VIP-3": "VIP-L11",
  "VIP-4": "VIP-L10",
  "VIP-5": "VIP-L9",
  "VIP-6": "VIP-L8",
  "VIP-7": "VIP-L7",
  "VIP-8": "VIP-L6",
  "VIP-9": "VIP-L5",
  "VIP-10": "VIP-L4",
  "VIP-11": "VIP-L3",
  "VIP-12": "VIP-L2",
  "VIP-13": "VIP-L1",
  // Right side: VIP-14 to VIP-26 → VIP-R1 to VIP-R13
  "VIP-14": "VIP-R1",
  "VIP-15": "VIP-R2",
  "VIP-16": "VIP-R3",
  "VIP-17": "VIP-R4",
  "VIP-18": "VIP-R5",
  "VIP-19": "VIP-R6",
  "VIP-20": "VIP-R7",
  "VIP-21": "VIP-R8",
  "VIP-22": "VIP-R9",
  "VIP-23": "VIP-R10",
  "VIP-24": "VIP-R11",
  "VIP-25": "VIP-R12",
  "VIP-26": "VIP-R13",
};

// Guest conversion: G1-G28 (left 14) become G-L1 to G-L14, G29-G56 (right 14) become P-R1 to P-R14
const guestConversion = {};
for (let i = 1; i <= 14; i++) {
  guestConversion[`G${i}`] = `G-L${15 - i}`; // G1 → G-L14, G14 → G-L1 (reversed)
}
for (let i = 15; i <= 28; i++) {
  guestConversion[`G${i}`] = `P-R${i - 14}`; // G15 → P-R1, G28 → P-R14
}
// G29-G56 (Row 3) are removed
for (let i = 29; i <= 56; i++) {
  guestConversion[`G${i}`] = null; // Mark for removal
}

let vipConverted = 0;
let guestConverted = 0;
let guestRemoved = 0;
let pressCreated = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();

  // Skip empty lines and comment lines
  if (!line || line.startsWith("#")) {
    convertedLines.push(line);
    continue;
  }

  const parts = line.split(",");
  if (parts.length < 2) {
    convertedLines.push(line);
    continue;
  }

  const category = parts[0];
  const seatNumber = parts[1];

  // Convert VIP seats
  if (category === "VIP" && vipConversion[seatNumber]) {
    parts[1] = vipConversion[seatNumber];
    convertedLines.push(parts.join(","));
    vipConverted++;
  }
  // Convert Guest seats
  else if (category === "Guests" && guestConversion[seatNumber] !== undefined) {
    const newSeatNumber = guestConversion[seatNumber];

    if (newSeatNumber === null) {
      // Row 3 guest - remove this entry
      console.log(`❌ Removing Row 3 Guest: ${seatNumber} - ${parts[3]}`);
      guestRemoved++;
      continue;
    } else if (newSeatNumber.startsWith("P-R")) {
      // Convert to Press category
      parts[0] = "Press";
      parts[1] = newSeatNumber;
      convertedLines.push(parts.join(","));
      pressCreated++;
    } else {
      // Regular guest
      parts[1] = newSeatNumber;
      convertedLines.push(parts.join(","));
      guestConverted++;
    }
  }
  // Keep all other rows as-is (Degree, College, Faculty, Parents)
  else {
    convertedLines.push(line);
  }
}

console.log("\n📊 Conversion Summary:");
console.log(`   - VIP seats converted: ${vipConverted}`);
console.log(`   - Guest seats converted: ${guestConverted}`);
console.log(`   - Press seats created: ${pressCreated}`);
console.log(`   - Row 3 guests removed: ${guestRemoved}\n`);

// Write back to file
const newContent = convertedLines.join("\n") + "\n";
fs.writeFileSync(bookedSeatsPath, newContent, "utf-8");

// Sync to public folder
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);
fs.writeFileSync(publicBookedSeatsPath, newContent, "utf-8");

console.log("✅ Updated: data/booked_seats.csv");
console.log("✅ Updated: public/data/booked_seats.csv\n");

console.log("============================================================");
console.log("✅ SEAT NUMBERING CONVERTED!");
console.log("============================================================\n");

console.log("📝 Next steps:");
console.log("   1. Refresh localhost (Ctrl+F5)");
console.log("   2. Verify new seat numbers:");
console.log("      - VIP: VIP-L1 to VIP-L13, VIP-R1 to VIP-R13");
console.log("      - Guests: G-L1 to G-L14");
console.log("      - Press: P-R1 to P-R14");
console.log("   3. Row 3 guests have been removed\n");
