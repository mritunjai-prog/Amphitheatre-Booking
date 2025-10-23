const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("=== ALLOCATING SEATS ===\n");

// Read booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const bookedSeatsContent = fs.readFileSync(bookedSeatsPath, "utf8");
const bookedSeatsData = Papa.parse(bookedSeatsContent, { header: true }).data;

// Filter valid bookings
const validBookings = bookedSeatsData.filter(
  (row) => row.category && row.seatNumber
);

// Separate by category
const degreeStudents = validBookings.filter(
  (row) => row.category === "Degree Students"
);
const collegeStudents = validBookings.filter(
  (row) => row.category === "College Students"
);

console.log(`Current bookings:`);
console.log(`  Degree Students: ${degreeStudents.length}`);
console.log(`  College Students: ${collegeStudents.length}`);
console.log(`  Total: ${validBookings.length}\n`);

// Limit college students to 338
const collegeStudentsLimited = collegeStudents.slice(0, 338);
console.log(`Limiting College Students to: ${collegeStudentsLimited.length}`);
console.log(
  `Removed: ${
    collegeStudents.length - collegeStudentsLimited.length
  } college students\n`
);

// Generate seat allocations
console.log("=== SEAT ALLOCATIONS ===\n");

// Allocate Degree Students (D1-D196)
const allocatedDegree = degreeStudents.map((student, index) => {
  const seatNumber = `D${index + 1}`;
  return {
    ...student,
    seatNumber: seatNumber,
    userId: seatNumber,
  };
});

console.log(
  `✓ Allocated ${allocatedDegree.length} Degree Students: D1 to D${allocatedDegree.length}`
);

// Allocate College Students (1-338)
const allocatedCollege = collegeStudentsLimited.map((student, index) => {
  const seatNumber = `${index + 1}`;
  return {
    ...student,
    seatNumber: seatNumber,
    userId: `C${index + 1}`,
  };
});

console.log(
  `✓ Allocated ${allocatedCollege.length} College Students: 1 to ${allocatedCollege.length}`
);

// Combine all bookings
const allAllocated = [...allocatedDegree, ...allocatedCollege];
console.log(`\n✓ Total seats allocated: ${allAllocated.length}`);

// Write updated booked_seats.csv
const updatedCsv = Papa.unparse(allAllocated);
fs.writeFileSync(bookedSeatsPath, updatedCsv);
console.log(`✓ Updated: ${bookedSeatsPath}`);

// Update users.csv
const usersPath = path.join(__dirname, "../data/users.csv");
const updatedUsers = allAllocated.map((booking) => ({
  id: booking.userId,
  seatNumber: booking.seatNumber,
  name: booking.userName,
  email: booking.email,
  phone: booking.phone,
  category: booking.category,
}));

const updatedUsersCsv = Papa.unparse(updatedUsers);
fs.writeFileSync(usersPath, updatedUsersCsv);
console.log(`✓ Updated: ${usersPath}`);

// Update public copies
const publicBookedPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");

fs.writeFileSync(publicBookedPath, updatedCsv);
console.log(`✓ Updated: ${publicBookedPath}`);

fs.writeFileSync(publicUsersPath, updatedUsersCsv);
console.log(`✓ Updated: ${publicUsersPath}`);

console.log("\n=== CAPACITY STATUS ===");
console.log(`VIP: 0 / 26 seats`);
console.log(`Guests: 0 / 56 seats`);
console.log(`Faculty: 0 / 60 seats`);
console.log(
  `Degree Students: ${allocatedDegree.length} / 210 seats (${
    210 - allocatedDegree.length
  } available)`
);
console.log(`Parents: 0 / 290 seats`);
console.log(
  `College Students: ${allocatedCollege.length} / 400 seats (${
    400 - allocatedCollege.length
  } available)`
);
console.log(`\nTotal: ${allAllocated.length} / 1042 seats allocated`);
console.log(`Available: ${1042 - allAllocated.length} seats\n`);

console.log("✅ SEAT ALLOCATION COMPLETE!");
