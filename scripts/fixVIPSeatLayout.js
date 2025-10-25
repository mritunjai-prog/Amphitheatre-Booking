const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("🔧 Fixing VIP seat numbering to match left/right layout...\n");

// Read current booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const csvContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const parsed = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
});

const seats = parsed.data;

// VIP seats should be arranged as:
// Left side (L1-L13): positions 1-13
// Right side (R1-R13): positions 14-26

// Current alternating pattern in CSV:
const currentVIPs = [
  { old: "VIP-L1", new: "VIP-L1", name: "Ms. Pragya Kewalramani" },
  { old: "VIP-R1", new: "VIP-L2", name: "Dr. Raghavpat Singhania" },
  { old: "VIP-L2", new: "VIP-L3", name: "Mr. Namit Mehta" },
  { old: "VIP-R2", new: "VIP-L4", name: "Mr. Madhavkrishna Singhania" },
  { old: "VIP-L3", new: "VIP-L5", name: "Mr.Yogesh Goyal" },
  { old: "VIP-R3", new: "VIP-L6", name: "Mr. Ajay Kumar Saraogi" },
  { old: "VIP-L4", new: "VIP-L7", name: "Mr . Gaurav Srivastava" },
  { old: "VIP-R4", new: "VIP-L8", name: "Dr. Dhruv Aggrawal" },
  { old: "VIP-L5", new: "VIP-L9", name: "Mr. Manish Toshniwal" },
  { old: "VIP-R5", new: "VIP-L10", name: "Mr. Mangal Dev" },
  { old: "VIP-L6", new: "VIP-L11", name: "Mr. Prabhakar Mishra" },
  { old: "VIP-R6", new: "VIP-L12", name: "Prof. Nalinaksh S. Vyas" },
  { old: "VIP-L7", new: "VIP-L13", name: "Mr. Kishan Joshi" },
  { old: "VIP-R7", new: "VIP-R1", name: "Shri Anuj Khandelwal" },
  { old: "VIP-L8", new: "VIP-R2", name: "Mr. Ravindra Kumar Garg" },
  { old: "VIP-R8", new: "VIP-R3", name: "Shri Sanjeev Garg" },
  { old: "VIP-L9", new: "VIP-R4", name: "Mr. Rajesh Soni" },
  { old: "VIP-R9", new: "VIP-R5", name: "Shri Yagyesh Gupta" },
  { old: "VIP-L10", new: "VIP-R6", name: "Mr. Murli Manohar Lodha" },
  { old: "VIP-R10", new: "VIP-R7", name: "Shri Anil Badgotri" },
  { old: "VIP-L11", new: "VIP-R8", name: "Mr. Parmeet Singh Sethi" },
  { old: "VIP-R11", new: "VIP-R9", name: "Ms. Akarsha Jagtiani" },
  { old: "VIP-L12", new: "VIP-R10", name: "Mr. Aaryaman Sethi" },
  { old: "VIP-R12", new: "VIP-R11", name: "Ms. Savita Yadav" },
  { old: "VIP-L13", new: "VIP-R12", name: "Ms. Yogita Bihani" },
  { old: "VIP-R13", new: "VIP-R13", name: "Mr. Rajenndra Jain" },
];

// Create mapping
const vipMapping = {};
currentVIPs.forEach((v) => {
  vipMapping[v.old] = v.new;
});

let vipUpdated = 0;

// Update VIP seat numbers
seats.forEach((seat) => {
  if (seat.seatNumber && vipMapping[seat.seatNumber]) {
    console.log(
      `   ${seat.seatNumber} → ${vipMapping[seat.seatNumber]} (${
        seat.userName
      })`
    );
    seat.seatNumber = vipMapping[seat.seatNumber];
    vipUpdated++;
  }
});

console.log(`\n✅ Updated ${vipUpdated} VIP seats\n`);

// Generate new CSV
const newCsv = Papa.unparse(seats, {
  columns: ["seatNumber", "userName", "email", "phone", "notes"],
});

// Write to both locations
fs.writeFileSync(bookedSeatsPath, newCsv, "utf-8");
fs.writeFileSync(
  path.join(__dirname, "../public/data/booked_seats.csv"),
  newCsv,
  "utf-8"
);

console.log("📁 Updated files:");
console.log("   - data/booked_seats.csv");
console.log("   - public/data/booked_seats.csv");
console.log("\n🎉 SUCCESS! VIP seats now match left/right layout.");
