const fs = require("fs");
const path = require("path");

// File paths
const usersPath = path.join(__dirname, "../data/users.csv");
const publicUsersPath = path.join(__dirname, "../public/data/users.csv");

console.log("🔄 Sorting users.csv...\n");

// Read the file
const data = fs.readFileSync(usersPath, "utf-8");
const lines = data.trim().split("\n");

// Keep header
const header = lines[0];
const dataLines = lines.slice(1);

console.log(`📖 Found ${dataLines.length} user entries`);

// Categorize users
const vipUsers = [];
const guestUsers = [];
const pressUsers = [];
const facultyUsers = [];
const degreeUsers = [];
const collegeUsers = [];
const parentUsers = [];

dataLines.forEach((line) => {
  const userId = line.split(",")[0];

  if (userId.startsWith("VIP")) vipUsers.push(line);
  else if (userId.startsWith("G")) guestUsers.push(line);
  else if (
    userId.startsWith("P") &&
    !userId.startsWith("P") &&
    userId.length > 2
  )
    pressUsers.push(line);
  else if (userId.startsWith("F")) facultyUsers.push(line);
  else if (userId.startsWith("D")) degreeUsers.push(line);
  else if (/^[0-9]+$/.test(userId)) collegeUsers.push(line);
  else parentUsers.push(line);
});

console.log(`VIP: ${vipUsers.length}`);
console.log(`Guests: ${guestUsers.length}`);
console.log(`Press: ${pressUsers.length}`);
console.log(`Faculty: ${facultyUsers.length}`);
console.log(`Degree: ${degreeUsers.length}`);
console.log(`College: ${collegeUsers.length}`);
console.log(`Parents: ${parentUsers.length}`);

// Sorting function
const getUserId = (line) => {
  const userId = line.split(",")[0];

  if (userId.startsWith("VIP")) return parseInt(userId.replace("VIP", ""));
  if (userId.startsWith("G")) return parseInt(userId.replace("G", ""));
  if (userId.startsWith("F")) return parseInt(userId.replace("F", ""));
  if (userId.startsWith("D")) return parseInt(userId.replace("D", ""));
  return parseInt(userId);
};

// Sort each category
vipUsers.sort((a, b) => getUserId(a) - getUserId(b));
guestUsers.sort((a, b) => getUserId(a) - getUserId(b));
pressUsers.sort((a, b) => getUserId(a) - getUserId(b));
facultyUsers.sort((a, b) => getUserId(a) - getUserId(b));
degreeUsers.sort((a, b) => getUserId(a) - getUserId(b));
collegeUsers.sort((a, b) => getUserId(a) - getUserId(b));
parentUsers.sort((a, b) => getUserId(a) - getUserId(b));

// Build sorted file
const sortedLines = [
  header,
  ...vipUsers,
  ...guestUsers,
  ...pressUsers,
  ...facultyUsers,
  ...degreeUsers,
  ...collegeUsers,
  ...parentUsers,
];

// Write sorted data
const sortedData = sortedLines.join("\n") + "\n";
fs.writeFileSync(usersPath, sortedData);
fs.writeFileSync(publicUsersPath, sortedData);

console.log("\n✅ users.csv sorted!");
console.log(`📊 Total users: ${dataLines.length}`);
console.log("\n🔍 Sample college user entries:");
console.log(collegeUsers[0]);
console.log(collegeUsers[1]);
console.log(collegeUsers[2]);
console.log("...");
console.log(collegeUsers[collegeUsers.length - 3]);
console.log(collegeUsers[collegeUsers.length - 2]);
console.log(collegeUsers[collegeUsers.length - 1]);
