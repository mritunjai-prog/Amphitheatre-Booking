// Calculate OLD layout capacity
console.log("=== OLD LAYOUT CALCULATION ===\n");

const getSeatsPerRowOld = (row) => {
  if (row === 1) return 50; // VIP
  if (row === 2) return 50; // Guests
  if (row === 3) return 50; // Guests
  if (row === 4) return 50; // Faculty
  if (row === 5) return 50; // Faculty
  if (row === 6) return 50; // Parents (OLD LOCATION)

  // V-shape tapering
  if (row === 25) return 50;
  const rowsFromBack = 25 - row;
  const reductionPairs = Math.floor(rowsFromBack / 2);
  const seatsRemoved = reductionPairs * 2;
  const calculatedSeats = 50 - seatsRemoved;
  return Math.max(
    calculatedSeats % 2 === 0 ? calculatedSeats : calculatedSeats - 1,
    10
  );
};

let oldDegree = 0;
let oldCollege = 0;

for (let row = 7; row <= 12; row++) {
  oldDegree += getSeatsPerRowOld(row);
  console.log(`Row ${row}: ${getSeatsPerRowOld(row)} seats (Degree)`);
}

for (let row = 13; row <= 25; row++) {
  oldCollege += getSeatsPerRowOld(row);
  console.log(`Row ${row}: ${getSeatsPerRowOld(row)} seats (College)`);
}

console.log(`\nOLD Degree: ${oldDegree} seats (Rows 7-12)`);
console.log(`OLD College: ${oldCollege} seats (Rows 13-25)`);
console.log(
  `OLD Total: ${50 + 100 + 100 + 50 + oldDegree + oldCollege} seats\n`
);

console.log("=== CAPACITY ANALYSIS ===\n");
console.log("User wants:");
console.log("  • 368 Parent seats");
console.log("  • 400 College seats");
console.log("  • Total needed: 768 seats\n");

console.log("Available in Rows 13-25:");
console.log(`  • ${oldCollege} seats total\n`);

console.log("Problem:");
console.log(`  • 368 + 400 = 768 seats needed`);
console.log(`  • Only ${oldCollege} seats available in Rows 13-25`);
console.log(`  • Shortage: ${768 - oldCollege} seats\n`);

console.log("Solutions:");
console.log("  1. Extend to more rows (e.g., Row 26-27)");
console.log("  2. Increase seats per row in tapered section");
console.log("  3. Reduce one category (e.g., 368 Parents + 210 College = 578)");
