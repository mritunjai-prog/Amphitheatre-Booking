const fs = require("fs");
const path = require("path");

// File paths
const collegeDataPath = path.join(
  __dirname,
  "../other-data/college-students-data.csv"
);
const usersPath = path.join(__dirname, "../data/users.csv");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

console.log("🔄 Fixing CSV formatting issues and rebuilding...\n");

// Read college students data
const collegeData = fs.readFileSync(collegeDataPath, "utf-8");
const collegeLines = collegeData.trim().split("\n");

// Parse CSV properly handling quoted fields
const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const collegeStudents = collegeLines.slice(1).map((line) => {
  const parts = parseCSVLine(line);
  // Clean phone number - remove quotes and extra spaces
  let phone = parts[4] || "";
  phone = phone.replace(/"/g, "").trim();

  return {
    seatNum: parts[0],
    enrollment: parts[1] || "",
    name: parts[2] || "",
    email: parts[3] || "",
    phone: phone,
    program: parts[5] || "",
  };
});

console.log(
  `📖 Read ${collegeStudents.length} college students from college-students-data.csv`
);

// Check for problematic entry
const riya = collegeStudents.find((s) => s.name.includes("Riya shrimali"));
if (riya) {
  console.log(`Found Riya Shrimali - Phone: ${riya.phone}`);
}

// STEP 1: Rebuild users.csv
console.log("\n🔨 Step 1: Rebuilding users.csv...");

const usersData = fs.readFileSync(usersPath, "utf-8");
const usersLines = usersData.trim().split("\n");
const usersHeader = usersLines[0];

// Keep only NON-college students
const nonCollegeUsers = usersLines.filter((line, index) => {
  if (index === 0) return true;
  const userId = line.split(",")[0];
  return !/^[0-9]+$/.test(userId);
});

console.log(`✅ Kept ${nonCollegeUsers.length - 1} non-college users`);

// Add ALL college students - properly escape phone numbers
const newCollegeUsers = collegeStudents.map((student) => {
  // If phone has comma, wrap in quotes
  let phoneField = student.phone;
  if (phoneField.includes(",")) {
    phoneField = `"${phoneField}"`;
  }
  return `${student.seatNum},${student.name},College Students,${student.email},${phoneField}`;
});

const updatedUsersData =
  nonCollegeUsers.join("\n") + "\n" + newCollegeUsers.join("\n") + "\n";
fs.writeFileSync(usersPath, updatedUsersData);
fs.writeFileSync(publicUsersPath, updatedUsersData);

console.log(`✅ Added ${newCollegeUsers.length} college students to users.csv`);

// STEP 2: Rebuild booked_seats.csv
console.log("\n🔨 Step 2: Rebuilding booked_seats.csv...");

const bookedSeatsData = fs.readFileSync(bookedSeatsPath, "utf-8");
const bookedSeatsLines = bookedSeatsData.trim().split("\n");

// Keep only NON-college students
const nonCollegeBookings = bookedSeatsLines.filter((line) => {
  return !line.startsWith("College Students,");
});

console.log(`✅ Kept ${nonCollegeBookings.length - 1} non-college bookings`);

// Add ALL college students - properly escape phone numbers
const newCollegeBookings = collegeStudents.map((student) => {
  // If phone has comma, wrap in quotes
  let phoneField = student.phone;
  if (phoneField.includes(",")) {
    phoneField = `"${phoneField}"`;
  }
  return `College Students,${student.seatNum},${student.seatNum},${student.name},${student.email},${phoneField},`;
});

const updatedBookedSeatsData =
  nonCollegeBookings.join("\n") + "\n" + newCollegeBookings.join("\n") + "\n";
fs.writeFileSync(bookedSeatsPath, updatedBookedSeatsData);
fs.writeFileSync(publicBookedSeatsPath, updatedBookedSeatsData);

console.log(`✅ Added ${newCollegeBookings.length} college seat assignments`);

// STEP 3: Verify
console.log("\n📊 Verification:");
const finalBookedData = fs.readFileSync(bookedSeatsPath, "utf-8");
const finalCollegeCount = (finalBookedData.match(/^College Students,/gm) || [])
  .length;
console.log(`College students in booked_seats.csv: ${finalCollegeCount}`);

// Check line 517 specifically
const lines = finalBookedData.split("\n");
const line517 = lines[516];
console.log(`\nLine 517: ${line517}`);

// Check if seat 278 exists
const seat278 = lines.find((l) => l.startsWith("College Students,278,"));
console.log(`Seat 278: ${seat278}`);

console.log("\n✅ FIXED! CSV properly formatted with escaped phone numbers.");
