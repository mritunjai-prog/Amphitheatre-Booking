const fs = require("fs");
const Papa = require("papaparse");

// Read the booked_seats.csv
const csvContent = fs.readFileSync("data/booked_seats.csv", "utf8");
const { data: allSeats } = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
});

// Separate degree students from others
const degreeStudents = allSeats.filter(
  (seat) => seat.category === "Degree Students"
);
const collegeStudents = allSeats.filter(
  (seat) => seat.category === "College Students"
);

console.log(`\n📊 Found ${degreeStudents.length} Degree Students`);
console.log(`📊 Found ${collegeStudents.length} College Students\n`);

// Function to extract degree type from notes
function getDegreeType(notes) {
  if (!notes) return "Unknown";

  const notesLower = notes.toLowerCase();

  if (
    notesLower.includes("doctor of philosophy") ||
    notesLower.includes("ph.d") ||
    notesLower.includes("phd")
  ) {
    return "PhD";
  } else if (
    notesLower.includes("master of technology") ||
    notesLower.includes("m.tech") ||
    notesLower.includes("mtech")
  ) {
    return "M.Tech";
  } else if (
    notesLower.includes("master of business administration") ||
    notesLower.includes("mba")
  ) {
    return "MBA";
  } else if (
    notesLower.includes("master of computer applications") ||
    notesLower.includes("mca")
  ) {
    return "MCA";
  } else if (
    notesLower.includes("bachelor of technology") ||
    notesLower.includes("b.tech") ||
    notesLower.includes("btech")
  ) {
    return "B.Tech";
  } else if (
    notesLower.includes("bachelor of business administration") ||
    notesLower.includes("bba")
  ) {
    return "BBA";
  } else {
    return "Other";
  }
}

// Add degree type to each student
degreeStudents.forEach((student) => {
  student.degreeType = getDegreeType(student.notes);
});

// Count by degree type
const degreeCount = {};
degreeStudents.forEach((s) => {
  degreeCount[s.degreeType] = (degreeCount[s.degreeType] || 0) + 1;
});

console.log("📋 Degree Distribution:");
console.log(`   PhD: ${degreeCount["PhD"] || 0}`);
console.log(`   M.Tech: ${degreeCount["M.Tech"] || 0}`);
console.log(`   MBA: ${degreeCount["MBA"] || 0}`);
console.log(`   MCA: ${degreeCount["MCA"] || 0}`);
console.log(`   B.Tech: ${degreeCount["B.Tech"] || 0}`);
console.log(`   BBA: ${degreeCount["BBA"] || 0}`);
console.log(`   Other: ${degreeCount["Other"] || 0}\n`);

// Define degree priority order
const degreePriority = {
  PhD: 1,
  "M.Tech": 2,
  MBA: 3,
  MCA: 4,
  "B.Tech": 5,
  BBA: 6,
  Other: 7,
};

// Sort by degree priority, then alphabetically by name
degreeStudents.sort((a, b) => {
  // First sort by degree priority
  const priorityDiff =
    degreePriority[a.degreeType] - degreePriority[b.degreeType];
  if (priorityDiff !== 0) return priorityDiff;

  // Then sort alphabetically by name
  return a.userName.localeCompare(b.userName);
});

console.log("✅ Sorted degree students by:");
console.log("   1. Degree: PhD → M.Tech → MBA → MCA → B.Tech → BBA");
console.log("   2. Name: Alphabetically within each degree\n");

// Reassign seat numbers D1, D2, D3...
degreeStudents.forEach((student, index) => {
  const newSeatNumber = `D${index + 1}`;
  student.seatNumber = newSeatNumber;
  student.userId = newSeatNumber;
});

// Show first 10 and last 10 for verification
console.log("📝 First 10 Degree Students (after sorting):");
degreeStudents.slice(0, 10).forEach((s, i) => {
  console.log(`   ${i + 1}. ${s.seatNumber}: ${s.userName} (${s.degreeType})`);
});

console.log("\n📝 Last 10 Degree Students (after sorting):");
degreeStudents.slice(-10).forEach((s, i) => {
  const actualIndex = degreeStudents.length - 10 + i;
  console.log(
    `   ${actualIndex + 1}. ${s.seatNumber}: ${s.userName} (${s.degreeType})`
  );
});

// Combine back with college students
const reorderedSeats = [...degreeStudents, ...collegeStudents];

// Convert to CSV
const csvOutput = Papa.unparse(reorderedSeats, {
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

// Save to files
fs.writeFileSync("data/booked_seats.csv", csvOutput);
fs.writeFileSync("public/data/booked_seats.csv", csvOutput);

console.log("\n✅ Updated booked_seats.csv with new seat order");

// Update users.csv as well
const usersData = reorderedSeats.map((seat) => ({
  id: seat.userId,
  seatNumber: seat.seatNumber,
  name: seat.userName,
  email: seat.email,
  phone: seat.phone,
  category: seat.category,
}));

const usersCsv = Papa.unparse(usersData, {
  columns: ["id", "seatNumber", "name", "email", "phone", "category"],
});

fs.writeFileSync("data/users.csv", usersCsv);
fs.writeFileSync("public/data/users.csv", usersCsv);

console.log("✅ Updated users.csv with new seat order\n");

// Show breakdown by degree
console.log("📊 Final Seat Allocation by Degree:");
let currentSeat = 1;
["PhD", "M.Tech", "MBA", "MCA", "B.Tech", "BBA", "Other"].forEach((degree) => {
  const count = degreeCount[degree] || 0;
  if (count > 0) {
    const endSeat = currentSeat + count - 1;
    console.log(
      `   ${degree}: D${currentSeat}-D${endSeat} (${count} students)`
    );
    currentSeat = endSeat + 1;
  }
});

console.log("\n🎉 Seat reordering complete!");
console.log(
  "   Seats are now organized by degree priority and alphabetically sorted."
);
