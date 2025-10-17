// Add Seat Number Column to users.csv
const fs = require("fs");
const path = require("path");

console.log("\n🔄 Adding seat number column to users.csv...\n");

// Read booked_seats.csv to get seat assignments
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const bookedSeatsContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedSeatsLines = bookedSeatsContent.split("\n").slice(1); // Skip header

// Create a map of userId to seatNumber
const seatMap = {};
bookedSeatsLines.forEach((line) => {
  if (!line.trim()) return;

  const match = line.match(
    /"([^"]+)","([^"]+)",(\d+),"([^"]+)","([^"]+)","([^"]+)","([^"]*)"/
  );
  if (match) {
    const [, category, seatNumber, userId] = match;
    seatMap[userId] = seatNumber;
  }
});

console.log(`📊 Found ${Object.keys(seatMap).length} seat assignments\n`);

// Read users.csv
const usersPath = path.join(__dirname, "../data/users.csv");
const usersContent = fs.readFileSync(usersPath, "utf-8");
const usersLines = usersContent.split("\n");

// Process users.csv
const updatedLines = [];

// Update header
const header = usersLines[0];
const newHeader = header.replace("id,name,", "id,name,seatNumber,");
updatedLines.push(newHeader);

// Update each user row
for (let i = 1; i < usersLines.length; i++) {
  const line = usersLines[i];
  if (!line.trim()) {
    updatedLines.push(line);
    continue;
  }

  const parts = line.split(",");
  const userId = parts[0];
  const name = parts[1];
  const seatNumber = seatMap[userId] || "";

  // Reconstruct line with seat number after name
  const restOfLine = parts.slice(2).join(",");
  const newLine = `${userId},${name},${seatNumber},${restOfLine}`;
  updatedLines.push(newLine);
}

// Write updated users.csv
fs.writeFileSync(usersPath, updatedLines.join("\n"));

console.log("✅ Successfully added seat number column to users.csv");
console.log("📍 Column added after name column\n");

// Show sample of first 5 entries
console.log("📋 Sample entries:");
console.log(updatedLines.slice(0, 6).join("\n"));
console.log("\n✨ Done!\n");
