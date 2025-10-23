const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const newDegreeFile = path.join(__dirname, "../data/NEW DEGREE AWARDING.csv");
const bookedSeatsFile = path.join(__dirname, "../data/booked_seats.csv");
const usersFile = path.join(__dirname, "../data/users.csv");
const publicUsersFile = path.join(__dirname, "../public/data/users.csv");

console.log("=".repeat(80));
console.log("PROCESSING NEW DEGREE AWARDING STUDENTS");
console.log("=".repeat(80));

// Read new degree awarding form
const newDegreeContent = fs.readFileSync(newDegreeFile, "utf-8");
const newDegreeData = Papa.parse(newDegreeContent, { header: true }).data;

console.log(`\nTotal responses in new form: ${newDegreeData.length}`);

// Read existing booked seats
const bookedSeatsContent = fs.readFileSync(bookedSeatsFile, "utf-8");
const existingBookings = Papa.parse(bookedSeatsContent, { header: true }).data;

console.log(`Existing bookings: ${existingBookings.length}`);

// Separate degree and college students
const existingDegreeStudents = existingBookings.filter(
  (row) => row.category === "Degree Students"
);
const existingCollegeStudents = existingBookings.filter(
  (row) => row.category === "College Students"
);

console.log(`\nExisting degree students: ${existingDegreeStudents.length}`);
console.log(`Existing college students: ${existingCollegeStudents.length}`);

// Process new degree awarding students - check for duplicates within new data only
const newDegreeStudents = [];
const duplicatesWithinNew = [];
const degreeStudentsByEmail = new Map();
const degreeStudentsByEnrollment = new Map();
let skipped = 0;

newDegreeData.forEach((row, index) => {
  if (!row["Name of the Student"] || row["Name of the Student"].trim() === "") {
    skipped++;
    return;
  }

  const name = row["Name of the Student"].trim();
  const enrollment = row["Enrollment No.  "]?.trim() || "";
  const email =
    row["Enter Your Email ID\n(Personal Email ID for the future reference)"]
      ?.toLowerCase()
      .trim() || "";
  const phone = row["Enter Your Mobile Number (Whatsapp)"]?.trim() || "";
  const degree = row["Select Your Degree"]?.trim() || "";

  // Check for duplicates WITHIN the new data only
  const isDuplicateEmail = email && degreeStudentsByEmail.has(email);
  const isDuplicateEnrollment =
    enrollment && degreeStudentsByEnrollment.has(enrollment.toUpperCase());

  if (isDuplicateEmail || isDuplicateEnrollment) {
    duplicatesWithinNew.push({
      name,
      enrollment,
      email,
      reason: isDuplicateEmail
        ? "Duplicate email in new form"
        : "Duplicate enrollment in new form",
    });
    return;
  }

  // Add to new students list
  newDegreeStudents.push({
    name,
    enrollment,
    email,
    phone,
    degree,
    notes: `${enrollment} | ${degree}`,
  });

  // Add to maps to prevent duplicates within new data
  if (email) degreeStudentsByEmail.set(email, { name });
  if (enrollment)
    degreeStudentsByEnrollment.set(enrollment.toUpperCase(), { name });
});

console.log(`\n--- Processing Results ---`);
console.log(`Valid new degree students: ${newDegreeStudents.length}`);
console.log(`Duplicates within new form: ${duplicatesWithinNew.length}`);
console.log(`Skipped (empty rows): ${skipped}`);

if (duplicatesWithinNew.length > 0) {
  console.log(`\n--- Duplicates Within New Form (First 10) ---`);
  duplicatesWithinNew.slice(0, 10).forEach((dup, i) => {
    console.log(`${i + 1}. ${dup.name} (${dup.enrollment}) - ${dup.reason}`);
  });
}

// Now replace ALL degree students with the new list
console.log(`\n=`.repeat(80));
console.log("REPLACING ALL DEGREE STUDENTS WITH NEW DATA");
console.log(`=`.repeat(80));

