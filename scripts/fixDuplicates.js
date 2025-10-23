// Fix duplicates - keep only unique college students
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("\n🔧 FIXING DUPLICATE COLLEGE STUDENTS");
console.log(
  "════════════════════════════════════════════════════════════════\n"
);

// Read booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const bookedSeatsContent = fs.readFileSync(bookedSeatsPath, "utf-8");

const parsed = Papa.parse(bookedSeatsContent, {
  header: true,
  skipEmptyLines: true,
});

// Separate degree students and college students
const degreeStudents = [];
const collegeStudentsMap = new Map(); // Use email as key to deduplicate

parsed.data.forEach((row) => {
  if (row.category === "Degree Students") {
    degreeStudents.push(row);
  } else if (row.category === "College Students") {
    const email = row.email.toLowerCase().trim();
    // Keep the FIRST occurrence (old data, seats 1-381)
    if (!collegeStudentsMap.has(email)) {
      collegeStudentsMap.set(email, row);
    }
  }
});

const uniqueCollegeStudents = Array.from(collegeStudentsMap.values());

console.log(`✅ Degree Students: ${degreeStudents.length}`);
console.log(`✅ Unique College Students: ${uniqueCollegeStudents.length}`);
console.log(
  `📊 Total Unique Students: ${
    degreeStudents.length + uniqueCollegeStudents.length
  }\n`
);

// Check if we exceed seat capacity
const totalSeats = 462; // College student seats available (rows 13-25)
if (uniqueCollegeStudents.length > totalSeats) {
  console.log(
    `⚠️  WARNING: ${uniqueCollegeStudents.length} students exceed ${totalSeats} available seats!`
  );
  console.log(
    `   Overflow: ${uniqueCollegeStudents.length - totalSeats} students\n`
  );
}

// Reassign seat numbers sequentially
uniqueCollegeStudents.forEach((student, index) => {
  student.seatNumber = (index + 1).toString();
});

// Rebuild booked_seats.csv with header
const header = "category,seatNumber,userId,userName,email,phone,notes";
const degreeRows = degreeStudents.map(
  (s) =>
    `"${s.category}","${s.seatNumber}",${s.userId},"${s.userName}","${s.email}","${s.phone}","${s.notes}"`
);
const collegeRows = uniqueCollegeStudents.map(
  (s) =>
    `"${s.category}","${s.seatNumber}",${s.userId},"${s.userName}","${s.email}","${s.phone}","${s.notes}"`
);

const newCsvContent = [header, ...degreeRows, ...collegeRows].join("\n");
fs.writeFileSync(bookedSeatsPath, newCsvContent);

console.log(`💾 Updated booked_seats.csv`);

// Also update users.csv
const usersPath = path.join(__dirname, "../data/users.csv");
const userHeader = "id,seatNumber,name,email,phone,category";

const degreeUserRows = degreeStudents.map(
  (s) =>
    `${s.userId},${s.seatNumber},"${s.userName}","${s.email}","${s.phone}","${s.category}"`
);
const collegeUserRows = uniqueCollegeStudents.map(
  (s) =>
    `${s.userId},${s.seatNumber},"${s.userName}","${s.email}","${s.phone}","${s.category}"`
);

const newUsersContent = [
  userHeader,
  ...degreeUserRows,
  ...collegeUserRows,
].join("\n");
fs.writeFileSync(usersPath, newUsersContent);

// Update public/data/users.csv
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
fs.writeFileSync(publicUsersPath, newUsersContent);

console.log(`💾 Updated users.csv files\n`);
console.log(`════════════════════════════════════════════════════════════════`);
console.log(`\n✅ DUPLICATES REMOVED!`);
console.log(
  `   Total unique students: ${
    degreeStudents.length + uniqueCollegeStudents.length
  }`
);
console.log(`   Ready to regenerate tickets.\n`);
