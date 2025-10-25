const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

// File paths
const BOOKED_SEATS_CSV = path.join(__dirname, "../data/booked_seats.csv");
const USERS_CSV = path.join(__dirname, "../data/users.csv");
const PUBLIC_USERS_CSV = path.join(__dirname, "../public/data/users.csv");

console.log("🔧 Fixing users.csv - Adding degree students...\n");

// Read booked_seats.csv
const bookedSeatsData = fs.readFileSync(BOOKED_SEATS_CSV, "utf8");
const parsedBookedSeats = Papa.parse(bookedSeatsData, {
  header: true,
  skipEmptyLines: true,
});

// Extract degree students
const degreeStudents = parsedBookedSeats.data.filter(
  (row) => row.category === "Degree Students" && row.seatNumber
);

console.log(
  `✅ Found ${degreeStudents.length} degree students in booked_seats.csv`
);

// Read existing users.csv
const usersData = fs.readFileSync(USERS_CSV, "utf8");
const parsedUsers = Papa.parse(usersData, {
  header: true,
  skipEmptyLines: true,
});

console.log(`✅ Found ${parsedUsers.data.length} existing users in users.csv`);

// Check for duplicates - remove degree students if they exist
const existingUsers = parsedUsers.data.filter(
  (user) => !user.id.startsWith("D") || !user.id.match(/^D\d+$/)
);

console.log(`✅ Filtered to ${existingUsers.length} non-degree users`);

// Create new users array
const allUsers = [...existingUsers];

// Add degree students to users
degreeStudents.forEach((student) => {
  allUsers.push({
    id: student.userId,
    name: student.userName,
    email: student.email,
    phone: student.phone,
    category: "Degree Students",
  });
});

console.log(
  `\n📊 Total users after adding degree students: ${allUsers.length}`
);
console.log(`   - Degree Students: ${degreeStudents.length}`);
console.log(`   - Other Users: ${existingUsers.length}`);

// Check for duplicates in college students
const collegeStudents = allUsers.filter(
  (u) => !u.category || u.category === "" || u.category === "College Students"
);
const emails = collegeStudents.map((u) => u.email?.toLowerCase());
const duplicateEmails = emails.filter(
  (email, index) => emails.indexOf(email) !== index && email
);

if (duplicateEmails.length > 0) {
  console.log(
    `\n⚠️  Found ${duplicateEmails.length} duplicate emails in college students:`
  );
  duplicateEmails.slice(0, 5).forEach((email) => console.log(`   - ${email}`));
}

// Write updated users.csv
const usersCSV = Papa.unparse(allUsers, {
  columns: ["id", "name", "email", "phone", "category"],
  header: true,
});

fs.writeFileSync(USERS_CSV, usersCSV);
fs.writeFileSync(PUBLIC_USERS_CSV, usersCSV);

console.log("\n✅ Updated: data/users.csv");
console.log("✅ Updated: public/data/users.csv");

// Show sample degree students
console.log("\n📋 Sample Degree Students added:");
degreeStudents.slice(0, 5).forEach((s) => {
  console.log(`   ${s.userId}: ${s.userName}`);
});

console.log("\n" + "=".repeat(60));
console.log("✅ USERS.CSV FIXED!");
console.log("=".repeat(60));
console.log("\n📝 Degree students should now show as BOOKED on localhost!");
console.log("   Refresh your browser (Ctrl+F5) to see the changes.\n");
