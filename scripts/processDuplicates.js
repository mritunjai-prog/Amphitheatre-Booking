// Script to process college students and remove duplicates with degree students
const fs = require("fs");
const path = require("path");

// Normalize function for comparison
const normalize = (str) => {
  if (!str) return "";
  return str.toString().trim().toLowerCase().replace(/\s+/g, "");
};

// Read degree students (already booked)
const degreeStudentsPath = path.join(
  __dirname,
  "../data/Data base Convocation 12 till date.csv"
);
const degreeStudentsContent = fs.readFileSync(degreeStudentsPath, "utf-8");

// Read college students consent form
const collegeStudentsPath = path.join(
  __dirname,
  "../data/CONSENT FORM FOR CONVOCATION main.csv"
);
const collegeStudentsContent = fs.readFileSync(collegeStudentsPath, "utf-8");

// Parse degree students to create a lookup
const degreeStudents = new Map(); // name -> full record
const degreeStudentsByPhone = new Map();
const degreeStudentsByEnrollment = new Map();

const degreeLines = degreeStudentsContent.split("\n");
for (let i = 0; i < degreeLines.length; i++) {
  const line = degreeLines[i].trim();
  if (!line) continue;

  const parts = line.split(",");
  if (parts.length >= 4) {
    const name = parts[1]?.trim();
    const enrollment = parts[2]?.trim();
    const mobile = parts[3]?.trim().replace(/\s+/g, "");

    if (name && enrollment && mobile && !isNaN(parseInt(parts[0]))) {
      const normalizedName = normalize(name);
      const normalizedEnrollment = normalize(enrollment);

      degreeStudents.set(normalizedName, { name, enrollment, mobile });
      if (mobile)
        degreeStudentsByPhone.set(mobile, { name, enrollment, mobile });
      if (normalizedEnrollment)
        degreeStudentsByEnrollment.set(normalizedEnrollment, {
          name,
          enrollment,
          mobile,
        });
    }
  }
}

console.log(`\n📚 Degree Students Database: ${degreeStudents.size} students`);
console.log(`   - ${degreeStudentsByPhone.size} unique phone numbers`);
console.log(
  `   - ${degreeStudentsByEnrollment.size} unique enrollment numbers`
);

// Parse college students from consent form - skip the problematic header
const collegeLines = collegeStudentsContent.split("\n");

const collegeStudents = [];
const duplicates = [];
let skippedCount = 0;

// Start from line 1 to skip header
for (let i = 1; i < collegeLines.length; i++) {
  const line = collegeLines[i].trim();
  if (!line) continue;

  // Split by comma
  const parts = line.split(",");

  if (parts.length < 8) {
    skippedCount++;
    continue;
  }

  const timestamp = parts[0]?.trim();
  const name = parts[1]?.trim();
  const enrollment = parts[2]?.trim();
  const email = parts[3]?.trim();
  const contact = parts[4]?.trim().replace(/\s+/g, "");
  const branch = parts[5]?.trim();
  const hostelStatus = parts[6]?.trim();
  const gender = parts[7]?.trim();

  // Skip if missing critical fields
  if (!name || !enrollment || !contact) {
    skippedCount++;
    continue;
  }

  const normalizedName = normalize(name);
  const normalizedEnrollment = normalize(enrollment);

  // Check if student is in degree students database
  let isDuplicate = false;
  let matchReason = "";
  let matchedDegreeStudent = null;

  if (degreeStudents.has(normalizedName)) {
    isDuplicate = true;
    matchReason = "name match";
    matchedDegreeStudent = degreeStudents.get(normalizedName);
  } else if (degreeStudentsByPhone.has(contact)) {
    isDuplicate = true;
    matchReason = "phone match";
    matchedDegreeStudent = degreeStudentsByPhone.get(contact);
  } else if (degreeStudentsByEnrollment.has(normalizedEnrollment)) {
    isDuplicate = true;
    matchReason = "enrollment match";
    matchedDegreeStudent = degreeStudentsByEnrollment.get(normalizedEnrollment);
  }

  if (isDuplicate) {
    duplicates.push({
      name: name,
      enrollment: enrollment,
      contact: contact,
      reason: matchReason,
      degreeStudentName: matchedDegreeStudent.name,
      degreeEnrollment: matchedDegreeStudent.enrollment,
    });
  } else {
    collegeStudents.push({
      timestamp,
      name: name,
      enrollment: enrollment,
      email: email,
      contact: contact,
      branch: branch,
      hostelStatus: hostelStatus,
      gender: gender,
    });
  }
}

console.log(
  `\n🎓 College Students (Consent Form): ${
    collegeLines.length - 1
  } total responses`
);
console.log(
  `   - ❌ ${duplicates.length} duplicates found (already in degree students)`
);
console.log(`   - ⚠️  ${skippedCount} invalid/skipped entries`);
console.log(
  `   - ✅ ${collegeStudents.length} unique college students (non-degree)`
);

