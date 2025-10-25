const fs = require("fs");
const path = require("path");

// File paths
const collegeDataPath = path.join(
  __dirname,
  "../other-data/college-students-data.csv"
);
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

// Read college students data
const collegeData = fs.readFileSync(collegeDataPath, "utf-8");
const collegeLines = collegeData.trim().split("\n");
const collegeStudents = collegeLines.slice(1).map((line) => {
  const [seatNum, enrollment, name, email, phone, program] = line.split(",");
  return {
    seatNum: parseInt(seatNum),
    enrollment: enrollment || "",
    name: name || "",
    email: email || "",
    phone: phone || "",
    program: program || "",
  };
});

console.log(
  `Total students in college-students-data.csv: ${collegeStudents.length}`
);

// Read existing booked_seats.csv
const bookedSeatsData = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedSeatsLines = bookedSeatsData.trim().split("\n");

// Find which college seats are already assigned
const assignedSeatNumbers = new Set();
bookedSeatsLines.forEach((line) => {
  if (line.startsWith("College Students,")) {
    const parts = line.split(",");
    const seatNum = parseInt(parts[1]);
    assignedSeatNumbers.add(seatNum);
  }
});

console.log(
  `Assigned college seats in booked_seats.csv: ${assignedSeatNumbers.size}`
);

// Find missing students
const missingStudents = collegeStudents.filter(
  (student) => !assignedSeatNumbers.has(student.seatNum)
);

console.log(`Missing students: ${missingStudents.length}`);

if (missingStudents.length === 0) {
  console.log("✅ All 388 college students are already assigned!");
  process.exit(0);
}

console.log(
  "\nMissing seat numbers:",
  missingStudents
    .map((s) => s.seatNum)
    .sort((a, b) => a - b)
    .join(", ")
);

// Add missing students to booked_seats.csv
const newBookingLines = missingStudents.map((student) => {
  return `College Students,${student.seatNum},${student.seatNum},${student.name},${student.email},${student.phone},`;
});

// Append to booked_seats.csv
const updatedBookedSeatsData =
  bookedSeatsData.trim() + "\n" + newBookingLines.join("\n") + "\n";
fs.writeFileSync(bookedSeatsPath, updatedBookedSeatsData);
fs.writeFileSync(publicBookedSeatsPath, updatedBookedSeatsData);

console.log(
  `\n✅ Added ${missingStudents.length} missing students to booked_seats.csv`
);

// Verify
const finalData = fs.readFileSync(bookedSeatsPath, "utf-8");
const finalCollegeCount = (finalData.match(/^College Students,/gm) || [])
  .length;
console.log(`📊 Total college students now: ${finalCollegeCount}`);
console.log("✅ All 388 college students should now be seated!");
