import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔄 Syncing booked_seats.csv from Downloads...\n");

// Paths
const downloadsPath = path.join(os.homedir(), "Downloads", "booked_seats.csv");
const dataPath = path.join(__dirname, "../data/booked_seats.csv");
const publicDataPath = path.join(__dirname, "../public/data/booked_seats.csv");

// Check if downloaded file exists
if (!fs.existsSync(downloadsPath)) {
  console.log("❌ No booked_seats.csv found in Downloads folder!");
  console.log(`   Expected: ${downloadsPath}\n`);
  console.log("📝 Steps to create the file:");
  console.log("   1. Open http://localhost:3000");
  console.log("   2. Make your manual seat assignments");
  console.log('   3. Click "💾 Save to CSV" button');
  console.log("   4. Run this script again\n");
  process.exit(1);
}

// Read the downloaded file
const downloadedContent = fs.readFileSync(downloadsPath, "utf-8");
const lines = downloadedContent.trim().split("\n");

// Count assignments by category
const vipAssignments = lines.filter((line) => line.includes(",VIP,")).length;
const guestAssignments = lines.filter((line) =>
  line.includes(",Guests,")
).length;
const facultyAssignments = lines.filter((line) =>
  line.includes(",Faculty,")
).length;
const degreeAssignments = lines.filter((line) =>
  line.includes(",Degree Students,")
).length;
const collegeAssignments = lines.filter((line) =>
  line.includes(",College Students,")
).length;

console.log("📊 Found assignments in downloaded file:");
console.log(`   - VIP: ${vipAssignments}`);
console.log(`   - Guests: ${guestAssignments}`);
console.log(`   - Faculty: ${facultyAssignments}`);
console.log(`   - Degree Students: ${degreeAssignments}`);
console.log(`   - College Students: ${collegeAssignments}`);
console.log(
  `   - Total: ${
    vipAssignments +
    guestAssignments +
    facultyAssignments +
    degreeAssignments +
    collegeAssignments
  }\n`
);

// Backup existing files
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = path.join(
  __dirname,
  `../data/booked_seats.backup.${timestamp}.csv`
);

if (fs.existsSync(dataPath)) {
  fs.copyFileSync(dataPath, backupPath);
  console.log(`💾 Backup created: ${path.basename(backupPath)}\n`);
}

// Copy to both locations
fs.copyFileSync(downloadsPath, dataPath);
fs.copyFileSync(downloadsPath, publicDataPath);

console.log("✅ Updated: data/booked_seats.csv");
console.log("✅ Updated: public/data/booked_seats.csv\n");

// Optionally delete the downloaded file
console.log("🧹 Cleaning up Downloads folder...");
fs.unlinkSync(downloadsPath);
console.log("✅ Removed: booked_seats.csv from Downloads\n");

console.log("============================================================");
console.log("✅ SEAT ASSIGNMENTS SYNCED!");
console.log("============================================================\n");

console.log("📝 Next steps:");
console.log("   1. Refresh localhost (Ctrl+F5) to verify changes");
console.log("   2. Commit to git:");
console.log("      git add data/booked_seats.csv public/data/booked_seats.csv");
console.log('      git commit -m "Updated VIP/Guest seat assignments"');
console.log("      git push origin main\n");
