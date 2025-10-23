const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const newDegreeFile = path.join(__dirname, "../data/NEW DEGREE AWARDING.csv");
const bookedSeatsFile = path.join(__dirname, "../data/booked_seats.csv");
const usersFile = path.join(__dirname, "../data/users.csv");
const publicUsersFile = path.join(__dirname, "../public/data/users.csv");

console.log("=".repeat(80));
console.log("PROCESSING 196 UNIQUE DEGREE STUDENTS (BY EMAIL)");
console.log("=".repeat(80));

// Read new degree awarding form
const newDegreeContent = fs.readFileSync(newDegreeFile, "utf-8");
const newDegreeData = Papa.parse(newDegreeContent, { header: true }).data;

console.log(`\nTotal responses in new form: ${newDegreeData.length}`);

// Read existing booked seats
const bookedSeatsContent = fs.readFileSync(bookedSeatsFile, "utf-8");
const existingBookings = Papa.parse(bookedSeatsContent, { header: true }).data;

const existingCollegeStudents = existingBookings.filter(
  (row) => row.category === "College Students"
);

console.log(`Existing college students: ${existingCollegeStudents.length}`);

// Process new degree students - keep first occurrence by email
const newDegreeStudents = [];
const duplicatesRemoved = [];
const enrollmentConflicts = [];
const emailMap = new Map();
const enrollmentMap = new Map();
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
  const rowNum = index + 2; // +2 because index starts at 0 and there's a header

  const entry = { rowNum, name, enrollment, email, phone, degree };

  // Check for email duplicate
  if (email && emailMap.has(email)) {
    const firstEntry = emailMap.get(email);
    duplicatesRemoved.push({
      type: "Duplicate Submission",
      first: firstEntry,
      duplicate: entry,
      reason:
        firstEntry.name === entry.name
          ? "Same person submitted twice"
          : "Different people with same email",
    });
    return;
  }

  // Check for enrollment conflict (different person, same enrollment)
  if (enrollment && enrollmentMap.has(enrollment.toUpperCase())) {
    const firstEntry = enrollmentMap.get(enrollment.toUpperCase());
    if (firstEntry.name !== entry.name) {
      enrollmentConflicts.push({
        first: firstEntry,
        second: entry,
        enrollment: enrollment.toUpperCase(),
      });
    }
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

  // Track for duplicate detection
  if (email) emailMap.set(email, entry);
  if (enrollment) enrollmentMap.set(enrollment.toUpperCase(), entry);
});

console.log(`\n--- Processing Results ---`);
console.log(`Valid degree students: ${newDegreeStudents.length}`);
console.log(`Duplicates removed: ${duplicatesRemoved.length}`);
console.log(`Enrollment conflicts: ${enrollmentConflicts.length}`);
console.log(`Skipped (empty rows): ${skipped}`);

// Display duplicates removed
if (duplicatesRemoved.length > 0) {
  console.log(`\n${"=".repeat(80)}`);
  console.log("DUPLICATES REMOVED (5 students who submitted twice)");
  console.log("=".repeat(80));

  duplicatesRemoved.forEach((dup, i) => {
    console.log(`\n${i + 1}. ${dup.reason.toUpperCase()}`);
    console.log(
      `   First: Row ${dup.first.rowNum} - ${dup.first.name} (${dup.first.enrollment})`
    );
    console.log(`          Email: ${dup.first.email}`);
    console.log(
      `   Removed: Row ${dup.duplicate.rowNum} - ${dup.duplicate.name} (${dup.duplicate.enrollment})`
    );
    console.log(`            Email: ${dup.duplicate.email}`);
    console.log(`   ✓ KEPT: ${dup.first.name} - First submission`);
  });
}

// Display enrollment conflicts
if (enrollmentConflicts.length > 0) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(
    "ENROLLMENT CONFLICTS (2 cases - different people, same enrollment)"
  );
  console.log("=".repeat(80));

  enrollmentConflicts.forEach((conflict, i) => {
    console.log(
      `\n${i + 1}. CONFLICT: Both assigned enrollment ${conflict.enrollment}`
    );
    console.log(
      `   Person A: Row ${conflict.first.rowNum} - ${conflict.first.name}`
    );
    console.log(`             Email: ${conflict.first.email}`);
    console.log(`             Degree: ${conflict.first.degree}`);
    console.log(
      `   Person B: Row ${conflict.second.rowNum} - ${conflict.second.name}`
    );
    console.log(`             Email: ${conflict.second.email}`);
    console.log(`             Degree: ${conflict.second.degree}`);
    console.log(`   ⚠️  ACTION REQUIRED: Manual verification needed`);
    console.log(
      `   ✓ BOTH KEPT: Will receive separate tickets with same enrollment`
    );
  });
}

console.log(`\n${"=".repeat(80)}`);
console.log("REPLACING ALL DEGREE STUDENTS WITH NEW DATA");
console.log(`${"=".repeat(80)}`);

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

// Keep existing college students
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
    duplicatesRemoved: duplicatesRemoved.length,
    enrollmentConflicts: enrollmentConflicts.length,
    skipped: skipped,
  },
  finalCounts: {
    degreeStudents: newDegreeBookings.length,
    collegeStudents: newCollegeBookings.length,
    totalBookings: allBookings.length,
  },
  duplicates: duplicatesRemoved.map((d) => ({
    kept: `${d.first.name} (Row ${d.first.rowNum})`,
    removed: `${d.duplicate.name} (Row ${d.duplicate.rowNum})`,
    reason: d.reason,
  })),
  conflicts: enrollmentConflicts.map((c) => ({
    enrollment: c.enrollment,
    personA: `${c.first.name} (${c.first.email})`,
    personB: `${c.second.name} (${c.second.email})`,
    note: "Both kept - manual verification needed",
  })),
};

const summaryFile = path.join(
  __dirname,
  "../data/degree_processing_summary.json"
);
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), "utf-8");
console.log(`\n✅ Created summary: ${summaryFile}`);

console.log(`\n${"=".repeat(80)}`);
console.log("FINAL SUMMARY");
console.log(`${"=".repeat(80)}`);
console.log(`Degree students: ${newDegreeBookings.length} (unique by email)`);
console.log(`College students: ${newCollegeBookings.length} (preserved)`);
console.log(`Total tickets: ${allBookings.length}`);
console.log(`\nSeat Capacity:`);
console.log(
  `  Degree: ${newDegreeBookings.length}/210 (${
    210 - newDegreeBookings.length
  } remaining)`
);
console.log(
  `  College: ${newCollegeBookings.length}/578 (${
    578 - newCollegeBookings.length
  } remaining)`
);
console.log(
  `  Total: ${allBookings.length}/788 (${(
    (allBookings.length / 788) *
    100
  ).toFixed(1)}% utilization)`
);
console.log(`${"=".repeat(80)}`);
console.log("\n✅ Processing complete!");
console.log("\nNext steps:");
console.log("1. Review conflicts above");
console.log("2. Delete old degree tickets: Remove-Item tickets\\ticket_D*.pdf");
console.log("3. Regenerate all tickets: node scripts\\generateTickets.js");
