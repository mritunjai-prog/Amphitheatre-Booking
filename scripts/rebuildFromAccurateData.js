// Rebuild complete booked_seats.csv from accurate source files
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("📝 Building complete booked_seats.csv from accurate sources...\n");

// File paths
const parentsPath = path.join(
  __dirname,
  "../data/Security Pass Candidate _ Parents _ Family Member (Responses).csv"
);
const collegeStudentsPath = path.join(
  __dirname,
  "../other-data/college-students-data.csv"
);
const degreeStudentsPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);
const outputPath = path.join(__dirname, "../data/booked_seats.csv");
const publicOutputPath = path.join(
  __dirname,
  "../public/data/booked_seats.csv"
);

// VIP data (26 seats) - from Word document
const vipData = [
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

// Guest data (9 seats) - from Word document
const guestData = [
  {
    seat: "G-R1",
    name: "Prof. Ashok Banerjee",
    email: "profashokbanerjee@vip.com",
    phone: "N/A",
  },
  {
    seat: "G-R2",
    name: "Prof. B.P. Sharma",
    email: "profbpsharma@vip.com",
    phone: "N/A",
  },
  {
    seat: "G-R3",
    name: "Prof. Pratap Singh Dhakar",
    email: "profpratapsinghdhakar@vip.com",
    phone: "N/A",
  },
  {
    seat: "G-R4",
    name: "Prof. U.S. Sharma",
    email: "profussharma@vip.com",
    phone: "N/A",
  },
  {
    seat: "G-R5",
    name: "Prof. S.S. Sarangdevot",
    email: "profsssarangdevot@vip.com",
    phone: "N/A",
  },
  {
    seat: "G-R6",
    name: "Prof. S.K. Sharma",
    email: "profsksharma@vip.com",
    phone: "N/A",
  },
  {
    seat: "G-R7",
    name: "Dr. S. M. Prasanna Kumar",
    email: "drsmprasannakumar@vip.com",
    phone: "N/A",
  },
  {
    seat: "G-R8",
    name: "Mrs. Nirma Bishnoi",
    email: "mrsnirmabishnoi@vip.com",
    phone: "N/A",
  },
  {
    seat: "G-R9",
    name: "Col. N.K. Bhagasra",
    email: "colnkbhagasra@vip.com",
    phone: "N/A",
  },
];

// Parse Degree Students (201 seats) from Registration Details
console.log("📖 Reading Degree Students data...");
const degreeContent = fs.readFileSync(degreeStudentsPath, "utf-8");
const degreeParsed = Papa.parse(degreeContent, {
  header: true,
  skipEmptyLines: true,
});
const degreeStudents = degreeParsed.data
  .filter(
    (row) =>
      row["Name of the Student"] &&
      row["Enter Your Email ID\n(Personal Email ID for the future reference)"]
  )
  .slice(0, 201)
  .map((row, index) => ({
    seatNumber: `D${index + 1}`,
    userName: row["Name of the Student"].trim(),
    email:
      row[
        "Enter Your Email ID\n(Personal Email ID for the future reference)"
      ].trim(),
    phone: row["Enter Your Mobile Number (Whatsapp)"] || "N/A",
    notes: `${row["Select Your Degree"] || ""} - ${
      row["Enrollment No.  "] || ""
    }`,
  }));

console.log(`   ✓ Found ${degreeStudents.length} degree students`);

// Parse Parents (176 seats) - from Word document data provided
console.log("📖 Building Parents data from Word document...");
const parentsFromWord = [
  { seat: "P1", name: "Mr ayush sahu", phone: "7339737049" },
  { seat: "P2", name: "Mr. SHRIMAN TAIMNI", phone: "8270140515" },
  { seat: "P3", name: "Mrs. ANUPAMA TAIMNI", phone: "8270140515" },
  { seat: "P4", name: "Mr.Preetham", phone: "8520808532" },
  { seat: "P5", name: "Aryan garg", phone: "9166958932" },
  { seat: "P6", name: "Saloni garg", phone: "9166958932" },
  { seat: "P7", name: "Mr. Faizal Khan", phone: "9001447676" },
  { seat: "P8", name: "Mrs Tasneem Kanor", phone: "7737728354" },
  { seat: "P9", name: "Arwa Miyaji", phone: "7737728354" },
  { seat: "P10", name: "K. Sai Charan", phone: "9347723603" },
  { seat: "P11", name: "Varsha Mahesh Magar", phone: "9,96,79,16,158" },
  { seat: "P12", name: "Mrs. Santosh", phone: "8209322006" },
  { seat: "P13", name: "Miss Palak", phone: "8209322006" },
  { seat: "P14", name: "Mr. Nazeer Haider Kazmi", phone: "7427017137" },
  { seat: "P15", name: "Mrs. Farheen Kazmi", phone: "7427017137" },
  { seat: "P16", name: "Mr shankar lal sharma", phone: "8005988291" },
  { seat: "P17", name: "Mrs ratna sharma", phone: "8005988291" },
  { seat: "P18", name: "Mr. Basanti Lal Choudhary", phone: "8000907628" },
  { seat: "P19", name: "Mrs Lalita Choudhary", phone: "8000907628" },
  { seat: "P20", name: "Mr. Rajkumar Pokharna", phone: "8209226194" },
  { seat: "P21", name: "Mr. Sudhir chordia", phone: "8209226194" },
  { seat: "P22", name: "Mr.Pravin Bhole", phone: "9209171513" },
  { seat: "P23", name: "Mr. Rajendra Patwa", phone: "7976918958" },
  { seat: "P24", name: "Mrs.Seema Patwa", phone: "7976918958" },
  { seat: "P25", name: "MR. Ram singh sarangdevot", phone: "8619331949" },
  { seat: "P26", name: "Mrs. Prem kunwar", phone: "8619331949" },
  { seat: "P27", name: "Mr. Anirudh Joshi", phone: "9414254569" },
  { seat: "P28", name: "Mr. Indra Kumar Joshi", phone: "9414254569" },
  { seat: "P29", name: "Chitra Malviya", phone: "9571314559" },
  { seat: "P30", name: "Heena malviya", phone: "9571314559" },
  { seat: "P31", name: "Mr. Saurabh Vyas", phone: "8850958016" },
  { seat: "P32", name: "Mrs. Vimla Shrimali", phone: "8850958016" },
  { seat: "P33", name: "Purnima Sen.  Mother", phone: "7891613369" },
  { seat: "P34", name: "Lal Chandra sen", phone: "7891613369" },
  { seat: "P35", name: "Mrs. Priti Ganna", phone: "9461100155" },
  { seat: "P36", name: "Mrs. Rajkumari Ganna", phone: "9461100155" },
  { seat: "P37", name: "Husband", phone: "7984600981" },
  { seat: "P38", name: "Mr.Mohan Pandurang Salunkhe", phone: "9967916158" },
  { seat: "P39", name: "Mahesh Bhagwan Magar", phone: "9967916158" },
  { seat: "P40", name: "Khemraj Mali", phone: "6376683099" },
  { seat: "P41", name: "Narayani mali", phone: "6376683099" },
  { seat: "P42", name: "Mr Devi Lal Sharma", phone: "9166992833" },
  { seat: "P43", name: "Mrs. Sunita Sharma", phone: "9166992833" },
  { seat: "P44", name: "Cousin M preetham", phone: "8520808532" },
  { seat: "P45", name: "Jayansh Brother", phone: "6350316402" },
  { seat: "P46", name: "Mr. Punam chnad janwa", phone: "6350316402" },
  { seat: "P47", name: "Miss Kareena Teli", phone: "8849590311" },
  { seat: "P48", name: "Miss Geetanjali Teli", phone: "8849590311" },
  { seat: "P49", name: "Sarita singh chauhan", phone: "7987277057" },
  { seat: "P50", name: "Parth singh chauhan", phone: "7987277057" },
  { seat: "P51", name: "Mr. Harshit Lodha", phone: "9725539527" },
  { seat: "P52", name: "Mrs. Dilkhush Lodha", phone: "9725539527" },
  { seat: "P53", name: "Mr. Bhanwarlal Bhati", phone: "9351719165" },
  { seat: "P54", name: "Mrs. Pani bhati", phone: "9351719165" },
  { seat: "P55", name: "Mrs. Santosh Devi", phone: "8302931910" },
  { seat: "P56", name: "Miss Priya Athwal", phone: "8302931910" },
  { seat: "P57", name: "Mrs. Anuradha Devi", phone: "8529312583" },
  { seat: "P58", name: "Mr. Sikander Singh", phone: "8529312583" },
  { seat: "P59", name: "Harmesh Suhalka", phone: "6378329968" },
  { seat: "P60", name: "Vandana Suhalka", phone: "6378329968" },
  { seat: "P61", name: "MRS. SANTOSH ATHWAL", phone: "8302931910" },
  { seat: "P62", name: "MISS PRIYA ATHWAL", phone: "8302931910" },
  { seat: "P63", name: "Tasneem Kanor", phone: "7737728354" },
  { seat: "P64", name: "Arwa Miyaji", phone: "7737728354" },
  { seat: "P65", name: "Mr. Arjun das bairagi", phone: "8305389398" },
  { seat: "P66", name: "Mr. Murali das bairagi", phone: "8305389398" },
  { seat: "P67", name: "Pooja Singh", phone: "8209815696" },
  { seat: "P68", name: "Rinku mundel", phone: "8209815696" },
  { seat: "P69", name: "Mr. Dharmendra Mundra [Father]", phone: "9057212951" },
  { seat: "P70", name: "Mrs.Lalita Mundra", phone: "9057212951" },
  { seat: "P71", name: "Mr.Nanak Ram Lunj", phone: "8239171250" },
  { seat: "P72", name: "Mrs. Jaya Lunj", phone: "8239171250" },
  {
    seat: "P73",
    name: "Grand father - MS khan , mother Shadab Sheikh , brother - Saihaan Sheikh",
    phone: "7597576568",
  },
  { seat: "P74", name: "Father", phone: "8130633956" },
  { seat: "P75", name: "Mr. Nischal Sharma", phone: "9016857404" },
  { seat: "P76", name: "Mr Vinod Rawat", phone: "9352366478" },
  { seat: "P77", name: "Mrs Anju Rawat", phone: "9352366478" },
  { seat: "P78", name: "Mr. Sanjay", phone: "9024839688" },
  { seat: "P79", name: "Mrs. Asha", phone: "9024839688" },
  { seat: "P80", name: "Mr. Harsh khamesra", phone: "7229887373" },
  { seat: "P81", name: "Bheru singh kitawat", phone: "8824788289" },
  { seat: "P82", name: "Kailash kunwar", phone: "8824788289" },
  { seat: "P83", name: "Mr. DEEPAK KUMAR TOLAMBIYA", phone: "9351112545" },
  { seat: "P84", name: "Mrs. Krishna Tolambiya", phone: "9351112545" },
  { seat: "P85", name: "Mr. Kishor pancholi   father", phone: "9610766834" },
  { seat: "P86", name: "Mrs. Maya pancholi mother", phone: "9610766834" },
  { seat: "P87", name: "Mr lalit shrimali", phone: "7023212455" },
  { seat: "P88", name: "Mrs Deepika shrimali", phone: "7023212455" },
  { seat: "P89", name: "Mr ayush sahu", phone: "7339737049" },
  { seat: "P90", name: "Mr. SHRIMAN TAIMNI", phone: "8270140515" },
  { seat: "P91", name: "Mrs. ANUPAMA TAIMNI", phone: "8270140515" },
  { seat: "P92", name: "Mr.Preetham", phone: "8520808532" },
  { seat: "P93", name: "Aryan garg", phone: "9166958932" },
  { seat: "P94", name: "Saloni garg", phone: "9166958932" },
  { seat: "P95", name: "Mr. Faizal Khan", phone: "9001447676" },
  { seat: "P96", name: "Mrs Tasneem Kanor", phone: "7737728354" },
  { seat: "P97", name: "Arwa Miyaji", phone: "7737728354" },
  { seat: "P98", name: "K. Sai Charan", phone: "9347723603" },
  { seat: "P99", name: "Varsha Mahesh Magar", phone: "9,96,79,16,158" },
  { seat: "P100", name: "Mrs. Santosh", phone: "8209322006" },
  { seat: "P101", name: "Miss Palak", phone: "8209322006" },
  { seat: "P102", name: "Mr. Nazeer Haider Kazmi", phone: "7427017137" },
  { seat: "P103", name: "Mrs. Farheen Kazmi", phone: "7427017137" },
  { seat: "P104", name: "Mr shankar lal sharma", phone: "8005988291" },
  { seat: "P105", name: "Mrs ratna sharma", phone: "8005988291" },
  { seat: "P106", name: "Mr. Basanti Lal Choudhary", phone: "8000907628" },
  { seat: "P107", name: "Mrs Lalita Choudhary", phone: "8000907628" },
  { seat: "P108", name: "Mr. Rajkumar Pokharna", phone: "8209226194" },
  { seat: "P109", name: "Mr. Sudhir chordia", phone: "8209226194" },
  { seat: "P110", name: "Mr.Pravin Bhole", phone: "9209171513" },
  { seat: "P111", name: "Mr. Rajendra Patwa", phone: "7976918958" },
  { seat: "P112", name: "Mrs.Seema Patwa", phone: "7976918958" },
  { seat: "P113", name: "MR. Ram singh sarangdevot", phone: "8619331949" },
  { seat: "P114", name: "Mrs. Prem kunwar", phone: "8619331949" },
  { seat: "P115", name: "Mr. Anirudh Joshi", phone: "9414254569" },
  { seat: "P116", name: "Mr. Indra Kumar Joshi", phone: "9414254569" },
  { seat: "P117", name: "Chitra Malviya", phone: "9571314559" },
  { seat: "P118", name: "Heena malviya", phone: "9571314559" },
  { seat: "P119", name: "Mr. Saurabh Vyas", phone: "8850958016" },
  { seat: "P120", name: "Mrs. Vimla Shrimali", phone: "8850958016" },
  { seat: "P121", name: "Purnima Sen.  Mother", phone: "7891613369" },
  { seat: "P122", name: "Lal Chandra sen", phone: "7891613369" },
  { seat: "P123", name: "Mrs. Priti Ganna", phone: "9461100155" },
  { seat: "P124", name: "Mrs. Rajkumari Ganna", phone: "9461100155" },
  { seat: "P125", name: "Husband", phone: "7984600981" },
  { seat: "P126", name: "Mr.Mohan Pandurang Salunkhe", phone: "9967916158" },
  { seat: "P127", name: "Mahesh Bhagwan Magar", phone: "9967916158" },
  { seat: "P128", name: "Khemraj Mali", phone: "6376683099" },
  { seat: "P129", name: "Narayani mali", phone: "6376683099" },
  { seat: "P130", name: "Mr Devi Lal Sharma", phone: "9166992833" },
  { seat: "P131", name: "Mrs. Sunita Sharma", phone: "9166992833" },
  { seat: "P132", name: "Cousin M preetham", phone: "8520808532" },
  { seat: "P133", name: "Jayansh Brother", phone: "6350316402" },
  { seat: "P134", name: "Mr. Punam chnad janwa", phone: "6350316402" },
  { seat: "P135", name: "Miss Kareena Teli", phone: "8849590311" },
  { seat: "P136", name: "Miss Geetanjali Teli", phone: "8849590311" },
  { seat: "P137", name: "Sarita singh chauhan", phone: "7987277057" },
  { seat: "P138", name: "Parth singh chauhan", phone: "7987277057" },
  { seat: "P139", name: "Mr. Harshit Lodha", phone: "9725539527" },
  { seat: "P140", name: "Mrs. Dilkhush Lodha", phone: "9725539527" },
  { seat: "P141", name: "Mr. Bhanwarlal Bhati", phone: "9351719165" },
  { seat: "P142", name: "Mrs. Pani bhati", phone: "9351719165" },
  { seat: "P143", name: "Mrs. Santosh Devi", phone: "8302931910" },
  { seat: "P144", name: "Miss Priya Athwal", phone: "8302931910" },
  { seat: "P145", name: "Mrs. Anuradha Devi", phone: "8529312583" },
  { seat: "P146", name: "Mr. Sikander Singh", phone: "8529312583" },
  { seat: "P147", name: "Harmesh Suhalka", phone: "6378329968" },
  { seat: "P148", name: "Vandana Suhalka", phone: "6378329968" },
  { seat: "P149", name: "MRS. SANTOSH ATHWAL", phone: "8302931910" },
  { seat: "P150", name: "MISS PRIYA ATHWAL", phone: "8302931910" },
  { seat: "P151", name: "Tasneem Kanor", phone: "7737728354" },
  { seat: "P152", name: "Arwa Miyaji", phone: "7737728354" },
  { seat: "P153", name: "Mr. Arjun das bairagi", phone: "8305389398" },
  { seat: "P154", name: "Mr. Murali das bairagi", phone: "8305389398" },
  { seat: "P155", name: "Pooja Singh", phone: "8209815696" },
  { seat: "P156", name: "Rinku mundel", phone: "8209815696" },
  { seat: "P157", name: "Mr. Dharmendra Mundra [Father]", phone: "9057212951" },
  { seat: "P158", name: "Mrs.Lalita Mundra", phone: "9057212951" },
  { seat: "P159", name: "Mr.Nanak Ram Lunj", phone: "8239171250" },
  { seat: "P160", name: "Mrs. Jaya Lunj", phone: "8239171250" },
  {
    seat: "P161",
    name: "Grand father - MS khan , mother Shadab Sheikh , brother - Saihaan Sheikh",
    phone: "7597576568",
  },
  { seat: "P162", name: "Father", phone: "8130633956" },
  { seat: "P163", name: "Mr. Nischal Sharma", phone: "9016857404" },
  { seat: "P164", name: "Mr Vinod Rawat", phone: "9352366478" },
  { seat: "P165", name: "Mrs Anju Rawat", phone: "9352366478" },
  { seat: "P166", name: "Mr. Sanjay", phone: "9024839688" },
  { seat: "P167", name: "Mrs. Asha", phone: "9024839688" },
  { seat: "P168", name: "Mr. Harsh khamesra", phone: "7229887373" },
  { seat: "P169", name: "Bheru singh kitawat", phone: "8824788289" },
  { seat: "P170", name: "Kailash kunwar", phone: "8824788289" },
  { seat: "P171", name: "Mr. DEEPAK KUMAR TOLAMBIYA", phone: "9351112545" },
  { seat: "P172", name: "Mrs. Krishna Tolambiya", phone: "9351112545" },
  { seat: "P173", name: "Mr. Kishor pancholi   father", phone: "9610766834" },
  { seat: "P174", name: "Mrs. Maya pancholi mother", phone: "9610766834" },
  { seat: "P175", name: "Mr lalit shrimali", phone: "7023212455" },
  { seat: "P176", name: "Mrs Deepika shrimali", phone: "7023212455" },
];

const parents = parentsFromWord.map((p) => ({
  seatNumber: p.seat,
  userName: p.name,
  email: "",
  phone: p.phone,
  notes: "",
}));

console.log(`   ✓ Built ${parents.length} parents`);

// Parse College Students (388 seats) from college-students-data.csv
console.log("📖 Reading College Students data...");
const collegeContent = fs.readFileSync(collegeStudentsPath, "utf-8");
const collegeParsed = Papa.parse(collegeContent, {
  header: true,
  skipEmptyLines: true,
});
const collegeStudents = collegeParsed.data
  .filter((row) => row["Seat Number"] && row["Name"])
  .map((row) => ({
    seatNumber: row["Seat Number"].trim(),
    userName: row["Name"].trim(),
    email: row["Email Address"] || "",
    phone: row["Phone Number"] || "N/A",
    notes: `${row["Program/Branch"] || ""} - ${row["Enrollment Number"] || ""}`,
  }));

console.log(`   ✓ Found ${collegeStudents.length} college students`);

// Build final CSV content using Papa.unparse for proper formatting
const allData = [];

// Add VIP
vipData.forEach((v) => {
  allData.push({
    seatNumber: v.seat,
    userName: v.name,
    email: v.email,
    phone: v.phone,
    notes: "",
  });
});

// Add Guests
guestData.forEach((g) => {
  allData.push({
    seatNumber: g.seat,
    userName: g.name,
    email: g.email,
    phone: g.phone,
    notes: "",
  });
});

// Add Degree Students
degreeStudents.forEach((d) => allData.push(d));

// Add Parents
parents.forEach((p) => allData.push(p));

// Add College Students
collegeStudents.forEach((c) => allData.push(c));

// Generate CSV using Papa.unparse for proper quoting
const csvContent = Papa.unparse(allData, {
  columns: ["seatNumber", "userName", "email", "phone", "notes"],
  header: true,
});

// Write to both locations
fs.writeFileSync(outputPath, csvContent, "utf-8");
fs.writeFileSync(publicOutputPath, csvContent, "utf-8");

console.log("\n✅ CSV rebuild complete!\n");
console.log("📊 Summary:");
console.log(`   - VIP: ${vipData.length} seats`);
console.log(`   - Guests: ${guestData.length} seats`);
console.log(`   - Degree Students: ${degreeStudents.length} seats`);
console.log(`   - Parents: ${parents.length} seats`);
console.log(`   - College Students: ${collegeStudents.length} seats`);
console.log(`   - TOTAL: ${allData.length} seats\n`);

if (allData.length === 800) {
  console.log("🎉 SUCCESS: All 800 seats created!\n");
} else {
  console.log(`⚠️  WARNING: Expected 800 seats but got ${allData.length}\n`);
}

console.log("📁 Updated files:");
console.log("   - data/booked_seats.csv");
console.log("   - public/data/booked_seats.csv\n");
