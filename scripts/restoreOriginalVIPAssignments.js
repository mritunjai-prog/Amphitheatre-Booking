const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("🔧 Restoring original VIP seat assignments...\n");

// Original VIP assignments (from Word document - THESE SHOULD NOT CHANGE)
const originalVIPs = [
  {
    seat: "VIP-L1",
    name: "Ms. Pragya Kewalramani",
    email: "mspragyakewalramani@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R1",
    name: "Dr. Raghavpat Singhania",
    email: "drraghavpatsinghania@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L2",
    name: "Mr. Namit Mehta",
    email: "mrnamitmehta@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R2",
    name: "Mr. Madhavkrishna Singhania",
    email: "mrmadhavkrishnasinghania@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L3",
    name: "Mr.Yogesh Goyal",
    email: "mryogeshgoyal@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R3",
    name: "Mr. Ajay Kumar Saraogi",
    email: "mrajaykumarsaraogi@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L4",
    name: "Mr . Gaurav Srivastava",
    email: "mrgauravsrivastava@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R4",
    name: "Dr. Dhruv Aggrawal",
    email: "drdhruvaggrawal@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L5",
    name: "Mr. Manish Toshniwal",
    email: "mrmanishtoshniwal@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R5",
    name: "Mr. Mangal Dev",
    email: "mrmangaldev@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L6",
    name: "Mr. Prabhakar Mishra",
    email: "mrprabhakarmishra@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R6",
    name: "Prof. Nalinaksh S. Vyas",
    email: "profnalinakshsvyas@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L7",
    name: "Mr. Kishan Joshi",
    email: "mrkishanjoshi@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R7",
    name: "Shri Anuj Khandelwal",
    email: "shrianujkhandelwal@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L8",
    name: "Mr. Ravindra Kumar Garg",
    email: "mrravindrakumargarg@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R8",
    name: "Shri Sanjeev Garg",
    email: "shrisanjeevgarg@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L9",
    name: "Mr. Rajesh Soni",
    email: "mrrajeshsoni@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R9",
    name: "Shri Yagyesh Gupta",
    email: "shriyagyeshgupta@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L10",
    name: "Mr. Murli Manohar Lodha",
    email: "mrmurlimanoharlodha@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R10",
    name: "Shri Anil Badgotri",
    email: "shrianilbadgotri@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L11",
    name: "Mr. Parmeet Singh Sethi",
    email: "mrparmeetsinghsethi@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R11",
    name: "Ms. Akarsha Jagtiani",
    email: "msakarshajagtiani@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L12",
    name: "Mr. Aaryaman Sethi",
    email: "mraaryamansethi@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R12",
    name: "Ms. Savita Yadav",
    email: "mssavitayadav@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-L13",
    name: "Ms. Yogita Bihani",
    email: "msyogitabihani@vip.com",
    phone: "N/A",
  },
  {
    seat: "VIP-R13",
    name: "Mr. Rajenndra Jain",
    email: "mrrajenndrajain@vip.com",
    phone: "N/A",
  },
];

console.log("Original VIP assignments:");
originalVIPs.forEach((v) => {
  console.log(`   ${v.seat}: ${v.name}`);
});

// Read current booked_seats.csv
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const csvContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const parsed = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
});

const seats = parsed.data;

// Remove all VIP seats
const nonVIPSeats = seats.filter((s) => !s.seatNumber.startsWith("VIP-"));

// Add back original VIP seats
const allSeats = [
  ...originalVIPs.map((v) => ({
    seatNumber: v.seat,
    userName: v.name,
    email: v.email,
    phone: v.phone,
    notes: "",
  })),
  ...nonVIPSeats,
];

console.log(
  `\n✅ Restored ${originalVIPs.length} VIP seats with original assignments\n`
);

// Generate new CSV
const newCsv = Papa.unparse(allSeats, {
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
console.log("\n🎉 SUCCESS! VIP assignments restored to original.");
