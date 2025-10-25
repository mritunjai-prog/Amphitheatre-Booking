// Calculate seats per row for college students
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

let total = 0;
console.log("\n📊 College Students Rows (20-27):");
for (let r = 20; r <= 27; r++) {
  const s = getSeatsPerRow(r);
  total += s;
  console.log(`Row ${r}: ${s} seats`);
}
console.log(`\nTotal college seats generated: ${total}`);
console.log(`Required college seats: 388`);
console.log(`Difference: ${total - 388}`);
