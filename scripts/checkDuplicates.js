// Check for duplicates between old and new college students
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("\n🔍 CHECKING FOR DUPLICATE COLLEGE STUDENTS");
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

// Separate old (1-381) and new (382+) college students
const oldCollegeStudents = [];
const newCollegeStudents = [];

parsed.data.forEach((row) => {
  if (row.category === "College Students") {
    const seatNum = parseInt(row.seatNumber);
    if (seatNum <= 381) {
      oldCollegeStudents.push(row);
    } else {
      newCollegeStudents.push(row);
    }
  }
});

console.log(
  `📊 OLD College Students (Seats 1-381): ${oldCollegeStudents.length}`
);
console.log(
  `📊 NEW College Students (Seats 382+): ${newCollegeStudents.length}`
);
console.log(
  `📊 TOTAL: ${oldCollegeStudents.length + newCollegeStudents.length}\n`
);

// Extract enrollment numbers and emails for comparison
const oldEnrollments = new Map();
const oldEmails = new Map();

oldCollegeStudents.forEach((student) => {
  // Extract enrollment from notes
  const enrollMatch = student.notes.match(/\b\d{2}[A-Z]{2,5}\d{5}\b/i);
  if (enrollMatch) {
    const enrollment = enrollMatch[0].toUpperCase();
    oldEnrollments.set(enrollment, student);
  }

  // Store by email
  if (student.email) {
    oldEmails.set(student.email.toLowerCase().trim(), student);
  }
});

console.log(
  `🔑 Old students mapped: ${oldEnrollments.size} by enrollment, ${oldEmails.size} by email\n`
);

// Check for duplicates
let duplicatesByEnrollment = [];
let duplicatesByEmail = [];

newCollegeStudents.forEach((newStudent) => {
  // Check enrollment
  const enrollMatch = newStudent.notes.match(/\b\d{2}[A-Z]{2,5}\d{5}\b/i);
  if (enrollMatch) {
    const enrollment = enrollMatch[0].toUpperCase();
    if (oldEnrollments.has(enrollment)) {
      const oldStudent = oldEnrollments.get(enrollment);
      duplicatesByEnrollment.push({
        enrollment,
        oldSeat: oldStudent.seatNumber,
        oldName: oldStudent.userName,
        newSeat: newStudent.seatNumber,
        newName: newStudent.userName,
      });
    }
  }

  // Check email
  if (newStudent.email) {
    const email = newStudent.email.toLowerCase().trim();
    if (oldEmails.has(email)) {
      const oldStudent = oldEmails.get(email);
      duplicatesByEmail.push({
        email,
        oldSeat: oldStudent.seatNumber,
        oldName: oldStudent.userName,
        newSeat: newStudent.seatNumber,
        newName: newStudent.userName,
      });
    }
  }
});

console.log(
  `⚠️  DUPLICATES FOUND BY ENROLLMENT: ${duplicatesByEnrollment.length}`
);
if (duplicatesByEnrollment.length > 0) {
  duplicatesByEnrollment.slice(0, 10).forEach((dup) => {
    console.log(
      `   ${dup.enrollment}: Seat ${dup.oldSeat} (${dup.oldName}) vs Seat ${dup.newSeat} (${dup.newName})`
    );
  });
  if (duplicatesByEnrollment.length > 10) {
    console.log(`   ... and ${duplicatesByEnrollment.length - 10} more`);
  }
}

console.log(`\n⚠️  DUPLICATES FOUND BY EMAIL: ${duplicatesByEmail.length}`);
if (duplicatesByEmail.length > 0) {
  duplicatesByEmail.slice(0, 10).forEach((dup) => {
    console.log(`   ${dup.email}: Seat ${dup.oldSeat} vs Seat ${dup.newSeat}`);
  });
  if (duplicatesByEmail.length > 10) {
    console.log(`   ... and ${duplicatesByEmail.length - 10} more`);
  }
}

console.log(
  `\n════════════════════════════════════════════════════════════════`
);
console.log(`\n⚠️  CRITICAL ISSUE DETECTED!`);
console.log(`   The same students appear in BOTH old and new lists.`);
console.log(
  `   We need to remove these duplicates and keep only ONE entry per student.\n`
);

// Calculate actual unique students
const totalDuplicates = duplicatesByEnrollment.length;
const actualUniqueCollegeStudents =
  oldCollegeStudents.length + newCollegeStudents.length - totalDuplicates;

console.log(`📊 CORRECTED COUNT:`);
console.log(`   Old college students: ${oldCollegeStudents.length}`);
console.log(`   New college students: ${newCollegeStudents.length}`);
console.log(`   Duplicates to remove: ${totalDuplicates}`);
console.log(`   Actual unique students: ${actualUniqueCollegeStudents}\n`);
