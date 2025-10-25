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

const getDisplayRow = (physicalRow) => {
  if (physicalRow <= 2) return physicalRow;
  if (physicalRow === 3) return 3;
  if (physicalRow === 4) return 3;
  if (physicalRow === 5) return 4;
  if (physicalRow === 6) return 5;
  if (physicalRow >= 7 && physicalRow <= 12) return physicalRow - 2;
  if (physicalRow >= 13 && physicalRow <= 17) return physicalRow - 2;
  if (physicalRow >= 18 && physicalRow <= 19) return physicalRow - 2;
  if (physicalRow >= 20) return physicalRow - 4;
  return physicalRow;
};

console.log("\n🔍 Checking Row 15 Display Mapping:\n");

const maxParents = 176;
let parentsCounter = 1;

// Simulate parent seat generation
for (let row = 13; row <= 17; row++) {
  const seatsInRow = getSeatsPerRow(row);
  const displayRow = getDisplayRow(row);

  console.log(`Physical Row ${row} → Display Row ${displayRow}:`);
  console.log(`  Seats per row: ${seatsInRow}`);

  const seatsPerSide = Math.floor(seatsInRow / 2);
  console.log(`  Left side: ${seatsPerSide} seats`);
  console.log(`  Right side: ${seatsInRow - seatsPerSide} seats`);

  let leftCount = 0;
  let rightCount = 0;

  for (let position = 1; position <= seatsInRow; position++) {
    if (parentsCounter > maxParents) break;

    const section = position <= seatsPerSide ? "left" : "right";

    if (section === "left") leftCount++;
    else rightCount++;

    parentsCounter++;
  }

  console.log(
    `  ✅ Generated: ${leftCount} left + ${rightCount} right = ${
      leftCount + rightCount
    } total`
  );
  console.log(`  Parent counter now at: P${parentsCounter - 1}`);
  console.log("");
}

console.log(
  `\n📊 Total parent seats that will be generated: ${parentsCounter - 1}`
);
console.log(`Required: ${maxParents}`);
console.log(
  parentsCounter - 1 >= maxParents
    ? "✅ Sufficient!"
    : `❌ Short by ${maxParents - (parentsCounter - 1)} seats`
);
