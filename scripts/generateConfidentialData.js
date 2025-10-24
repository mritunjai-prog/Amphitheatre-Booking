const fs = require("fs");
const Papa = require("papaparse");

// Read the booked_seats.csv
const csvContent = fs.readFileSync("data/booked_seats.csv", "utf8");
const { data: allSeats } = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
});

// Filter only degree students
const degreeStudents = allSeats.filter(
  (seat) => seat.category === "Degree Students"
);

console.log(`\n📊 Processing ${degreeStudents.length} Degree Students\n`);

// Function to extract degree type from notes
function getDegreeType(notes) {
  if (!notes) return "Unknown";

  const notesLower = notes.toLowerCase();

  if (
    notesLower.includes("doctor of philosophy") ||
    notesLower.includes("ph.d") ||
    notesLower.includes("phd")
  ) {
    return "Doctor of Philosophy (Ph.D.)";
  } else if (
    notesLower.includes("master of technology") ||
    notesLower.includes("m.tech") ||
    notesLower.includes("mtech")
  ) {
    return "Master of Technology (M.Tech)";
  } else if (
    notesLower.includes("master of business administration") ||
    notesLower.includes("mba")
  ) {
    return "Master of Business Administration (MBA)";
  } else if (
    notesLower.includes("master of computer applications") ||
    notesLower.includes("mca")
  ) {
    return "Master of Computer Applications (MCA)";
  } else if (
    notesLower.includes("bachelor of technology") ||
    notesLower.includes("b.tech") ||
    notesLower.includes("btech")
  ) {
    return "Bachelor of Technology (B.Tech)";
  } else if (
    notesLower.includes("bachelor of business administration") ||
    notesLower.includes("bba")
  ) {
    return "Bachelor of Business Administration (BBA)";
  } else {
    return "Other Degree";
  }
}

// Create simplified confidential data
const confidentialData = degreeStudents.map((student) => ({
  seatNumber: student.seatNumber,
  name: student.userName,
  phone: student.phone,
  degree: getDegreeType(student.notes),
}));

// Convert to CSV with proper formatting
const csvOutput = Papa.unparse(confidentialData, {
  columns: ["seatNumber", "name", "phone", "degree"],
  header: true,
});

// Save to confidential-data folder
const confidentialFolder = "confidential-data";
if (!fs.existsSync(confidentialFolder)) {
  fs.mkdirSync(confidentialFolder);
}

fs.writeFileSync(
  `${confidentialFolder}/degree-students-confidential.csv`,
  csvOutput
);

console.log("✅ Created: confidential-data/degree-students-confidential.csv");
console.log(`   Contains: ${confidentialData.length} degree students\n`);

// Count by degree
const degreeCount = {};
confidentialData.forEach((s) => {
  degreeCount[s.degree] = (degreeCount[s.degree] || 0) + 1;
});

console.log("📊 Breakdown by Degree:");
Object.keys(degreeCount)
  .sort()
  .forEach((degree) => {
    console.log(`   ${degree}: ${degreeCount[degree]} students`);
  });

console.log(
  "\n📁 File location: confidential-data/degree-students-confidential.csv"
);
console.log("📋 Columns: Seat Number, Name, Phone Number, Degree");
console.log("\n🔒 This file contains confidential student information.");
console.log("   Please handle with care and restrict access appropriately.\n");
