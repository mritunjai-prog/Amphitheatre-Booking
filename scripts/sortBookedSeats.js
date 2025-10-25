const fs = require("fs");
const path = require("path");

// File paths
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

console.log("🔄 Sorting and organizing booked_seats.csv...\n");

// Read the file
const data = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = data.trim().split("\n");

// Separate header, comments, and data lines
const header = lines[0];
const dataLines = [];
const comments = [];

lines.slice(1).forEach((line) => {
  if (line.trim().startsWith("#") || line.trim() === "") {
    comments.push(line);
  } else {
    dataLines.push(line);
  }
});

console.log(`📖 Found ${dataLines.length} data lines`);

// Categorize the data
const vipSeats = [];
const guestSeats = [];
const pressSeats = [];
const facultySeats = [];
const degreeSeats = [];
const collegeSeats = [];
const parentSeats = [];

dataLines.forEach((line) => {
  if (line.startsWith("VIP,")) vipSeats.push(line);
  else if (line.startsWith("Guests,")) guestSeats.push(line);
  else if (line.startsWith("Press,")) pressSeats.push(line);
  else if (line.startsWith("Faculty,")) facultySeats.push(line);
  else if (line.startsWith("Degree")) degreeSeats.push(line);
  else if (line.startsWith("College")) collegeSeats.push(line);
  else if (line.startsWith("Parents,")) parentSeats.push(line);
});

console.log(`VIP: ${vipSeats.length}`);
console.log(`Guests: ${guestSeats.length}`);
console.log(`Press: ${pressSeats.length}`);
console.log(`Faculty: ${facultySeats.length}`);
console.log(`Degree: ${degreeSeats.length}`);
console.log(`College: ${collegeSeats.length}`);
console.log(`Parents: ${parentSeats.length}`);

// Sorting function to extract seat number
const getSeatNumber = (line) => {
  const parts = line.split(",");
  const seatNum = parts[1];

  // Extract numeric part from different formats
  if (seatNum.includes("VIP-L")) return parseInt(seatNum.replace("VIP-L", ""));
  if (seatNum.includes("VIP-R"))
    return 100 + parseInt(seatNum.replace("VIP-R", ""));
  if (seatNum.includes("G-L")) return parseInt(seatNum.replace("G-L", ""));
  if (seatNum.includes("P-R")) return parseInt(seatNum.replace("P-R", ""));
  if (seatNum.startsWith("F")) return parseInt(seatNum.replace("F", ""));
  if (seatNum.startsWith("D")) return parseInt(seatNum.replace("D", ""));
  if (seatNum.startsWith("P")) return parseInt(seatNum.replace("P", ""));
  return parseInt(seatNum);
};

// Sort each category
vipSeats.sort((a, b) => {
  const aNum = getSeatNumber(a);
  const bNum = getSeatNumber(b);
  return aNum - bNum;
});

guestSeats.sort((a, b) => getSeatNumber(a) - getSeatNumber(b));
pressSeats.sort((a, b) => getSeatNumber(a) - getSeatNumber(b));
facultySeats.sort((a, b) => getSeatNumber(a) - getSeatNumber(b));
degreeSeats.sort((a, b) => getSeatNumber(a) - getSeatNumber(b));
collegeSeats.sort((a, b) => getSeatNumber(a) - getSeatNumber(b));
parentSeats.sort((a, b) => getSeatNumber(a) - getSeatNumber(b));

// Build the sorted file
const sortedLines = [header, ""];

if (vipSeats.length > 0) {
  sortedLines.push("# VIP");
  sortedLines.push(...vipSeats);
  sortedLines.push("");
}

if (guestSeats.length > 0) {
  sortedLines.push("# GUESTS");
  sortedLines.push(...guestSeats);
  sortedLines.push("");
}

if (pressSeats.length > 0) {
  sortedLines.push("# PRESS");
  sortedLines.push(...pressSeats);
  sortedLines.push("");
}

if (facultySeats.length > 0) {
  sortedLines.push("# FACULTY");
  sortedLines.push(...facultySeats);
  sortedLines.push("");
}

if (degreeSeats.length > 0) {
  sortedLines.push("# DEGREE STUDENTS");
  sortedLines.push(...degreeSeats);
  sortedLines.push("");
}

if (collegeSeats.length > 0) {
  sortedLines.push("# COLLEGE STUDENTS");
  sortedLines.push(...collegeSeats);
  sortedLines.push("");
}

if (parentSeats.length > 0) {
  sortedLines.push("# PARENTS");
  sortedLines.push(...parentSeats);
  sortedLines.push("");
}

// Write the sorted data
const sortedData = sortedLines.join("\n");
fs.writeFileSync(bookedSeatsPath, sortedData);
fs.writeFileSync(publicBookedSeatsPath, sortedData);

console.log("\n✅ booked_seats.csv sorted and organized!");
console.log(`📊 Total entries: ${dataLines.length}`);
console.log("\n🔍 Sample college student entries:");
console.log(collegeSeats[0]);
console.log(collegeSeats[1]);
console.log(collegeSeats[2]);
console.log("...");
console.log(collegeSeats[collegeSeats.length - 3]);
console.log(collegeSeats[collegeSeats.length - 2]);
console.log(collegeSeats[collegeSeats.length - 1]);
