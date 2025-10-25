const fs = require("fs");
const path = require("path");

const registrationPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);
const oldDegreePath = path.join(__dirname, "../data/NEW DEGREE AWARDING.csv");

console.log("📖 Reading NEW registration data...");
const newContent = fs.readFileSync(registrationPath, "utf-8");
const newLines = newContent
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());

const newStudents = [];
newLines.forEach((line) => {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());

  const name = fields[2];
  const enrollment = fields[3];

  if (name && enrollment) {
    newStudents.push({ name, enrollment });
  }
});

console.log(`✅ New registration file: ${newStudents.length} students\n`);

console.log("📖 Reading OLD degree data...");
const oldContent = fs.readFileSync(oldDegreePath, "utf-8");
const oldLines = oldContent
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());

const oldStudents = [];
oldLines.forEach((line) => {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());

  const name = fields[1]; // Name is in column 2 (index 1)
  const enrollment = fields[2]; // Enrollment is in column 3 (index 2)

  if (name && enrollment) {
    oldStudents.push({ name, enrollment });
  }
});

console.log(`✅ Old degree file: ${oldStudents.length} students\n`);

// Find students in old but not in new
const newEnrollments = new Set(
  newStudents.map((s) => s.enrollment.toLowerCase().trim())
);
const missingFromNew = oldStudents.filter(
  (s) => !newEnrollments.has(s.enrollment.toLowerCase().trim())
);

if (missingFromNew.length > 0) {
  console.log(
    `❌ Students in OLD file but MISSING from NEW file: ${missingFromNew.length}\n`
  );
  missingFromNew.forEach((s, i) => {
    console.log(`${i + 1}. ${s.name} (${s.enrollment})`);
  });
} else {
  console.log("✅ All old students are present in new file\n");
}

// Find students in new but not in old
const oldEnrollments = new Set(
  oldStudents.map((s) => s.enrollment.toLowerCase().trim())
);
const addedInNew = newStudents.filter(
  (s) => !oldEnrollments.has(s.enrollment.toLowerCase().trim())
);

if (addedInNew.length > 0) {
  console.log(
    `\n✨ NEW students ADDED in registration file: ${addedInNew.length}\n`
  );
  addedInNew.forEach((s, i) => {
    console.log(`${i + 1}. ${s.name} (${s.enrollment})`);
  });
}

console.log(`\n📊 Summary:`);
console.log(`  Old file: ${oldStudents.length} students`);
console.log(`  New file: ${newStudents.length} students`);
console.log(
  `  Difference: ${newStudents.length - oldStudents.length} students`
);
