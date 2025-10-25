// Test to verify seat generation creates correct row assignments
const getSeatsPerRow = (row) => {
  if (row === 1) return 26;
  if (row === 2) return 28;
  if (row === 3) return 0;
  if (row === 4) return 30;
  if (row === 5) return 30;
  if (row === 6) return 0;
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

const seats = [];
let studentCounter = 1;
const maxStudents = 388;
const totalRows = 27;

// Generate college student seats
for (let row = 20; row <= totalRows; row++) {
  const seatsInThisRow = getSeatsPerRow(row);

  for (let position = 1; position <= seatsInThisRow; position++) {
    if (studentCounter <= maxStudents) {
      seats.push({
        seatNumber: `${studentCounter}`,
        row: row,
        position: position,
      });
      studentCounter++;
    }
  }
}

console.log(`\n📊 Generated ${seats.length} college student seats`);
console.log(`\n🔍 Row distribution:`);

// Count seats per row
const rowCounts = {};
seats.forEach((s) => {
  rowCounts[s.row] = (rowCounts[s.row] || 0) + 1;
});

for (let row = 20; row <= 27; row++) {
  console.log(`Row ${row}: ${rowCounts[row] || 0} seats`);
}

// Check specific seat numbers
console.log(`\n🔍 Sample seat assignments:`);
console.log(`Seat 1: Row ${seats[0].row}`);
console.log(`Seat 50: Row ${seats[49].row}`);
console.log(`Seat 100: Row ${seats[99].row}`);
console.log(`Seat 200: Row ${seats[199].row}`);
console.log(`Seat 300: Row ${seats[299].row}`);
console.log(`Seat 388: Row ${seats[387].row}`);

// Verify all seat numbers 1-388
const seatNumbers = seats.map((s) => parseInt(s.seatNumber));
const allPresent =
  seatNumbers.length === 388 &&
  Math.min(...seatNumbers) === 1 &&
  Math.max(...seatNumbers) === 388;

console.log(`\n✅ All seats 1-388: ${allPresent ? "YES" : "NO"}`);
