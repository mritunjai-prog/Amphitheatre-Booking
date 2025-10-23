// Analyze new requirements from user images
console.log("=== NEW REQUIREMENTS ANALYSIS ===\n");

console.log("Fixed Front Rows (from user requirements):");
console.log("  VIP (Row 1): 32 seats");
console.log("  Guests (Rows 2-3): 56 seats total");
console.log("  Faculty (Rows 4-5): 60 seats total");
console.log("  Row 6: REMOVED (0 seats)");
console.log("  Degree (Rows 7-12): 210 seats");
console.log("  Parents (Rows 13+): 368 seats");
console.log("  College (Rows ?+): 400 seats (MUST REACH THIS)\n");

// From the image, I can see the pattern is different for college
// College section appears to have more uniform/wider rows (not tapering as much)

console.log("TARGET TOTALS:");
console.log("  VIP: 32");
console.log("  Guests: 56");
console.log("  Faculty: 60");
console.log("  Degree: 210");
console.log("  Parents: 368");
console.log("  College: 400");
console.log("  TOTAL: 1126 seats\n");

console.log("STRATEGY:");
console.log(
  "  • Keep VIP/Guests/Faculty rows with ACTUAL seat counts (not 50 each)"
);
console.log("  • Degree section continues with tapering (Rows 7-12)");
console.log("  • Parents section with tapering (Rows 13-?)");
console.log(
  "  • College section with MINIMAL or NO TAPERING to reach 400 seats"
);
console.log("  • College rows should be wider/fuller (45-50 seats per row)\n");

// Calculate how many rows needed for 400 college seats if we use ~48-50 seats per row
console.log("College Section Calculation:");
console.log("  If we use 50 seats per row: 400 ÷ 50 = 8 rows needed");
console.log("  If we use 48 seats per row: 400 ÷ 48 = ~8.3 rows needed");
console.log("  If we use 45 seats per row: 400 ÷ 45 = ~8.9 rows needed\n");

console.log("Rows 13-21 for Parents (368 seats) with tapering:");
let parentSeats = 0;
let startRow = 13;
for (let i = 0; i < 9; i++) {
  const row = startRow + i;
  const rowsFromBack = 25 - row;
  const reductionPairs = Math.floor(rowsFromBack / 2);
  const seatsRemoved = reductionPairs * 2;
  const calculatedSeats = 50 - seatsRemoved;
  const seats = Math.max(
    calculatedSeats % 2 === 0 ? calculatedSeats : calculatedSeats - 1,
    10
  );
  parentSeats += seats;
  console.log(`  Row ${row}: ${seats} seats (total so far: ${parentSeats})`);
  if (parentSeats >= 368) {
    console.log(
      `  ✓ Reached 368 at Row ${row} with ${seats - (parentSeats - 368)} seats`
    );
    console.log(
      `  Remaining ${parentSeats - 368} seats start College section\n`
    );
    break;
  }
}

console.log("College Section (Rows 21-29) with MINIMAL tapering:");
console.log(
  "  Strategy: Keep rows at 48-50 seats (wider) to reach 400 total\n"
);

let collegeSeats = parentSeats > 368 ? parentSeats - 368 : 0;
let collegeStartRow = 21;

// If parents take partial row 21, college starts in same row
if (parentSeats > 368) {
  console.log(`  Row 21 (partial): ${collegeSeats} college seats`);
  collegeStartRow = 22;
}

// College needs 400 - collegeSeats more seats
const collegeNeeded = 400 - collegeSeats;
console.log(
  `  College needs ${collegeNeeded} more seats starting from Row ${collegeStartRow}`
);

// Use 50 seats per row for college (no tapering)
const fullRows = Math.floor(collegeNeeded / 50);
const remainder = collegeNeeded % 50;

console.log(
  `  Full rows (50 seats each): ${fullRows} rows = ${fullRows * 50} seats`
);
if (remainder > 0) {
  console.log(`  Partial row: ${remainder} seats`);
}
console.log(
  `  Total college rows needed: ${collegeStartRow} to ${
    collegeStartRow + fullRows + (remainder > 0 ? 1 : 0) - 1
  }\n`
);