// Display duplicates found
if (duplicates.length > 0) {
  console.log(`\n🔍 DUPLICATES FOUND (Will be REMOVED from college students):`);
  console.log("─".repeat(100));
  console.log(
    `${"No.".padEnd(5)} | ${"College Student".padEnd(
      30
    )} | ${"Enrollment".padEnd(15)} | ${"Degree Student".padEnd(
      30
    )} | ${"Reason".padEnd(15)}`
  );
  console.log("─".repeat(100));
  duplicates.forEach((dup, idx) => {
    console.log(
      `${(idx + 1).toString().padStart(4)}. | ${dup.name.padEnd(
        30
      )} | ${dup.enrollment.padEnd(15)} | ${dup.degreeStudentName.padEnd(
        30
      )} | ${dup.reason}`
    );
  });
}

// Create cleaned college students CSV
const cleanedCollegeCSV = [
  "Timestamp,Name,Enrollment Number,SPSU Email,Contact,Branch,Day Scholar or Hosteller,Gender",
];
collegeStudents.forEach((student) => {
  const line = `${student.timestamp},${student.name},${student.enrollment},${student.email},${student.contact},${student.branch},${student.hostelStatus},${student.gender}`;
  cleanedCollegeCSV.push(line);
});

// Save cleaned college students list
const outputPath = path.join(__dirname, "../data/college_students_cleaned.csv");
fs.writeFileSync(outputPath, cleanedCollegeCSV.join("\n"), "utf-8");

// Create duplicate report
const duplicateReportPath = path.join(
  __dirname,
  "../data/duplicates_report.csv"
);
const duplicateReport = [
  "College Student Name,College Enrollment,Contact,Reason,Degree Student Name,Degree Enrollment\n",
];
duplicates.forEach((dup) => {
  duplicateReport.push(
    `"${dup.name}","${dup.enrollment}","${dup.contact}","${dup.reason}","${dup.degreeStudentName}","${dup.degreeEnrollment}"`
  );
});
fs.writeFileSync(duplicateReportPath, duplicateReport.join("\n"), "utf-8");

console.log(`\n📁 OUTPUT FILES:`);
console.log(`   ✅ ${outputPath}`);
console.log(`   ✅ ${duplicateReportPath}`);

console.log(`\n✨ SUMMARY:`);
console.log(`   📚 Degree Students: ${degreeStudents.size}`);
console.log(`   🎓 College Students (cleaned): ${collegeStudents.length}`);
console.log(`   ❌ Duplicates removed: ${duplicates.length}`);
console.log(
  `   📊 Total unique students: ${degreeStudents.size + collegeStudents.length}`
);

// Now assign seats to college students
console.log(`\n🪑 ASSIGNING SEATS TO COLLEGE STUDENTS...`);

// Read existing booked seats
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const existingBookings = fs.readFileSync(bookedSeatsPath, "utf-8");

// Parse existing bookings to get the last user ID
const bookingLines = existingBookings.split("\n").slice(1);
let maxUserId = 0;
bookingLines.forEach((line) => {
  if (line.trim()) {
    const match = line.match(/,(\d+),/);
    if (match) {
      maxUserId = Math.max(maxUserId, parseInt(match[1]));
    }
  }
});

console.log(`   Last degree student ID: ${maxUserId}`);

// Create seat assignments for college students
const collegeBookings = [];
const collegeUsers = [];
let seatCounter = 1;
let userIdCounter = maxUserId + 1;

collegeStudents.forEach((student) => {
  const seatNumber = `${seatCounter++}`;
  collegeBookings.push({
    category: "College Students",
    seatNumber: seatNumber,
    userId: userIdCounter,
    userName: student.name,
    email: student.email,
    phone: student.contact,
    notes: `${student.branch} - ${student.enrollment}`,
  });

  collegeUsers.push({
    id: userIdCounter,
    name: student.name,
    email: student.email,
    phone: student.contact,
    category: "College Students",
  });

  userIdCounter++;
});

// Append to booked_seats.csv
const collegeBookingRows = collegeBookings
  .map(
    (seat) =>
      `"${seat.category}","${seat.seatNumber}",${seat.userId},"${seat.userName}","${seat.email}","${seat.phone}","${seat.notes}"`
  )
  .join("\n");

fs.appendFileSync(bookedSeatsPath, "\n" + collegeBookingRows, "utf-8");

// Append to users.csv
const usersPath = path.join(__dirname, "../data/users.csv");
const collegeUserRows = collegeUsers
  .map(
    (user) =>
      `${user.id},"${user.name}","${user.email}","${user.phone}","${user.category}"`
  )
  .join("\n");

fs.appendFileSync(usersPath, "\n" + collegeUserRows, "utf-8");

// Copy to public directory
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
fs.copyFileSync(bookedSeatsPath, publicBookedSeatsPath);
fs.copyFileSync(usersPath, publicUsersPath);

console.log(`\n✅ SEAT ASSIGNMENT COMPLETE!`);
console.log(`   🪑 College student seats: 1 to ${collegeStudents.length}`);
console.log(`   👥 User IDs: ${maxUserId + 1} to ${userIdCounter - 1}`);
console.log(`\n📊 FINAL TOTALS:`);
console.log(
  `   Degree Students: ${degreeStudents.size} (Seats D1-D${degreeStudents.size})`
);
console.log(
  `   College Students: ${collegeStudents.length} (Seats 1-${collegeStudents.length})`
);
console.log(`   ════════════════════════════════════════`);
console.log(
  `   TOTAL BOOKED: ${degreeStudents.size + collegeStudents.length} students`
);
