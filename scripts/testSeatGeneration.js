// Test script to verify seat generation logic
const generateSeatsTest = () => {
  const seats = [];

  let studentCounter = 1;
  const maxStudents = 388;
  const totalRows = 27;

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

  // Generate only college student seats (rows 20-27)
  for (let row = 20; row <= totalRows; row++) {
    const seatsInThisRow = getSeatsPerRow(row);

    for (let position = 1; position <= seatsInThisRow; position++) {
      if (studentCounter <= maxStudents) {
        seats.push({
          seatNumber: `${studentCounter}`,
          row,
          position,
        });
        studentCounter++;
      }
    }
  }

  return seats;
};

const collegeSeats = generateSeatsTest();

console.log(`\n✅ Generated ${collegeSeats.length} college student seats`);
console.log(
  `First seat: ${collegeSeats[0].seatNumber} (Row ${collegeSeats[0].row})`
);
console.log(
  `Last seat: ${collegeSeats[collegeSeats.length - 1].seatNumber} (Row ${
    collegeSeats[collegeSeats.length - 1].row
  })`
);

// Check if all seat numbers 1-388 are present
const seatNumbers = new Set(collegeSeats.map((s) => parseInt(s.seatNumber)));
const missingSeatNumbers = [];
for (let i = 1; i <= 388; i++) {
  if (!seatNumbers.has(i)) {
    missingSeatNumbers.push(i);
  }
}

if (missingSeatNumbers.length > 0) {
  console.log(`\n⚠️ Missing seat numbers: ${missingSeatNumbers.join(", ")}`);
} else {
  console.log("\n✅ All seat numbers 1-388 are generated!");
}
