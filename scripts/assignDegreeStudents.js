// Script to assign seats to degree-awarding students from CSV
const fs = require("fs");
const path = require("path");

// Read the CSV file
const csvFilePath = path.join(
  __dirname,
  "../data/Data base Convocation 12 till date.csv"
);
const outputPath = path.join(__dirname, "../data/booked_seats.csv");
const usersOutputPath = path.join(__dirname, "../data/users.csv");

// Parse the CSV manually (simple parsing)
const csvContent = fs.readFileSync(csvFilePath, "utf-8");
const lines = csvContent.split("\n");

const students = [];
let currentDegree = "";
let studentIdCounter = 1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Skip empty lines
  if (!line) continue;

  // Detect degree section headers
  if (line.includes("Degree :Master of Technology")) {
    currentDegree = "M.Tech";
    continue;
  } else if (line.includes("Degree :Master  Computer Application")) {
    currentDegree = "MCA";
    continue;
  } else if (line.includes("Degree :Bachelor of Technology")) {
    currentDegree = "B.Tech";
    continue;
  } else if (line.includes("Degree :MBA")) {
    currentDegree = "MBA";
    continue;
  } else if (line.includes("Degree :Doctor of Philosophy")) {
    currentDegree = "PhD";
    continue;
  } else if (line.includes("Degree :BBA")) {
    currentDegree = "BBA";
    continue;
  }

  // Skip header lines
  if (
    line.includes("Attendance Form") ||
    line.includes("Sr. No") ||
    line.includes("Name of Student") ||
    line.includes("M.Tech------") ||
    line.includes("MCA-------") ||
    line.includes("PhD-----") ||
    line.includes("BBA-----")
  ) {
    continue;
  }

  // Parse student data
  const parts = line.split(",");
  if (parts.length >= 4 && currentDegree) {
    const srNo = parts[0].trim();
    const name = parts[1].trim();
    const enrollment = parts[2].trim();
    const mobile = parts[3].trim();

    // Validate that it's a student row (sr no should be a number)
    if (srNo && !isNaN(parseInt(srNo)) && name && enrollment && mobile) {
      students.push({
        id: studentIdCounter++,
        name: name,
        email: `${enrollment.toLowerCase().replace(/\s+/g, "")}@example.com`,
        phone: mobile.replace(/\s+/g, ""),
        category: "Degree Students",
        enrollmentNo: enrollment,
        degree: currentDegree,
      });
    }
  }
}

console.log(`\nTotal students parsed: ${students.length}`);
console.log("\nBreakdown by degree:");
const degreeCount = {};
students.forEach((s) => {
  degreeCount[s.degree] = (degreeCount[s.degree] || 0) + 1;
});
Object.keys(degreeCount).forEach((degree) => {
  console.log(`  ${degree}: ${degreeCount[degree]}`);
});

// Generate seat assignments (D1, D2, D3, ... D175)
const bookedSeats = [];
students.forEach((student, index) => {
  const seatNumber = `D${index + 1}`;
  bookedSeats.push({
    category: "Degree Students",
    seatNumber: seatNumber,
    userId: student.id,
    userName: student.name,
    email: student.email,
    phone: student.phone,
    notes: `${student.degree} - ${student.enrollmentNo}`,
  });
});

// Create CSV content for booked_seats.csv
const bookedSeatsHeader =
  "category,seatNumber,userId,userName,email,phone,notes\n";
const bookedSeatsRows = bookedSeats
  .map(
    (seat) =>
      `"${seat.category}","${seat.seatNumber}",${seat.userId},"${seat.userName}","${seat.email}","${seat.phone}","${seat.notes}"`
  )
  .join("\n");

const bookedSeatsCSV = bookedSeatsHeader + bookedSeatsRows;

// Create CSV content for users.csv
const usersHeader = "id,name,email,phone,category\n";
const usersRows = students
  .map(
    (user) =>
      `${user.id},"${user.name}","${user.email}","${user.phone}","${user.category}"`
  )
  .join("\n");

const usersCSV = usersHeader + usersRows;

// Write to files
fs.writeFileSync(outputPath, bookedSeatsCSV, "utf-8");
fs.writeFileSync(usersOutputPath, usersCSV, "utf-8");

console.log(`\n✅ Successfully created seat assignments!`);
console.log(`\nFiles updated:`);
console.log(`  - ${outputPath}`);
console.log(`  - ${usersOutputPath}`);
console.log(`\nSeat assignments: D1 to D${students.length}`);
console.log(`\nSample assignments:`);
bookedSeats.slice(0, 5).forEach((seat) => {
  console.log(`  ${seat.seatNumber}: ${seat.userName} (${seat.notes})`);
});
console.log(`  ...`);
console.log(
  `  ${bookedSeats[bookedSeats.length - 1].seatNumber}: ${
    bookedSeats[bookedSeats.length - 1].userName
  } (${bookedSeats[bookedSeats.length - 1].notes})`
);
