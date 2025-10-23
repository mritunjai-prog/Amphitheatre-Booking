// Calculate new requirements
console.log("=== NEW REQUIREMENTS ===\n");

console.log("Fixed Requirements:");
console.log("  VIP: 26 seats (Row 1)");
console.log("  Guests: 56 seats (Rows 2-3)");
console.log("  Faculty: 60 seats (Rows 4-5)");
console.log("  Row 6: REMOVED");
console.log("  Degree: 210 seats (Rows 7-12)");
console.log("  Parents: 290 seats (Rows 13-19) ← REDUCED");
console.log("  College: 400 seats (Rows 20-29) ← WITH TAPERING\n");

// Calculate parents rows for 290 seats
console.log("Parents Calculation (290 seats with tapering):");
let parentSeats = 0;
let row = 13;

const getSeatsWithTaper = (r) => {
  if (r === 1) return 26;
  if (r === 2 || r === 3) return 28;
  if (r === 4 || r === 5) return 30;
  if (r === 6) return 0;
  if (r >= 25) return 50;

  const rowsFromBack = 25 - r;
  const reductionPairs = Math.floor(rowsFromBack / 2);
  const seatsRemoved = reductionPairs * 2;
  const calculatedSeats = 50 - seatsRemoved;
  return Math.max(
    calculatedSeats % 2 === 0 ? calculatedSeats : calculatedSeats - 1,
    10
  );
};

while (parentSeats < 290 && row <= 21) {
  const seats = getSeatsWithTaper(row);
  const seatsToAdd = Math.min(seats, 290 - parentSeats);
  parentSeats += seatsToAdd;
  console.log(`  Row ${row}: ${seatsToAdd} seats (total: ${parentSeats})`);
  if (parentSeats >= 290) {
    console.log(`  ✓ Parents END at Row ${row}`);
    break;
  }
  row++;
}

const collegeStartRow = row + 1;
console.log(`\nCollege starts at Row ${collegeStartRow}`);
console.log("College section (with tapering for symmetry):");

let collegeSeats = 0;
for (let r = collegeStartRow; r <= 29 && collegeSeats < 400; r++) {
  const seats = getSeatsWithTaper(r);
  const seatsToAdd = Math.min(seats, 400 - collegeSeats);
  collegeSeats += seatsToAdd;
  console.log(`  Row ${r}: ${seatsToAdd} seats (total: ${collegeSeats})`);
}

console.log(`\nTotal: ${26 + 56 + 60 + 210 + 290 + collegeSeats} seats`);
