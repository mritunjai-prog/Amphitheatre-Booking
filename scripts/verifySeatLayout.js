const fs = require("fs");
const path = require("path");

// Function to calculate seats per row - Fixed front rows + V-shape tapering + Full college section
const getSeatsPerRow = (row) => {
  // Fixed seats for front rows (actual capacity)
  if (row === 1) return 26; // VIP: 26 seats
  if (row === 2) return 28; // Guests: 28 seats
  if (row === 3) return 28; // Guests: 28 seats
  if (row === 4) return 30; // Faculty: 30 seats
  if (row === 5) return 30; // Faculty: 30 seats
  if (row === 6) return 0; // Row 6 REMOVED

  // College section (Rows 22-29): NO TAPERING - all 50 seats
  if (row >= 22) return 50;

  // V-shape tapering for Degree + Parents sections (rows 7-21)
  if (row === 21) return 46;
  if (row === 20) return 46;

  const rowsFromBack = 21 - row;
  const reductionPairs = Math.floor(rowsFromBack / 2);
  const seatsRemoved = reductionPairs * 2;
  const calculatedSeats = 46 - seatsRemoved;
  return Math.max(
    calculatedSeats % 2 === 0 ? calculatedSeats : calculatedSeats - 1,
    10
  );
};

console.log("\n=== NEW SEATING LAYOUT VERIFICATION ===\n");
console.log("Seat Distribution per Row:\n");

let vipCount = 0;
let guestCount = 0;
let facultyCount = 0;
let degreeCount = 0;
let parentCount = 0;
let collegeCount = 0;
let totalSeats = 0;

// Row-by-row breakdown
for (let row = 1; row <= 29; row++) {
  const seatsInRow = getSeatsPerRow(row);
  let category = "";
  let counter = 0;

  if (row === 1) {
    category = "VIP";
    counter = seatsInRow;
    vipCount += counter;
  } else if (row >= 2 && row <= 3) {
    category = "Guests";
    counter = seatsInRow;
    guestCount += counter;
  } else if (row >= 4 && row <= 5) {
    category = "Faculty";
    counter = seatsInRow;
    facultyCount += counter;
  } else if (row === 6) {
    category = "REMOVED (Row 6 skipped)";
    counter = 0; // Row 6 completely skipped
  } else if (row >= 7 && row <= 12) {
    category = "Degree Students";
    counter = seatsInRow;
    degreeCount += counter;
  } else if (row >= 13 && row <= 19 && parentCount < 290) {
    // Parents get seats in rows 13-19 (290 seats total)
    const availableForParents = Math.min(seatsInRow, 290 - parentCount);
    category = `Parents (P${parentCount + 1}-P${
      parentCount + availableForParents
    })`;
    counter = availableForParents;
    parentCount += availableForParents;
  } else if (row >= 20 && collegeCount < 388) {
    // College starts at Row 20 (with tapering for symmetry)
    const availableForCollege = Math.min(seatsInRow, 388 - collegeCount);
    category = `College Students (${collegeCount + 1}-${
      collegeCount + availableForCollege
    })`;
    counter = availableForCollege;
    collegeCount += availableForCollege;
  } else if (row >= 13) {
    category = "Empty (limits reached)";
    counter = 0;
  }

  if (row !== 6) {
    // Skip row 6 in total count
    totalSeats += counter;
  }

  console.log(
    `Row ${row.toString().padStart(2)}: ${seatsInRow
      .toString()
      .padStart(2)} seats → ${category}`
  );
}

console.log("\n=== CATEGORY TOTALS ===\n");
console.log(
  `VIP:              ${vipCount.toString().padStart(3)} seats (Row 1)`
);
console.log(
  `Guests:           ${guestCount.toString().padStart(3)} seats (Rows 2-3)`
);
console.log(
  `Faculty:          ${facultyCount.toString().padStart(3)} seats (Rows 4-5)`
);
console.log(
  `Degree Students:  ${degreeCount.toString().padStart(3)} seats (Rows 7-12)`
);
console.log(
  `Parents:          ${parentCount.toString().padStart(3)} seats (Rows 13-19)`
);
console.log(
  `College Students: ${collegeCount.toString().padStart(3)} seats (Rows 20-27)`
);
console.log(`${"─".repeat(45)}`);
console.log(`TOTAL:            ${totalSeats.toString().padStart(3)} seats`);

console.log("\n=== VALIDATION ===\n");

const errors = [];

if (vipCount !== 26) errors.push(`❌ VIP: Expected 26, got ${vipCount}`);
else console.log("✅ VIP: 26 seats (correct)");

if (guestCount !== 56) errors.push(`❌ Guests: Expected 56, got ${guestCount}`);
else console.log("✅ Guests: 56 seats (correct)");

if (facultyCount !== 60)
  errors.push(`❌ Faculty: Expected 60, got ${facultyCount}`);
else console.log("✅ Faculty: 60 seats (correct)");

if (degreeCount !== 210)
  errors.push(`❌ Degree Students: Expected 210, got ${degreeCount}`);
else console.log("✅ Degree Students: 210 seats (correct)");

if (parentCount !== 290)
  errors.push(`❌ Parents: Expected 290, got ${parentCount}`);
else console.log("✅ Parents: 290 seats (correct) ← Rows 13-19");

if (collegeCount !== 388)
  errors.push(`❌ College Students: Expected 388, got ${collegeCount}`);
else console.log("✅ College Students: 388 seats (correct) ← REDUCED");

if (totalSeats !== 1030)
  errors.push(`❌ Total: Expected 1030, got ${totalSeats}`);
else console.log("✅ Total: 1030 seats (correct)");

console.log("\n=== CURRENT BOOKINGS ===\n");
console.log("196 Degree Students (fits in 210 capacity)");
console.log("338 College Students (fits in 388 capacity)");
console.log("0 Parents (new capacity: 290 available)");
console.log(`${"─".repeat(45)}`);
console.log("591 total booked / 1042 capacity = 57% utilization\n");

if (errors.length > 0) {
  console.log("\n❌ VALIDATION FAILED:\n");
  errors.forEach((err) => console.log(err));
  process.exit(1);
} else {
  console.log("\n✅ ALL VALIDATIONS PASSED!\n");
  console.log("Changes summary:");
  console.log("  • VIP: 26 seats (Row 1)");
  console.log("  • Guests: 56 seats (Rows 2-3, 28 each)");
  console.log("  • Faculty: 60 seats (Rows 4-5, 30 each)");
  console.log("  • Row 6 REMOVED");
  console.log("  • Degree: 210 seats (Rows 7-12) with tapering");
  console.log("  • Parents: 290 seats (Rows 13-19) with tapering");
  console.log(
    "  • College: 388 seats (Rows 20-27) WITH TAPERING (symmetry maintained)"
  );
  console.log("  • Total: 1030 seats with full symmetry throughout\n");
}
