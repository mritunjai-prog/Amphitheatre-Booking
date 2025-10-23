const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("=== SEAT ALLOCATION UPDATE ===\n");

// Read current booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const bookedSeatsContent = fs.readFileSync(bookedSeatsPath, "utf8");
const bookedSeatsData = Papa.parse(bookedSeatsContent, { header: true }).data;

console.log(`Total records in booked_seats.csv: ${bookedSeatsData.length}`);

// Filter out empty rows
const validBookings = bookedSeatsData.filter(
  (row) => row.category && row.seatNumber
);
console.log(`Valid bookings: ${validBookings.length}`);

// Count by category
const degreeCount = validBookings.filter(
  (row) => row.category === "Degree Students"
).length;
const collegeCount = validBookings.filter(
  (row) => row.category === "College Students"
).length;

console.log(`\nCurrent Bookings:`);
console.log(`  Degree Students: ${degreeCount}`);
console.log(`  College Students: ${collegeCount}`);
console.log(`  Total: ${degreeCount + collegeCount}`);

console.log(`\nNew Capacity:`);
console.log(`  VIP: 26 seats`);
console.log(`  Guests: 56 seats`);
console.log(`  Faculty: 60 seats`);
console.log(`  Degree: 210 seats (${degreeCount} booked)`);
console.log(`  Parents: 290 seats (0 booked)`);
console.log(`  College: 400 seats (${collegeCount} booked)`);

// Update seat numbers based on new layout
console.log(`\n=== UPDATING SEAT NUMBERS ===\n`);

const updatedBookings = validBookings.map((booking, index) => {
  if (booking.category === "Degree Students") {
    // Degree students stay with D prefix (D1-D210)
    const seatNum = booking.seatNumber.replace(/\D/g, ""); // Extract number
    return {
      ...booking,
      seatNumber: `D${seatNum}`,
    };
  } else if (booking.category === "College Students") {
    // College students use number only (1-400)
    const seatNum = booking.seatNumber.replace(/\D/g, ""); // Extract number
    return {
      ...booking,
      seatNumber: seatNum,
    };
  }
  return booking;
});

console.log(`✓ Updated ${updatedBookings.length} seat allocations`);

// Write updated booked_seats.csv
const updatedCsv = Papa.unparse(updatedBookings);
fs.writeFileSync(bookedSeatsPath, updatedCsv);
console.log(`✓ Updated: ${bookedSeatsPath}`);

// Update users.csv
const usersPath = path.join(__dirname, "../data/users.csv");
const usersContent = fs.readFileSync(usersPath, "utf8");
const usersData = Papa.parse(usersContent, { header: true }).data;

const validUsers = usersData.filter((row) => row.id && row.seatNumber);
console.log(`\nValid users in users.csv: ${validUsers.length}`);

const updatedUsers = validUsers.map((user) => {
  if (user.category === "Degree Students") {
    const seatNum = user.seatNumber.replace(/\D/g, "");
    return { ...user, seatNumber: `D${seatNum}` };
  } else if (user.category === "College Students") {
    const seatNum = user.seatNumber.replace(/\D/g, "");
    return { ...user, seatNumber: seatNum };
  }
  return user;
});

const updatedUsersCsv = Papa.unparse(updatedUsers);
fs.writeFileSync(usersPath, updatedUsersCsv);
console.log(`✓ Updated: ${usersPath}`);

// Also update public/data copies
const publicBookedPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");

fs.writeFileSync(publicBookedPath, updatedCsv);
console.log(`✓ Updated: ${publicBookedPath}`);

fs.writeFileSync(publicUsersPath, updatedUsersCsv);
console.log(`✓ Updated: ${publicUsersPath}`);

console.log("\n=== SUMMARY ===");
console.log(`✓ All seat allocations updated successfully`);
console.log(`✓ ${degreeCount} Degree Students → Seats D1-D${degreeCount}`);
console.log(`✓ ${collegeCount} College Students → Seats 1-${collegeCount}`);
console.log(
  `✓ Ready for new layout (VIP=26, Guests=56, Faculty=60, Degree=210, Parents=290, College=400)`
);