// Assign seat numbers to new degree students (D1, D2, D3, ...)
const newDegreeBookings = newDegreeStudents.map((student, index) => {
  const seatNumber = index + 1;
  return {
    category: "Degree Students",
    seatNumber: seatNumber,
    userId: `D${seatNumber}`,
    userName: student.name,
    email: student.email,
    phone: student.phone,
    notes: student.notes,
  };
});

// Reassign seat numbers to existing college students (keep them, just renumber to be sequential)
const collegeStudentsMap = new Map();
existingCollegeStudents.forEach((student) => {
  const email = student.email?.toLowerCase().trim();
  if (email && !collegeStudentsMap.has(email)) {
    collegeStudentsMap.set(email, student);
  }
});

const uniqueCollegeStudents = Array.from(collegeStudentsMap.values());
const newCollegeBookings = uniqueCollegeStudents.map((student, index) => {
  const seatNumber = index + 1;
  return {
    category: "College Students",
    seatNumber: seatNumber,
    userId: `C${seatNumber}`,
    userName: student.userName,
    email: student.email,
    phone: student.phone,
    notes: student.notes,
  };
});

console.log(`\nNew degree students: ${newDegreeBookings.length}`);
console.log(`College students (preserved): ${newCollegeBookings.length}`);
console.log(
  `Total bookings: ${newDegreeBookings.length + newCollegeBookings.length}`
);

// Combine and write booked_seats.csv
const allBookings = [...newDegreeBookings, ...newCollegeBookings];
const csvContent = Papa.unparse(allBookings, {
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

fs.writeFileSync(bookedSeatsFile, csvContent, "utf-8");
console.log(`\n✅ Updated ${bookedSeatsFile}`);

// Update users.csv (both locations)
const usersData = allBookings.map((booking) => ({
  id: booking.userId,
  seatNumber: booking.seatNumber,
  name: booking.userName,
  email: booking.email,
  phone: booking.phone,
  category: booking.category,
}));

const usersCsvContent = Papa.unparse(usersData, {
  columns: ["id", "seatNumber", "name", "email", "phone", "category"],
});

fs.writeFileSync(usersFile, usersCsvContent, "utf-8");
fs.writeFileSync(publicUsersFile, usersCsvContent, "utf-8");

console.log(`✅ Updated ${usersFile}`);
console.log(`✅ Updated ${publicUsersFile}`);

// Create summary
const summary = {
  processedDate: new Date().toISOString(),
  newDegreeForm: {
    totalResponses: newDegreeData.length,
    validStudents: newDegreeStudents.length,
    duplicatesWithinNew: duplicatesWithinNew.length,
    skipped: skipped,
  },
  finalCounts: {
    degreeStudents: newDegreeBookings.length,
    collegeStudents: newCollegeBookings.length,
    totalBookings: allBookings.length,
  },
  changes: {
    oldDegreeCount: existingDegreeStudents.length,
    newDegreeCount: newDegreeBookings.length,
    difference: newDegreeBookings.length - existingDegreeStudents.length,
  },
};

const summaryFile = path.join(
  __dirname,
  "../data/degree_processing_summary.json"
);
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), "utf-8");
console.log(`\n✅ Created summary: ${summaryFile}`);

console.log(`\n${"=".repeat(80)}`);
console.log("SUMMARY");
console.log(`${"=".repeat(80)}`);
console.log(`Old degree students: ${existingDegreeStudents.length}`);
console.log(`New degree students: ${newDegreeBookings.length}`);
console.log(
  `Change: ${summary.changes.difference > 0 ? "+" : ""}${
    summary.changes.difference
  }`
);
console.log(`\nCollege students: ${newCollegeBookings.length} (preserved)`);
console.log(`\nTotal tickets now: ${allBookings.length}`);
console.log(`${"=".repeat(80)}`);
console.log("\n✅ Processing complete!");
console.log("\nNext steps:");
console.log("1. Review the summary in degree_processing_summary.json");
console.log("2. Delete old degree tickets: Remove-Item tickets\\ticket_D*.pdf");
console.log("3. Regenerate all tickets: node scripts\\generateTickets.js");
console.log("4. Verify and commit changes");
