const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("📋 Updating CSV headers to be neat and readable...\n");

// File paths
const files = [
  {
    path: path.join(
      __dirname,
      "../other-data/degree-students-confidential.csv"
    ),
    name: "degree-students-confidential.csv",
    columns: {
      seatNumber: "Seat Number",
      name: "Name",
      phone: "Phone Number",
      degree: "Degree",
    },
  },
  {
    path: path.join(__dirname, "../other-data/college-students-data.csv"),
    name: "college-students-data.csv",
    columns: {
      seatNumber: "Seat Number",
      enrollmentNumber: "Enrollment Number",
      name: "Name",
      email: "Email Address",
      phone: "Phone Number",
      program: "Program/Branch",
    },
  },
  {
    path: path.join(__dirname, "../other-data/male-college-students.csv"),
    name: "male-college-students.csv",
    columns: {
      seatNumber: "Seat Number",
      name: "Name",
      email: "Email Address",
      degree: "Program/Branch",
      enrollmentNumber: "Enrollment Number",
      dayScholarOrHosteller: "Day Scholar/Hosteller",
    },
  },
  {
    path: path.join(__dirname, "../other-data/female-college-students.csv"),
    name: "female-college-students.csv",
    columns: {
      seatNumber: "Seat Number",
      name: "Name",
      email: "Email Address",
      degree: "Program/Branch",
      enrollmentNumber: "Enrollment Number",
      dayScholarOrHosteller: "Day Scholar/Hosteller",
    },
  },
];

files.forEach((file) => {
  if (!fs.existsSync(file.path)) {
    console.log(`⚠️  Skipping ${file.name} - file not found`);
    return;
  }

  // Read the CSV
  const csvContent = fs.readFileSync(file.path, "utf8");
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`📄 Processing ${file.name}...`);
  console.log(`   Records: ${parsed.data.length}`);

  // Get the column order from the columns config
  const columnOrder = Object.keys(file.columns);

  // Create new CSV with readable headers
  const csvOutput = Papa.unparse(parsed.data, {
    columns: columnOrder,
    header: true,
  });

  // Replace the old headers with new readable ones
  const lines = csvOutput.split("\n");
  const oldHeader = lines[0];
  const newHeader = columnOrder.map((col) => file.columns[col]).join(",");
  lines[0] = newHeader;

  const finalCSV = lines.join("\n");

  // Write back to file
  fs.writeFileSync(file.path, finalCSV);

  console.log(`   ✅ Updated headers: ${newHeader}`);
  console.log("");
});

console.log("✅ All CSV files updated with clean, readable headers!\n");
console.log("📋 Header Format Examples:");
console.log("   • Seat Number (not seatNumber)");
console.log("   • Enrollment Number (not enrollmentNumber)");
console.log("   • Email Address (not email)");
console.log("   • Phone Number (not phone)");
console.log("   • Program/Branch (not degree/program)");
console.log("   • Day Scholar/Hosteller (not dayScholarOrHosteller)\n");
