const fs = require("fs");
const path = require("path");

// File paths
const collegeDataPath = path.join(
  __dirname,
  "../other-data/college-students-data.csv"
);
const usersPath = path.join(__dirname, "../data/users.csv");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

console.log("🔄 Starting complete rebuild of college students data...\n");

// Read college students data
const collegeData = fs.readFileSync(collegeDataPath, "utf-8");
const collegeLines = collegeData.trim().split("\n");
const collegeHeader = collegeLines[0];
const collegeStudents = collegeLines.slice(1).map((line) => {
  const parts = line.split(",");
  return {
    seatNum: parts[0],
    enrollment: parts[1] || "",
    name: parts[2] || "",
    email: parts[3] || "",
    phone: parts[4] || "",
    program: parts[5] || "",
  };
});

console.log(
  `📖 Read ${collegeStudents.length} college students from college-students-data.csv`
);

// STEP 1: Rebuild users.csv
console.log("\n🔨 Step 1: Rebuilding users.csv...");

const usersData = fs.readFileSync(usersPath, "utf-8");
const usersLines = usersData.trim().split("\n");
const usersHeader = usersLines[0];

// Keep only NON-college students (anything that doesn't start with a plain number)
const nonCollegeUsers = usersLines.filter((line, index) => {
  if (index === 0) return true; // Keep header
  const userId = line.split(",")[0];
  return !/^[0-9]+$/.test(userId); // Keep if NOT a plain number
});

console.log(`✅ Kept ${nonCollegeUsers.length - 1} non-college users`);

// Add ALL college students from the CSV
const newCollegeUsers = collegeStudents.map((student) => {
  return `${student.seatNum},${student.name},College Students,${student.email},${student.phone}`;
});

const updatedUsersData =
  nonCollegeUsers.join("\n") + "\n" + newCollegeUsers.join("\n") + "\n";
fs.writeFileSync(usersPath, updatedUsersData);
fs.writeFileSync(publicUsersPath, updatedUsersData);

console.log(`✅ Added ${newCollegeUsers.length} college students to users.csv`);

// STEP 2: Rebuild booked_seats.csv
console.log("\n🔨 Step 2: Rebuilding booked_seats.csv...");

const bookedSeatsData = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedSeatsLines = bookedSeatsData.trim().split("\n");

// Keep only NON-college students (anything that doesn't start with "College Students,")
const nonCollegeBookings = bookedSeatsLines.filter((line) => {
  return !line.startsWith("College Students,");
});

console.log(
  `✅ Kept ${
    nonCollegeBookings.length - 1
  } non-college bookings (including comments)`
);

// Add ALL college students as booked seats
const newCollegeBookings = collegeStudents.map((student) => {
  return `College Students,${student.seatNum},${student.seatNum},${student.name},${student.email},${student.phone},`;
});

const updatedBookedSeatsData =
  nonCollegeBookings.join("\n") + "\n" + newCollegeBookings.join("\n") + "\n";
fs.writeFileSync(bookedSeatsPath, updatedBookedSeatsData);
fs.writeFileSync(publicBookedSeatsPath, updatedBookedSeatsData);

console.log(`✅ Added ${newCollegeBookings.length} college seat assignments`);

// STEP 3: Verify the final counts
console.log("\n📊 Final Verification:");

const finalUsersData = fs.readFileSync(usersPath, "utf-8");
const finalCollegeUsersCount = (finalUsersData.match(/^[0-9]+,/gm) || [])
  .length;
console.log(`College students in users.csv: ${finalCollegeUsersCount}`);

const finalBookedData = fs.readFileSync(bookedSeatsPath, "utf-8");
const finalCollegeBookedCount = (
  finalBookedData.match(/^College Students,/gm) || []
).length;
console.log(`College students in booked_seats.csv: ${finalCollegeBookedCount}`);

const vipCount = (finalBookedData.match(/^VIP,/gm) || []).length;
const guestCount = (finalBookedData.match(/^Guests,/gm) || []).length;
const degreeCount = (finalBookedData.match(/^Degree/gm) || []).length;

console.log(`\nVIP: ${vipCount}`);
console.log(`Guests: ${guestCount}`);
console.log(`Degree: ${degreeCount}`);
console.log(`College: ${finalCollegeBookedCount}`);
console.log(
  `TOTAL ASSIGNED: ${
    vipCount + guestCount + degreeCount + finalCollegeBookedCount
  }`
);

console.log(
  "\n✅ COMPLETE! All college students rebuilt from college-students-data.csv"
);
console.log("🔄 Now do a HARD REFRESH (Ctrl+Shift+R) in your browser!");
