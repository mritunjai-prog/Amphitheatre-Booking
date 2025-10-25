const fs = require("fs");
const path = require("path");

const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const publicBookedSeatsPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

console.log("🔄 Updating VIP seats to match Word file order...\n");

// VIP data from the Word file in correct order
const vipData = [
  {
    seat: "VIP-L1",
    name: "Ms. Pragya Kewalramani�",
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
    name: "Mr.�Prabhakar�Mishra",
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

// Read current CSV
const content = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = content.split("\n");

// Separate VIP and non-VIP lines
const nonVipLines = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].startsWith("VIP,")) {
    nonVipLines.push(lines[i]);
  }
}

// Create new header (remove category and userId columns)
const newHeader = "seatNumber,userName,email,phone,notes";

// Create new VIP lines
const newVipLines = vipData.map((vip) => {
  return `${vip.seat},${vip.name},${vip.email},${vip.phone},`;
});

console.log("✅ VIP seats updated:");
newVipLines.forEach((line, idx) => {
  console.log(`  ${idx + 1}. ${line.split(",")[0]} - ${line.split(",")[1]}`);
});

// Reconstruct CSV
const allLines = [newHeader, ...newVipLines, ...nonVipLines];
const newContent = allLines.join("\n");

// Write to both files
fs.writeFileSync(bookedSeatsPath, newContent);
fs.writeFileSync(publicBookedSeatsPath, newContent);

console.log("\n✅ CSV files updated successfully!");
console.log("   - Removed category and userId columns");
console.log("   - VIP seats in correct order (L1, R1, L2, R2...)");
console.log("   - Updated both data/ and public/data/ folders\n");
