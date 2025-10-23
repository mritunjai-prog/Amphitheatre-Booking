// Quick analysis of what's wrong
console.log("=== ISSUE ANALYSIS ===\n");

console.log("Current Issues:");
console.log("1. VIP showing 32, should be 26");
console.log("2. College only 264 seats, need 400");
console.log("3. College starting in Row 21 (mixed with parents)");
console.log("4. Parents should END completely before college starts\n");

console.log("CORRECT REQUIREMENTS:");
console.log("  VIP: 26 seats (Row 1)");
console.log("  Guests: 56 seats (Rows 2-3)");
console.log("  Faculty: 60 seats (Rows 4-5)");
console.log("  Row 6: REMOVED");
console.log("  Degree: 210 seats (Rows 7-12)");
console.log("  Parents: 368 seats (Rows 13-?) COMPLETE FIRST");
console.log("  College: 400 seats (Rows ?-29+) START AFTER PARENTS\n");

// Calculate parents rows needed
console.log("Parents Calculation (with tapering):");
let parentSeats = 0;
let row = 13;
const getSeatsWithTaper = (r) => {
  const rowsFromBack = 25 - r;
  const reductionPairs = Math.floor(rowsFromBack / 2);
  const seatsRemoved = reductionPairs * 2;
  const calculatedSeats = 50 - seatsRemoved;
  return Math.max(
    calculatedSeats % 2 === 0 ? calculatedSeats : calculatedSeats - 1,
    10
  );
};

while (parentSeats < 368) {
  const seats = getSeatsWithTaper(row);
  parentSeats += seats;
  console.log(`  Row ${row}: ${seats} seats (total: ${parentSeats})`);
  if (parentSeats >= 368) {
    console.log(
      `  ✓ Parents END at Row ${row} (used ${parentSeats - 368} extra seats)`
    );
    break;
  }
  row++;
}

const collegeStartRow = row + 1;
console.log(`\nCollege should START at Row ${collegeStartRow}`);
console.log(`College needs 400 seats from Row ${collegeStartRow} onwards`);
console.log(`Using 50 seats per row: 400 ÷ 50 = 8 rows`);
console.log(`College Rows: ${collegeStartRow} to ${collegeStartRow + 7}\n`);

console.log("SOLUTION:");
console.log("  • Change VIP to 26 seats");
console.log("  • Parents take FULL rows 13-21 (complete all 368)");
console.log(
  `  • College starts at Row ${collegeStartRow} with 50 seats per row`
);
console.log("  • Extend to more rows if needed to reach 400 college seats");
