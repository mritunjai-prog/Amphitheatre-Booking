const fs = require("fs");
const Papa = require("papaparse");

// Read the booked_seats.csv
const csvContent = fs.readFileSync("data/booked_seats.csv", "utf8");
const { data: allSeats } = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
});

// Filter college students only
const collegeStudents = allSeats.filter(
  (seat) => seat.category === "College Students"
);

console.log(`\n📊 Processing ${collegeStudents.length} College Students\n`);

// Function to extract degree/program from notes
function getDegreeProgram(notes) {
  if (!notes) return "Not Specified";

  // Extract the program name after the hyphen or pipe
  const parts = notes.split(/[-|]/);
  if (parts.length >= 2) {
    return parts[1].trim();
  }

  return notes.trim();
}

// Create data for college students (keeping original order - already alphabetical)
const collegeData = collegeStudents.map((student) => ({
  seatNumber: student.seatNumber,
  name: student.userName,
  email: student.email,
  phone: student.phone,
  program: getDegreeProgram(student.notes),
}));

// Convert to CSV with proper formatting
const csvOutput = Papa.unparse(collegeData, {
  columns: ["seatNumber", "name", "email", "phone", "program"],
  header: true,
});

// Save to other-data folder
const dataFolder = "other-data";
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
}

fs.writeFileSync(`${dataFolder}/college-students-data.csv`, csvOutput);

console.log("✅ Created: other-data/college-students-data.csv");
console.log(`   Contains: ${collegeData.length} college students\n`);

// Show first and last 10 students
console.log("📝 First 10 College Students:");
collegeData.slice(0, 10).forEach((s, i) => {
  console.log(`   ${i + 1}. ${s.seatNumber}: ${s.name}`);
});

console.log("\n📝 Last 10 College Students:");
collegeData.slice(-10).forEach((s, i) => {
  const actualIndex = collegeData.length - 10 + i;
  console.log(`   ${actualIndex + 1}. ${s.seatNumber}: ${s.name}`);
});

console.log("\n📁 File location: other-data/college-students-data.csv");
console.log("📋 Columns: Seat Number, Name, Email, Phone Number, Program");
console.log("\n✅ College students data generated successfully.\n");
