const fs = require("fs");

const content = fs.readFileSync(
  "data/Security Pass Candidate _ Parents _ Family Member (Responses).csv",
  "utf-8"
);
const lines = content
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());

let totalPersons = 0;
let row1Count = 0;
let row2Count = 0;
let rowBothCount = 0;

console.log("\n📊 Analyzing Parents CSV Data:\n");

lines.forEach((line, index) => {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());

  const studentName = fields[0];
  const p1 = fields[2];
  const p2 = fields[3];

  const hasP1 = p1 && p1.length > 0;
  const hasP2 = p2 && p2.length > 0;

  if (hasP1) totalPersons++;
  if (hasP2) totalPersons++;

  if (hasP1 && hasP2) {
    rowBothCount++;
  } else if (hasP1) {
    row1Count++;
  } else if (hasP2) {
    row2Count++;
  }
});

console.log(`Total degree recipients: ${lines.length}`);
console.log(`Recipients with 2 accompanying persons: ${rowBothCount}`);
console.log(`Recipients with 1 accompanying person: ${row1Count}`);
console.log(
  `Recipients with 0 accompanying persons: ${
    lines.length - rowBothCount - row1Count
  }`
);
console.log(`\n✅ Total accompanying persons (seats needed): ${totalPersons}`);
