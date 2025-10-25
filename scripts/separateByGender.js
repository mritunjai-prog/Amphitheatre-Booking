const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

// File paths
const NEW_CONSENT_CSV = path.join(__dirname, "../data/NEW CONSENT FORM.csv");
const BOOKED_SEATS_CSV = path.join(__dirname, "../data/booked_seats.csv");
const MALE_STUDENTS_CSV = path.join(
  __dirname,
  "../other-data/male-college-students.csv"
);
const FEMALE_STUDENTS_CSV = path.join(
  __dirname,
  "../other-data/female-college-students.csv"
);

console.log("📋 Processing college students by gender...\n");

// Read the new consent form
const newConsentData = fs.readFileSync(NEW_CONSENT_CSV, "utf8");
const parsedConsent = Papa.parse(newConsentData, {
  header: true,
  skipEmptyLines: true,
});

// Read booked seats to get seat assignments
const bookedSeatsData = fs.readFileSync(BOOKED_SEATS_CSV, "utf8");
const parsedBookedSeats = Papa.parse(bookedSeatsData, {
  header: true,
  skipEmptyLines: true,
});

// Create a map of email to seat number for college students
const seatMap = new Map();
parsedBookedSeats.data.forEach((row) => {
  if (row.category === "College Students" && row.email) {
    seatMap.set(row.email.toLowerCase().trim(), row.seatNumber);
  }
});

console.log(`📊 Total college seat assignments: ${seatMap.size}`);

// Process students and separate by gender
const maleStudents = [];
const femaleStudents = [];
const seenEmails = new Set();

parsedConsent.data.forEach((row) => {
  const name = (row.Name || "").trim();
  const email = (row["SPSU Email "] || row["SPSU Email"] || "")
    .trim()
    .toLowerCase();
  const phone = (row.Contact || "").trim();
  const branch = (row.Branch || "").trim();
  const enrollmentNumber = (row["Enrollment Number"] || "").trim();
  const dayScholarOrHosteller = (
    row["Day Scholar or Hosteller "] ||
    row["Day Scholar or Hosteller"] ||
    ""
  ).trim();
  const gender = (row.Gender || "").trim();

  // Skip if missing critical data or already seen
  if (!name || !email || seenEmails.has(email)) {
    return;
  }

  // Skip Mritunjai Singh
  if (
    name.toLowerCase().includes("mritunjai") &&
    name.toLowerCase().includes("singh")
  ) {
    return;
  }

  // Get seat number from the map
  const seatNumber = seatMap.get(email);
  if (!seatNumber) {
    return; // Not in the final 388 allocated seats
  }

  seenEmails.add(email);

  const studentData = {
    seatNumber: seatNumber,
    name: name,
    email: email,
    degree: branch,
    enrollmentNumber: enrollmentNumber,
    dayScholarOrHosteller: dayScholarOrHosteller,
  };

  // Separate by gender
  if (
    gender.toLowerCase().includes("male") &&
    !gender.toLowerCase().includes("female")
  ) {
    maleStudents.push(studentData);
  } else if (gender.toLowerCase().includes("female")) {
    femaleStudents.push(studentData);
  }
});

// Sort by seat number
maleStudents.sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber));
femaleStudents.sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber));

console.log(`👨 Male students: ${maleStudents.length}`);
console.log(`👩 Female students: ${femaleStudents.length}`);
console.log(`📊 Total: ${maleStudents.length + femaleStudents.length}\n`);

// Write male students CSV
const maleCSV = Papa.unparse(maleStudents, {
  columns: [
    "seatNumber",
    "name",
    "email",
    "degree",
    "enrollmentNumber",
    "dayScholarOrHosteller",
  ],
  header: true,
});

fs.writeFileSync(MALE_STUDENTS_CSV, maleCSV);
console.log("✅ Created: other-data/male-college-students.csv");

// Write female students CSV
const femaleCSV = Papa.unparse(femaleStudents, {
  columns: [
    "seatNumber",
    "name",
    "email",
    "degree",
    "enrollmentNumber",
    "dayScholarOrHosteller",
  ],
  header: true,
});

fs.writeFileSync(FEMALE_STUDENTS_CSV, femaleCSV);
console.log("✅ Created: other-data/female-college-students.csv");

// Show samples
console.log("\n👨 First 5 Male Students:");
maleStudents.slice(0, 5).forEach((s) => {
  console.log(
    `   Seat ${s.seatNumber}: ${s.name} (${s.degree}) - ${s.dayScholarOrHosteller}`
  );
});

console.log("\n👩 First 5 Female Students:");
femaleStudents.slice(0, 5).forEach((s) => {
  console.log(
    `   Seat ${s.seatNumber}: ${s.name} (${s.degree}) - ${s.dayScholarOrHosteller}`
  );
});

console.log("\n" + "=".repeat(60));
console.log("✅ GENDER-SEPARATED FILES CREATED SUCCESSFULLY!");
console.log("=".repeat(60));
