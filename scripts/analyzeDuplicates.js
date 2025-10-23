const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const newDegreeFile = path.join(__dirname, "../data/NEW DEGREE AWARDING.csv");

console.log("=".repeat(80));
console.log("ANALYZING DUPLICATES IN NEW DEGREE AWARDING FORM");
console.log("=".repeat(80));

// Read new degree awarding form
const newDegreeContent = fs.readFileSync(newDegreeFile, "utf-8");
const newDegreeData = Papa.parse(newDegreeContent, { header: true }).data;

console.log(`\nTotal rows in CSV: ${newDegreeData.length}`);

// Track all entries
const allEntries = [];
const duplicatesFound = [];
const emailMap = new Map();
const enrollmentMap = new Map();

newDegreeData.forEach((row, index) => {
  if (!row["Name of the Student"] || row["Name of the Student"].trim() === "") {
    return;
  }

  const name = row["Name of the Student"].trim();
  const enrollment = row["Enrollment No.  "]?.trim() || "";
  const email =
    row["Enter Your Email ID\n(Personal Email ID for the future reference)"]
      ?.toLowerCase()
      .trim() || "";

  const entry = { rowNum: index + 2, name, enrollment, email };

  // Check for duplicates
  if (email && emailMap.has(email)) {
    duplicatesFound.push({
      type: "email",
      first: emailMap.get(email),
      duplicate: entry,
    });
  } else if (email) {
    emailMap.set(email, entry);
  }

  if (enrollment && enrollmentMap.has(enrollment.toUpperCase())) {
    duplicatesFound.push({
      type: "enrollment",
      first: enrollmentMap.get(enrollment.toUpperCase()),
      duplicate: entry,
    });
  } else if (enrollment) {
    enrollmentMap.set(enrollment.toUpperCase(), entry);
  }

  allEntries.push(entry);
});

console.log(`\nTotal valid entries: ${allEntries.length}`);
console.log(`Unique by email: ${emailMap.size}`);
console.log(`Unique by enrollment: ${enrollmentMap.size}`);
console.log(`\nDuplicates found: ${duplicatesFound.length}`);

if (duplicatesFound.length > 0) {
  console.log(`\n${"=".repeat(80)}`);
  console.log("DUPLICATE DETAILS");
  console.log("=".repeat(80));

  duplicatesFound.forEach((dup, i) => {
    console.log(`\n--- Duplicate ${i + 1} (${dup.type}) ---`);
    console.log(`First occurrence (Row ${dup.first.rowNum}):`);
    console.log(`  Name: ${dup.first.name}`);
    console.log(`  Enrollment: ${dup.first.enrollment}`);
    console.log(`  Email: ${dup.first.email}`);
    console.log(`Duplicate (Row ${dup.duplicate.rowNum}):`);
    console.log(`  Name: ${dup.duplicate.name}`);
    console.log(`  Enrollment: ${dup.duplicate.enrollment}`);
    console.log(`  Email: ${dup.duplicate.email}`);

    // Check if it's the exact same person or different person with same email
    if (dup.first.name === dup.duplicate.name) {
      console.log(`  ⚠️  SAME PERSON - submitted twice`);
    } else {
      console.log(`  ⚠️  DIFFERENT PEOPLE - shared ${dup.type}`);
    }
  });
}

console.log(`\n${"=".repeat(80)}`);
console.log(
  `RECOMMENDATION: Should we have ${allEntries.length} or ${emailMap.size} degree students?`
);
console.log("=".repeat(80));
