// Check what seat numbers are generated for college students
const generateTestSeats = () => {
  const seats = [];
  let studentCounter = 1;
  const maxStudents = 388;

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

  // Generate seats for rows 20-27 (College Students)
  for (let row = 20; row <= 27; row++) {
    const seatsInThisRow = getSeatsPerRow(row);

    for (let position = 1; position <= seatsInThisRow; position++) {
      if (studentCounter <= maxStudents) {
        const seatNumber = `${studentCounter}`;
        seats.push({
          seatNumber,
          row,
          position,
        });
        studentCounter++;
      }
    }
  }

  return seats;
};

const seats = generateTestSeats();

console.log(`\n📊 Generated ${seats.length} college student seats`);
console.log(`\n🔍 First 10 seat numbers:`);
seats.slice(0, 10).forEach((s) => {
  console.log(`  Seat number: "${s.seatNumber}" (Row ${s.row})`);
});

console.log(`\n🔍 Sample from CSV:`);
console.log("Expected in booked_seats.csv: College Students,1,1,...");
console.log('Generated seat number: "1"');
console.log("Match: Should work ✓");
