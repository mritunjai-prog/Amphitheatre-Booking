const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

// File paths
const NEW_CONSENT_CSV = path.join(__dirname, "../data/NEW CONSENT FORM.csv");
const BOOKED_SEATS_CSV = path.join(__dirname, "../data/booked_seats.csv");
const PUBLIC_BOOKED_SEATS_CSV = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);
const USERS_CSV = path.join(__dirname, "../data/users.csv");
const PUBLIC_USERS_CSV = path.join(__dirname, "../public/data/users.csv");
const COLLEGE_DATA_CSV = path.join(
  __dirname,
  "../other-data/college-students-data.csv"
);

console.log("📋 Processing NEW CONSENT FORM...\n");

// Read the new consent form
const newConsentData = fs.readFileSync(NEW_CONSENT_CSV, "utf8");
const parsedConsent = Papa.parse(newConsentData, {
  header: true,
  skipEmptyLines: true,
});

console.log(`📊 Total entries in consent form: ${parsedConsent.data.length}`);

// Filter and deduplicate entries
const uniqueStudents = [];
const seenEmails = new Set();
const seenNames = new Set();

parsedConsent.data.forEach((row) => {
  const name = (row.Name || "").trim();
  const email = (row["SPSU Email "] || row["SPSU Email"] || "")
    .trim()
    .toLowerCase();
  const phone = (row.Contact || "").trim();
  const branch = (row.Branch || "").trim();

  // Skip if missing critical data
  if (!name || !email) {
    return;
  }

  // Skip Mritunjai Singh
  if (
    name.toLowerCase().includes("mritunjai") &&
    name.toLowerCase().includes("singh")
  ) {
    console.log(`❌ Excluding: ${name}`);
    return;
  }

  // Create unique key (email is most reliable)
  const uniqueKey = email;

  if (!seenEmails.has(uniqueKey)) {
    seenEmails.add(uniqueKey);
    seenNames.add(name.toLowerCase());
    uniqueStudents.push({
      name,
      email,
      phone,
      branch,
    });
  }
});

console.log(
  `✅ Unique students (after deduplication): ${uniqueStudents.length}`
);

// Limit to 388 students
const limitedStudents = uniqueStudents.slice(0, 388);
console.log(
  `🎯 Taking first ${limitedStudents.length} students for seat allocation\n`
);

// Read existing booked_seats.csv to get current degree students
const bookedSeatsData = fs.readFileSync(BOOKED_SEATS_CSV, "utf8");
const parsedBookedSeats = Papa.parse(bookedSeatsData, {
  header: true,
  skipEmptyLines: true,
});

// Filter degree students (D prefix seats)
const degreeStudents = parsedBookedSeats.data.filter(
  (row) => row.seatNumber && row.seatNumber.startsWith("D")
);

console.log(`📚 Existing degree students: ${degreeStudents.length}`);

// Create new booked_seats entries for college students
const newBookedSeats = [...degreeStudents];
const newUsersData = [];
const newCollegeData = [];

limitedStudents.forEach((student, index) => {
  const seatNumber = String(index + 1);
  const userId = seatNumber; // Same as seat number for college students

  // Add to booked_seats
  newBookedSeats.push({
    category: "College Students",
    seatNumber: seatNumber,
    userId: userId,
    userName: student.name,
    email: student.email,
    phone: student.phone,
    notes: student.branch,
  });

  // Add to users.csv
  newUsersData.push({
    id: userId,
    name: student.name,
    email: student.email,
    phone: student.phone,
  });

  // Add to college-students-data.csv
  newCollegeData.push({
    seatNumber: seatNumber,
    name: student.name,
    email: student.email,
    phone: student.phone,
    program: student.branch,
  });
});

console.log(
  `\n✅ Created ${limitedStudents.length} new college student entries\n`
);

// Write booked_seats.csv
const bookedSeatsCSV = Papa.unparse(newBookedSeats, {
  columns: [
    "category",
    "seatNumber",
    "userId",
    "userName",
    "email",
    "phone",
    "notes",
  ],
});

fs.writeFileSync(BOOKED_SEATS_CSV, bookedSeatsCSV);
fs.writeFileSync(PUBLIC_BOOKED_SEATS_CSV, bookedSeatsCSV);
console.log("✅ Updated: data/booked_seats.csv");
console.log("✅ Updated: public/data/booked_seats.csv");

// Write users.csv
const usersCSV = Papa.unparse(newUsersData, {
  columns: ["id", "name", "email", "phone"],
});

fs.writeFileSync(USERS_CSV, usersCSV);
fs.writeFileSync(PUBLIC_USERS_CSV, usersCSV);
console.log("✅ Updated: data/users.csv");
console.log("✅ Updated: public/data/users.csv");

// Write college-students-data.csv
const collegeCSV = Papa.unparse(newCollegeData, {
  columns: ["seatNumber", "name", "email", "phone", "program"],
  header: true,
});

fs.writeFileSync(COLLEGE_DATA_CSV, collegeCSV);
console.log("✅ Updated: other-data/college-students-data.csv");

// Summary
console.log("\n" + "=".repeat(60));
console.log("📊 SUMMARY");
console.log("=".repeat(60));
console.log(`Total entries in consent form: ${parsedConsent.data.length}`);
console.log(`Unique students found: ${uniqueStudents.length}`);
console.log(`Students allocated seats: ${limitedStudents.length}`);
console.log(`Degree students: ${degreeStudents.length}`);
console.log(`Total booked seats: ${newBookedSeats.length}`);
console.log("=".repeat(60));

// Show first 10 and last 10 college students
console.log("\n📋 First 10 College Students:");
limitedStudents.slice(0, 10).forEach((student, index) => {
  console.log(`   Seat ${index + 1}: ${student.name} (${student.branch})`);
});

console.log("\n📋 Last 10 College Students:");
limitedStudents.slice(-10).forEach((student, index) => {
  const seatNum = limitedStudents.length - 10 + index + 1;
  console.log(`   Seat ${seatNum}: ${student.name} (${student.branch})`);
});

console.log("\n✅ All files updated successfully!");
console.log(
  "🎫 Ready to generate tickets with: node scripts/generateTickets.js\n"
);
