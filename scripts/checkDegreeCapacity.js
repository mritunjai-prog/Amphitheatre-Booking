const getSeatsPerRow = (row) => {
  if (row === 1) return 26;
  if (row === 2) return 28;
  if (row === 3) return 0;
  if (row === 4) return 30;
  if (row === 5) return 30;
  if (row === 6) return 0;
  if (row >= 18 && row <= 19) return 0;
  if (row >= 25) return 50;

  const rowsFromBack = 25 - row;
  const reductionPairs = Math.floor(rowsFromBack / 2);
  const seatsRemoved = reductionPairs * 2;
  const calculatedSeats = 50 - seatsRemoved;
  return Math.max(
    calculatedSeats % 2 === 0 ? calculatedSeats : calculatedSeats - 1,
    10
  );
};

let degreeSeats = 0;
console.log("\n📊 Current Degree Student Section (Rows 7-12):\n");
for (let i = 7; i <= 12; i++) {
  const seats = getSeatsPerRow(i);
  degreeSeats += seats;
  console.log(`  Physical Row ${i} (Display Row ${i - 2}): ${seats} seats`);
}

console.log(`\n  Total Degree seats available: ${degreeSeats}`);
console.log(`  Degree students assigned: 201`);
console.log(`  Shortage: ${201 - degreeSeats} seats ❌\n`);

console.log("💡 Solution: Extend degree section to more rows\n");

// Calculate how many more rows needed
let additionalSeats = 0;
let additionalRows = 0;
let currentRow = 13;

console.log("Adding rows 13-17 (currently used by Parents):\n");
while (degreeSeats + additionalSeats < 201) {
  const seats = getSeatsPerRow(currentRow);
  additionalSeats += seats;
  additionalRows++;
  console.log(`  Row ${currentRow}: ${seats} seats`);
  currentRow++;
  if (currentRow > 17) break;
}

console.log(`\n✅ New degree section: Rows 7-${12 + additionalRows}`);
console.log(`   Total seats: ${degreeSeats + additionalSeats}`);
console.log(`   Sufficient for 201 students!`);

console.log(`\n📍 New Layout:`);
console.log(`   Rows 7-12: ${degreeSeats} seats (existing)`);
console.log(
  `   Rows 13-${12 + additionalRows}: ${additionalSeats} seats (added)`
);
console.log(`   Total: ${degreeSeats + additionalSeats} seats`);
