// Process New Consent Form and Generate Tickets
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("\n🎓 PROCESSING NEW COLLEGE STUDENT CONSENT FORM");
console.log(
  "════════════════════════════════════════════════════════════════\n"
);

// Read existing degree students database
const degreeDbPath = path.join(
  __dirname,
  "../data/Data base Convocation 12 till date.csv"
);
const degreeDbContent = fs.readFileSync(degreeDbPath, "utf-8");

// Extract enrollment numbers from degree database
const degreeEnrollments = new Set();
const degreeLines = degreeDbContent.split("\n");
degreeLines.forEach((line) => {
  const match = line.match(/\b\d{2}[A-Z]{3}\d{5}\b/i);
  if (match) {
    degreeEnrollments.add(match[0].toUpperCase());
  }
});

console.log(
  `📚 Degree Students Database: ${degreeEnrollments.size} enrollment numbers found\n`
);

// Read new consent form
const consentFormPath = path.join(__dirname, "../data/NEW CONSENT FORM.csv");
const consentFormContent = fs.readFileSync(consentFormPath, "utf-8");

const parsed = Papa.parse(consentFormContent, {
  header: true,
  skipEmptyLines: true,
});

// Filter: Only "Yes" to convocation AND not in degree database
let collegeStudents = [];
let duplicatesRemoved = 0;
let notAttending = 0;

parsed.data.forEach((row, index) => {
  const enrollmentRaw = row["Enrollment Number"] || "";
  const enrollmentClean = enrollmentRaw.trim().toUpperCase();
  const willAttend = row["I will join Convocation on 28th October, 2025"] || "";

  // Skip if not attending
  if (willAttend.trim().toLowerCase() !== "yes") {
    notAttending++;
    return;
  }

  // Check if duplicate with degree students
  if (degreeEnrollments.has(enrollmentClean)) {
    console.log(`   ⚠️  Duplicate removed: ${row.Name} (${enrollmentClean})`);
    duplicatesRemoved++;
    return;
  }

  // Valid college student
  collegeStudents.push({
    name: row.Name || "",
    enrollment: enrollmentClean,
    email: row["SPSU Email "] || row["SPSU Email"] || "",
    phone: row.Contact || "",
    branch: row.Branch || "",
    category: "College Students",
  });
});

console.log(`\n📊 PROCESSING SUMMARY:`);
console.log(`   Total responses: ${parsed.data.length}`);
console.log(`   Not attending convocation: ${notAttending}`);
console.log(`   Duplicates with degree students: ${duplicatesRemoved}`);
console.log(`   Valid college students: ${collegeStudents.length}\n`);

// Now we need to assign seats
// Read existing booked seats to find next available seat
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const bookedSeatsContent = fs.readFileSync(bookedSeatsPath, "utf-8");

const bookedParsed = Papa.parse(bookedSeatsContent, {
  header: true,
  skipEmptyLines: true,
});

// Find highest College Student seat number
let maxCollegeSeatNum = 0;
let maxUserId = 0;

bookedParsed.data.forEach((row) => {
  if (row.category === "College Students") {
    const seatNum = parseInt(row.seatNumber);
    if (!isNaN(seatNum) && seatNum > maxCollegeSeatNum) {
      maxCollegeSeatNum = seatNum;
    }
  }
  const userId = parseInt(row.userId);
  if (!isNaN(userId) && userId > maxUserId) {
    maxUserId = userId;
  }
});

console.log(`📍 Starting seat assignment from: ${maxCollegeSeatNum + 1}`);
console.log(`📍 Starting user ID from: ${maxUserId + 1}\n`);

// Assign seats to new students
let newBookedSeats = [];
let seatCounter = maxCollegeSeatNum + 1;
let userIdCounter = maxUserId + 1;

collegeStudents.forEach((student) => {
  newBookedSeats.push({
    category: "College Students",
    seatNumber: seatCounter.toString(),
    userId: userIdCounter,
    userName: student.name,
    email: student.email,
    phone: student.phone,
    notes: `${student.branch} - ${student.enrollment}`,
  });
  seatCounter++;
  userIdCounter++;
});

// Append to booked_seats.csv
console.log(
  `💾 Appending ${newBookedSeats.length} new bookings to booked_seats.csv...`
);

const newRows = newBookedSeats
  .map(
    (seat) =>
      `"${seat.category}","${seat.seatNumber}",${seat.userId},"${seat.userName}","${seat.email}","${seat.phone}","${seat.notes}"`
  )
  .join("\n");

fs.appendFileSync(bookedSeatsPath, "\n" + newRows);

console.log(
  `✅ Successfully added ${newBookedSeats.length} new college students!\n`
);

// Also update users.csv
const usersPath = path.join(__dirname, "../data/users.csv");
const usersContent = fs.readFileSync(usersPath, "utf-8");
const usersParsed = Papa.parse(usersContent, {
  header: true,
  skipEmptyLines: true,
});

const newUserRows = newBookedSeats
  .map(
    (seat) =>
      `${seat.userId},${seat.seatNumber},"${seat.userName}","${seat.email}","${seat.phone}","${seat.category}"`
  )
  .join("\n");

fs.appendFileSync(usersPath, "\n" + newUserRows);

// Also update public/data/users.csv
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
fs.appendFileSync(publicUsersPath, "\n" + newUserRows);

console.log(`💾 Updated users.csv files\n`);
console.log(`════════════════════════════════════════════════════════════════`);
console.log(`\n✨ READY TO GENERATE TICKETS!`);
console.log(`   Run: node scripts/generateTickets.js\n`);

// Save summary
const summary = {
  processedAt: new Date().toISOString(),
  totalResponses: parsed.data.length,
  notAttending: notAttending,
  duplicatesRemoved: duplicatesRemoved,
  newStudentsAdded: newBookedSeats.length,
  seatRange: `${maxCollegeSeatNum + 1} to ${seatCounter - 1}`,
  userIdRange: `${maxUserId + 1} to ${userIdCounter - 1}`,
};

fs.writeFileSync(
  path.join(__dirname, "../data/consent_form_processing_summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log(`📊 Summary saved to: consent_form_processing_summary.json\n`);
