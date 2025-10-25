const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

// File paths
const NEW_CONSENT_CSV = path.join(__dirname, "../data/NEW CONSENT FORM.csv");
const BOOKED_SEATS_CSV = path.join(__dirname, "../data/booked_seats.csv");
const COLLEGE_DATA_CSV = path.join(
  __dirname,
  "../other-data/college-students-data.csv"
);

console.log(
  "📋 Updating college-students-data.csv with enrollment numbers...\n"
);

// Read the new consent form to get enrollment numbers
const newConsentData = fs.readFileSync(NEW_CONSENT_CSV, "utf8");
const parsedConsent = Papa.parse(newConsentData, {
  header: true,
  skipEmptyLines: true,
});

// Create email to enrollment number map
const emailToEnrollment = new Map();
parsedConsent.data.forEach((row) => {
  const email = (row["SPSU Email "] || row["SPSU Email"] || "")
    .trim()
    .toLowerCase();
  const enrollmentNumber = (row["Enrollment Number"] || "").trim();
  if (email && enrollmentNumber) {
    emailToEnrollment.set(email, enrollmentNumber);
  }
});

console.log(
  `📊 Found ${emailToEnrollment.size} enrollment numbers in consent form`
);

// Read booked seats
const bookedSeatsData = fs.readFileSync(BOOKED_SEATS_CSV, "utf8");
const parsedBookedSeats = Papa.parse(bookedSeatsData, {
  header: true,
  skipEmptyLines: true,
});

// Filter college students and add enrollment numbers
const collegeStudents = parsedBookedSeats.data
  .filter((seat) => seat.category === "College Students")
  .map((student) => {
    const email = student.email.toLowerCase().trim();
    const enrollmentNumber = emailToEnrollment.get(email) || "Not Available";

    return {
      seatNumber: student.seatNumber,
      enrollmentNumber: enrollmentNumber,
      name: student.userName,
      email: student.email,
      phone: student.phone,
      program: student.notes || "Not Specified",
    };
  });

console.log(`✅ Updated ${collegeStudents.length} college student records\n`);

// Convert to CSV with enrollment number after seat number
const csvOutput = Papa.unparse(collegeStudents, {
  columns: [
    "seatNumber",
    "enrollmentNumber",
    "name",
    "email",
    "phone",
    "program",
  ],
  header: true,
});

// Save updated file
fs.writeFileSync(COLLEGE_DATA_CSV, csvOutput);

console.log("✅ Updated: other-data/college-students-data.csv");
console.log(
  "📋 Columns: Seat Number, Enrollment Number, Name, Email, Phone, Program\n"
);

// Show first 10 students
console.log("📝 First 10 College Students:");
collegeStudents.slice(0, 10).forEach((s) => {
  console.log(`   Seat ${s.seatNumber} (${s.enrollmentNumber}): ${s.name}`);
});

console.log(
  "\n✅ College students data updated successfully with enrollment numbers!\n"
);
