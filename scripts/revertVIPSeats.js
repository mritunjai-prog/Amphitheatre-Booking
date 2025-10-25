const fs = require("fs");
const path = require("path");

const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

console.log("🔄 Reverting VIP seat assignments to alternating pattern...\n");

// Read the CSV
let content = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = content.split("\n");

// Get VIP seats
const vipSeats = [];
const nonVipLines = [];
const header = lines[0];

for (let i = 1; i < lines.length; i++) {
  if (lines[i].includes("VIP,")) {
    const parts = lines[i].split(",");
    vipSeats.push({
      line: lines[i],
      userId: parts[2],
      userName: parts[3],
      email: parts[4],
      phone: parts[5],
    });
  } else {
    nonVipLines.push(lines[i]);
  }
}

console.log(`Found ${vipSeats.length} VIP seats to reorder\n`);

// Reorder VIP seats to alternating pattern (L1, R1, L2, R2, ...)
const reorderedVipLines = [];
for (let i = 0; i < vipSeats.length; i++) {
  const vipNumber = Math.floor(i / 2) + 1;
  const seatNumber = i % 2 === 0 ? `VIP-L${vipNumber}` : `VIP-R${vipNumber}`;

  const seat = vipSeats[i];
  const newLine = `VIP,${seatNumber},${seat.userId},${seat.userName},${seat.email},${seat.phone}`;
  reorderedVipLines.push(newLine);

  console.log(`  ${i + 1}. ${seatNumber} - ${seat.userName}`);
}

// Reconstruct the CSV
const newLines = [header, ...reorderedVipLines, ...nonVipLines];
const newContent = newLines.join("\n");

// Write to both locations
fs.writeFileSync(bookedSeatsPath, newContent);
fs.writeFileSync(publicBookedSeatsPath, newContent);

console.log(
  "\n✅ VIP seats reverted to alternating pattern (L1, R1, L2, R2, ...)"
);
console.log(
  "✅ Updated both data/booked_seats.csv and public/data/booked_seats.csv\n"
);
