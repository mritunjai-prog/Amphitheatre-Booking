const fs = require("fs");
const path = require("path");

// File paths
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

// Read booked_seats.csv
const bookedSeatsData = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = bookedSeatsData.trim().split("\n");

console.log(`Total lines before cleanup: ${lines.length}`);

// Filter out lines that are just "number,number" format (duplicates)
const cleanedLines = lines.filter((line) => {
  // Keep header
  if (line.startsWith("category,")) return true;

  // Keep comment lines
  if (line.startsWith("#")) return true;

  // Remove lines that are ONLY "number,number" (no category prefix)
  const isBareDuplicate = /^[0-9]+,[0-9]+$/.test(line.trim());
  if (isBareDuplicate) {
    console.log(`Removing duplicate: ${line}`);
    return false;
  }

  // Keep all other lines (VIP, Guests, Degree, College with full format)
  return true;
});

console.log(`Total lines after cleanup: ${cleanedLines.length}`);

// Write cleaned data
const cleanedData = cleanedLines.join("\n") + "\n";
fs.writeFileSync(bookedSeatsPath, cleanedData);
fs.writeFileSync(publicBookedSeatsPath, cleanedData);

// Count final stats
const vipCount = cleanedLines.filter((l) => l.startsWith("VIP,")).length;
const guestCount = cleanedLines.filter((l) => l.startsWith("Guests,")).length;
const degreeCount = cleanedLines.filter((l) => l.startsWith("Degree")).length;
const collegeCount = cleanedLines.filter((l) => l.startsWith("College")).length;

console.log("\n📊 Final Statistics:");
console.log(`VIP: ${vipCount}`);
console.log(`Guests: ${guestCount}`);
console.log(`Degree: ${degreeCount}`);
console.log(`College: ${collegeCount}`);
console.log(
  `Total assigned: ${vipCount + guestCount + degreeCount + collegeCount}`
);

console.log("\n✅ Cleanup complete!");
