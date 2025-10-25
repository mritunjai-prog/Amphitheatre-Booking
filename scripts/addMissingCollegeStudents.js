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

// Read college students data
const collegeData = fs.readFileSync(collegeDataPath, "utf-8");
const collegeLines = collegeData.trim().split("\n");
const collegeHeader = collegeLines[0];
const collegeStudents = collegeLines.slice(1).map((line) => {
  const [seatNum, enrollment, name, email, phone, program] = line.split(",");
  return {
    seatNum: parseInt(seatNum),
    enrollment,
    name,
    email,
    phone,
    program,
  };
});

console.log(`Total college students in data file: ${collegeStudents.length}`);

// Read existing users.csv
const usersData = fs.readFileSync(usersPath, "utf-8");
const usersLines = usersData.trim().split("\n");
const usersHeader = usersLines[0];

// Find existing college student IDs
const existingCollegeIds = new Set();
const existingUsers = usersLines.slice(1);
existingUsers.forEach((line) => {
  const userId = line.split(",")[0];
  if (/^\d+$/.test(userId)) {
    existingCollegeIds.add(parseInt(userId));
  }
});

console.log(
  `Existing college students in users.csv: ${existingCollegeIds.size}`
);

// Find missing students
const missingStudents = collegeStudents.filter(
  (student) => !existingCollegeIds.has(student.seatNum)
);

console.log(`Missing college students: ${missingStudents.length}`);

if (missingStudents.length === 0) {
  console.log("✅ All college students are already in the database!");
  process.exit(0);
}

console.log(
  "\nMissing student seat numbers:",
  missingStudents.map((s) => s.seatNum).join(", ")
);

// Add missing students to users.csv
const newUserLines = missingStudents.map((student) => {
  return `${student.seatNum},${student.name},College Students,${student.email},${student.phone}`;
});

const updatedUsersData =
  usersData.trim() + "\n" + newUserLines.join("\n") + "\n";
fs.writeFileSync(usersPath, updatedUsersData);
fs.writeFileSync(publicUsersPath, updatedUsersData);

console.log(`✅ Added ${missingStudents.length} missing students to users.csv`);

// Read existing booked_seats.csv
const bookedSeatsData = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedSeatsLines = bookedSeatsData.trim().split("\n");
const bookedSeatsHeader = bookedSeatsLines[0];

// Find existing college seat assignments
const existingBookedSeats = new Set();
const existingBookings = bookedSeatsLines.slice(1);
existingBookings.forEach((line) => {
  const userId = line.split(",")[0];
  if (/^\d+$/.test(userId)) {
    existingBookedSeats.add(parseInt(userId));
  }
});

console.log(`Existing college seat assignments: ${existingBookedSeats.size}`);

// Auto-assign missing students to their seats
const newBookingLines = missingStudents
  .filter((student) => !existingBookedSeats.has(student.seatNum))
  .map((student) => {
    return `${student.seatNum},${student.seatNum}`;
  });

if (newBookingLines.length > 0) {
  const updatedBookedSeatsData =
    bookedSeatsData.trim() + "\n" + newBookingLines.join("\n") + "\n";
  fs.writeFileSync(bookedSeatsPath, updatedBookedSeatsData);
  fs.writeFileSync(publicBookedSeatsPath, updatedBookedSeatsData);

  console.log(
    `✅ Auto-assigned ${newBookingLines.length} students to their seats`
  );
  console.log(
    `📊 Total college students now: ${
      existingCollegeIds.size + missingStudents.length
    }`
  );
  console.log(
    `📊 Total college seats assigned: ${
      existingBookedSeats.size + newBookingLines.length
    }`
  );
} else {
  console.log("✅ All students already have seat assignments!");
}

console.log(
  "\n✅ Script complete! All 388 college students should now be in the system."
);
