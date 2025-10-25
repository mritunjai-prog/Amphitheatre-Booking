const fs = require("fs");
const path = require("path");

const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

console.log("Reading booked_seats.csv...");
const content = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = content.split("\n");

console.log("\nUpdating seat numbers:");
console.log("  Guests: G-L → G-R (left to right)");
console.log("  Press: P-R → P-L (right to left)\n");

const updatedLines = lines.map((line) => {
  // Change Guests from G-L to G-R
  if (line.includes(",G-L")) {
    const oldSeat = line.match(/G-L\d+/)[0];
    const newLine = line.replace(/,G-L(\d+),/, ",G-R$1,");
    console.log(`  ${oldSeat} → ${newLine.match(/G-R\d+/)[0]}`);
    return newLine;
  }

  // Change Press from P-R to P-L
  if (line.includes(",P-R")) {
    const oldSeat = line.match(/P-R\d+/)[0];
    const newLine = line.replace(/,P-R(\d+),/, ",P-L$1,");
    console.log(`  ${oldSeat} → ${newLine.match(/P-L\d+/)[0]}`);
    return newLine;
  }

  return line;
});

const updatedContent = updatedLines.join("\n");

console.log("\nWriting updated files...");
fs.writeFileSync(bookedSeatsPath, updatedContent);
fs.writeFileSync(publicBookedSeatsPath, updatedContent);

console.log("✅ Seat numbers updated successfully!");
console.log("\nSummary:");
console.log("  - Guests now on right side: G-R1 to G-R14");
console.log("  - Press now on left side: P-L1 to P-L14");
