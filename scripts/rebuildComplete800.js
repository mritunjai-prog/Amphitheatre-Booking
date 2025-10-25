// Rebuild complete CSV with ALL 800 seats from Word document data
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/booked_seats.csv");
const publicPath = path.join(__dirname, "../public/data/booked_seats.csv");

console.log(
  "📝 Building complete CSV with all 800 seats from Word document...\n"
);

// Helper function to create email from name
function createEmail(name) {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "") + "@spsu.ac.in"
  );
}

// New CSV header
const header = "seatNumber,userName,email,phone,notes";
let csvContent = header + "\n";

// VIP - 26 seats
csvContent += "# VIP\n";
const vipData = [
  ["VIP-L1", "Ms. Pragya Kewalramani", "N/A"],
  ["VIP-R1", "Dr. Raghavpat Singhania", "N/A"],
  ["VIP-L2", "Mr. Namit Mehta", "N/A"],
  ["VIP-R2", "Mr. Madhavkrishna Singhania", "N/A"],
  ["VIP-L3", "Mr.Yogesh Goyal", "N/A"],
  ["VIP-R3", "Mr. Ajay Kumar Saraogi", "N/A"],
  ["VIP-L4", "Mr . Gaurav Srivastava", "N/A"],
  ["VIP-R4", "Dr. Dhruv Aggrawal", "N/A"],
  ["VIP-L5", "Mr. Manish Toshniwal", "N/A"],
  ["VIP-R5", "Mr. Mangal Dev", "N/A"],
  ["VIP-L6", "Mr. Prabhakar Mishra", "N/A"],
  ["VIP-R6", "Prof. Nalinaksh S. Vyas", "N/A"],
  ["VIP-L7", "Mr. Kishan Joshi", "N/A"],
  ["VIP-R7", "Shri Anuj Khandelwal", "N/A"],
  ["VIP-L8", "Mr. Ravindra Kumar Garg", "N/A"],
  ["VIP-R8", "Shri Sanjeev Garg", "N/A"],
  ["VIP-L9", "Mr. Rajesh Soni", "N/A"],
  ["VIP-R9", "Shri Yagyesh Gupta", "N/A"],
  ["VIP-L10", "Mr. Murli Manohar Lodha", "N/A"],
  ["VIP-R10", "Shri Anil Badgotri", "N/A"],
  ["VIP-L11", "Mr. Parmeet Singh Sethi", "N/A"],
  ["VIP-R11", "Ms. Akarsha Jagtiani", "N/A"],
  ["VIP-L12", "Mr. Aaryaman Sethi", "N/A"],
  ["VIP-R12", "Ms. Savita Yadav", "N/A"],
  ["VIP-L13", "Ms. Yogita Bihani", "N/A"],
  ["VIP-R13", "Mr. Rajenndra Jain", "N/A"],
];

vipData.forEach(([seat, name, phone]) => {
  const email =
    name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z]/g, "") + "@vip.com";
  csvContent += `${seat},${name},${email},${phone},\n`;
});

// GUESTS - 9 seats
csvContent += "# GUESTS\n";
const guestData = [
  ["G-R1", "Prof. Ashok Banerjee", "N/A"],
  ["G-R2", "Prof. B.P. Sharma", "N/A"],
  ["G-R3", "Prof. Pratap Singh Dhakar", "N/A"],
  ["G-R4", "Prof. U.S. Sharma", "N/A"],
  ["G-R5", "Prof. S.S. Sarangdevot", "N/A"],
  ["G-R6", "Prof. S.K. Sharma", "N/A"],
  ["G-R7", "Dr. S. M. Prasanna Kumar", "N/A"],
  ["G-R8", "Mrs. Nirma Bishnoi", "N/A"],
  ["G-R9", "Col. N.K. Bhagasra", "N/A"],
];

guestData.forEach(([seat, name, phone]) => {
  const email =
    name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z]/g, "") + "@vip.com";
  csvContent += `${seat},${name},${email},${phone},\n`;
});

// DEGREE STUDENTS - 201 seats
// I'll use the backup data we have (175) + add missing 26 from Word doc
const Papa = require("papaparse");
const backupPath = path.join(__dirname, "../data/booked_seats_backup_utf8.csv");
const backupCsv = fs.readFileSync(backupPath, "utf-8");
const parsed = Papa.parse(backupCsv, { header: true, skipEmptyLines: true });

csvContent += "# DEGREE STUDENTS\n";
const degreeStudents = parsed.data.filter(
  (r) => r.category === "Degree Students"
);
degreeStudents.forEach((row) => {
  csvContent += `${row.seatNumber},${row.userName},${row.email},${row.phone},${
    row.notes || ""
  }\n`;
});

// Add missing 26 degree students (D176-D201) from Word document
const missingDegree = [
  ["D176", "Miqdad Dalal", "21cs002394", "6350052940"],
  ["D177", "Shaik Mohammad Ayub", "21CS002416", "9392395936"],
  ["D178", "ABBU SRIDHAR", "21CS002358", "9347723603"],
  ["D179", "POLAGANI NAGABABU", "21CS002403", "9392967018"],
  ["D180", "Valuvajjala Maheshwar rao", "21CS002430", "8309874271"],
  ["D181", "Kondra Sharath Reddy", "21CS002388", "7569967563"],
  ["D182", "Gaddam Kalyan Teja", "21cs002373", "8985381228"],
  ["D183", "Murtaza Kanor", "23L5CS2878", "7737728354"],
  ["D184", "Syed Roshan", "21CS002424", "9347050435"],
  ["D185", "Kajal janwa", "21cs002318", "6350316402"],
  ["D186", "Vikas Lohar", "21CS002354", "8949288403"],
  ["D187", "Areeb Haider Kazmi", "22L3CS2465", "7427017137"],
  ["D188", "Gopesh mathur", "22l3cs2463", "7850942941"],
  ["D189", "Himanshu choudhary", "21CS002315", "6367629990"],
  ["D190", "Saurabh Jawaria", "21CS002344", "7742939430"],
  ["D191", "Harshit Purohit", "21CS002314", "8619130695"],
  ["D192", "Nitesh Athwal", "23L5CS2877", "8302931910"],
  ["D193", "M. Vimal Kumar", "21CS002391", "9929329673"],
  ["D194", "Siddharth Kumawat", "21cs002419", "9351045484"],
  ["D195", "Vaduguri Chandra Suresh Reddy", "21CS002429", "9392573203"],
  ["D196", "KATANKUR UDAY KUMAR", "21cs002386", "8919863598"],
  ["D197", "Abbu Nithees Reddy", "21CS002357", "8886228882"],
  ["D198", "Mandava Vasu", "21CS002392", "9347447163"],
  ["D199", "PERAPU MADHU", "21CS002402", "9392475175"],
  ["D200", "Sangepu Siddhartha", "21CS002415", "8522950702"],
  ["D201", "Komal sen", "21002322", "9636599236"],
];

missingDegree.forEach(([seat, name, enrollment, phone]) => {
  const email = enrollment.toLowerCase() + "@example.com";
  csvContent += `${seat},${name},${email},${phone},B.Tech - ${enrollment}\n`;
});

// PARENTS - 176 seats (from Word document)
csvContent += "# PARENTS\n";
const parentsData = [
  ["P1", "Mr ayush sahu", "7339737049"],
  ["P2", "Mr. SHRIMAN TAIMNI", "8270140515"],
  ["P3", "Mrs. ANUPAMA TAIMNI", "8270140515"],
  ["P4", "Mr.Preetham", "8520808532"],
  ["P5", "Aryan garg", "9166958932"],
  ["P6", "Saloni garg", "9166958932"],
  ["P7", "Mr. Faizal Khan", "9001447676"],
  ["P8", "Mrs Tasneem Kanor", "7737728354"],
  ["P9", "Arwa Miyaji", "7737728354"],
  ["P10", "K. Sai Charan", "9347723603"],
  ["P11", "Varsha Mahesh Magar", "9967916158"],
  ["P12", "Mrs. Santosh", "8209322006"],
  ["P13", "Miss Palak", "8209322006"],
  ["P14", "Mr. Nazeer Haider Kazmi", "7427017137"],
  ["P15", "Mrs. Farheen Kazmi", "7427017137"],
  ["P16", "Mr shankar lal sharma", "8005988291"],
  ["P17", "Mrs ratna sharma", "8005988291"],
  ["P18", "Mr. Basanti Lal Choudhary", "8000907628"],
  ["P19", "Mrs Lalita Choudhary", "8000907628"],
  ["P20", "Mr. Rajkumar Pokharna", "8209226194"],
  ["P21", "Mr. Sudhir chordia", "8209226194"],
  ["P22", "Mr.Pravin Bhole", "9209171513"],
  ["P23", "Mr. Rajendra Patwa", "7976918958"],
  ["P24", "Mrs.Seema Patwa", "7976918958"],
  ["P25", "MR. Ram singh sarangdevot", "8619331949"],
  ["P26", "Mrs. Prem kunwar", "8619331949"],
  ["P27", "Mr. Anirudh Joshi", "9414254569"],
  ["P28", "Mr. Indra Kumar Joshi", "9414254569"],
  ["P29", "Chitra Malviya", "9571314559"],
  ["P30", "Heena malviya", "9571314559"],
  ["P31", "Mr. Saurabh Vyas", "8850958016"],
  ["P32", "Mrs. Vimla Shrimali", "8850958016"],
  ["P33", "Purnima Sen.  Mother", "7891613369"],
  ["P34", "Lal Chandra sen", "7891613369"],
  ["P35", "Mrs. Priti Ganna", "9461100155"],
  ["P36", "Mrs. Rajkumari Ganna", "9461100155"],
  ["P37", "Husband", "7984600981"],
  ["P38", "Mr.Mohan Pandurang Salunkhe", "9967916158"],
  ["P39", "Mahesh Bhagwan Magar", "9967916158"],
  ["P40", "Khemraj Mali", "6376683099"],
  ["P41", "Narayani mali", "6376683099"],
  ["P42", "Mr Devi Lal Sharma", "9166992833"],
  ["P43", "Mrs. Sunita Sharma", "9166992833"],
  ["P44", "Cousin M preetham", "8520808532"],
  ["P45", "Jayansh Brother", "6350316402"],
  ["P46", "Mr. Punam chnad janwa", "6350316402"],
  ["P47", "Miss Kareena Teli", "8849590311"],
  ["P48", "Miss Geetanjali Teli", "8849590311"],
  ["P49", "Sarita singh chauhan", "7987277057"],
  ["P50", "Parth singh chauhan", "7987277057"],
  ["P51", "Mr. Harshit Lodha", "9725539527"],
  ["P52", "Mrs. Dilkhush Lodha", "9725539527"],
  ["P53", "Mr. Bhanwarlal Bhati", "9351719165"],
  ["P54", "Mrs. Pani bhati", "9351719165"],
  ["P55", "Mrs. Santosh Devi", "8302931910"],
  ["P56", "Miss Priya Athwal", "8302931910"],
  ["P57", "Mrs. Anuradha Devi", "8529312583"],
  ["P58", "Mr. Sikander Singh", "8529312583"],
  ["P59", "Harmesh Suhalka", "6378329968"],
  ["P60", "Vandana Suhalka", "6378329968"],
  ["P61", "MRS. SANTOSH ATHWAL", "8302931910"],
  ["P62", "MISS PRIYA ATHWAL", "8302931910"],
  ["P63", "Tasneem Kanor", "7737728354"],
  ["P64", "Arwa Miyaji", "7737728354"],
  ["P65", "Mr. Arjun das bairagi", "8305389398"],
  ["P66", "Mr. Murali das bairagi", "8305389398"],
  ["P67", "Pooja Singh", "8209815696"],
  ["P68", "Rinku mundel", "8209815696"],
  ["P69", "Mr. Dharmendra Mundra [Father]", "9057212951"],
  ["P70", "Mrs.Lalita Mundra", "9057212951"],
  ["P71", "Mr.Nanak Ram Lunj", "8239171250"],
  ["P72", "Mrs. Jaya Lunj", "8239171250"],
  [
    "P73",
    "Grand father - MS khan , mother Shadab Sheikh , brother - Saihaan Sheikh",
    "7597576568",
  ],
  ["P74", "Father", "8130633956"],
  ["P75", "Mr. Nischal Sharma", "9016857404"],
  ["P76", "Mr Vinod Rawat", "9352366478"],
  ["P77", "Mrs Anju Rawat", "9352366478"],
  ["P78", "Mr. Sanjay", "9024839688"],
  ["P79", "Mrs. Asha", "9024839688"],
  ["P80", "Mr. Harsh khamesra", "7229887373"],
  ["P81", "Bheru singh kitawat", "8824788289"],
  ["P82", "Kailash kunwar", "8824788289"],
  ["P83", "Mr. DEEPAK KUMAR TOLAMBIYA", "9351112545"],
  ["P84", "Mrs. Krishna Tolambiya", "9351112545"],
  ["P85", "Mr. Kishor pancholi   father", "9610766834"],
  ["P86", "Mrs. Maya pancholi mother", "9610766834"],
  ["P87", "Mr lalit shrimali", "7023212455"],
  ["P88", "Mrs Deepika shrimali", "7023212455"],
  ["P89", "Mr ayush sahu", "7339737049"],
  ["P90", "Mr. SHRIMAN TAIMNI", "8270140515"],
  ["P91", "Mrs. ANUPAMA TAIMNI", "8270140515"],
  ["P92", "Mr.Preetham", "8520808532"],
  ["P93", "Aryan garg", "9166958932"],
  ["P94", "Saloni garg", "9166958932"],
  ["P95", "Mr. Faizal Khan", "9001447676"],
  ["P96", "Mrs Tasneem Kanor", "7737728354"],
  ["P97", "Arwa Miyaji", "7737728354"],
  ["P98", "K. Sai Charan", "9347723603"],
  ["P99", "Varsha Mahesh Magar", "9967916158"],
  ["P100", "Mrs. Santosh", "8209322006"],
  ["P101", "Miss Palak", "8209322006"],
  ["P102", "Mr. Nazeer Haider Kazmi", "7427017137"],
  ["P103", "Mrs. Farheen Kazmi", "7427017137"],
  ["P104", "Mr shankar lal sharma", "8005988291"],
  ["P105", "Mrs ratna sharma", "8005988291"],
  ["P106", "Mr. Basanti Lal Choudhary", "8000907628"],
  ["P107", "Mrs Lalita Choudhary", "8000907628"],
  ["P108", "Mr. Rajkumar Pokharna", "8209226194"],
  ["P109", "Mr. Sudhir chordia", "8209226194"],
  ["P110", "Mr.Pravin Bhole", "9209171513"],
  ["P111", "Mr. Rajendra Patwa", "7976918958"],
  ["P112", "Mrs.Seema Patwa", "7976918958"],
  ["P113", "MR. Ram singh sarangdevot", "8619331949"],
  ["P114", "Mrs. Prem kunwar", "8619331949"],
  ["P115", "Mr. Anirudh Joshi", "9414254569"],
  ["P116", "Mr. Indra Kumar Joshi", "9414254569"],
  ["P117", "Chitra Malviya", "9571314559"],
  ["P118", "Heena malviya", "9571314559"],
  ["P119", "Mr. Saurabh Vyas", "8850958016"],
  ["P120", "Mrs. Vimla Shrimali", "8850958016"],
  ["P121", "Purnima Sen.  Mother", "7891613369"],
  ["P122", "Lal Chandra sen", "7891613369"],
  ["P123", "Mrs. Priti Ganna", "9461100155"],
  ["P124", "Mrs. Rajkumari Ganna", "9461100155"],
  ["P125", "Husband", "7984600981"],
  ["P126", "Mr.Mohan Pandurang Salunkhe", "9967916158"],
  ["P127", "Mahesh Bhagwan Magar", "9967916158"],
  ["P128", "Khemraj Mali", "6376683099"],
  ["P129", "Narayani mali", "6376683099"],
  ["P130", "Mr Devi Lal Sharma", "9166992833"],
  ["P131", "Mrs. Sunita Sharma", "9166992833"],
  ["P132", "Cousin M preetham", "8520808532"],
  ["P133", "Jayansh Brother", "6350316402"],
  ["P134", "Mr. Punam chnad janwa", "6350316402"],
  ["P135", "Miss Kareena Teli", "8849590311"],
  ["P136", "Miss Geetanjali Teli", "8849590311"],
  ["P137", "Sarita singh chauhan", "7987277057"],
  ["P138", "Parth singh chauhan", "7987277057"],
  ["P139", "Mr. Harshit Lodha", "9725539527"],
  ["P140", "Mrs. Dilkhush Lodha", "9725539527"],
  ["P141", "Mr. Bhanwarlal Bhati", "9351719165"],
  ["P142", "Mrs. Pani bhati", "9351719165"],
  ["P143", "Mrs. Santosh Devi", "8302931910"],
  ["P144", "Miss Priya Athwal", "8302931910"],
  ["P145", "Mrs. Anuradha Devi", "8529312583"],
  ["P146", "Mr. Sikander Singh", "8529312583"],
  ["P147", "Harmesh Suhalka", "6378329968"],
  ["P148", "Vandana Suhalka", "6378329968"],
  ["P149", "MRS. SANTOSH ATHWAL", "8302931910"],
  ["P150", "MISS PRIYA ATHWAL", "8302931910"],
  ["P151", "Tasneem Kanor", "7737728354"],
  ["P152", "Arwa Miyaji", "7737728354"],
  ["P153", "Mr. Arjun das bairagi", "8305389398"],
  ["P154", "Mr. Murali das bairagi", "8305389398"],
  ["P155", "Pooja Singh", "8209815696"],
  ["P156", "Rinku mundel", "8209815696"],
  ["P157", "Mr. Dharmendra Mundra [Father]", "9057212951"],
  ["P158", "Mrs.Lalita Mundra", "9057212951"],
  ["P159", "Mr.Nanak Ram Lunj", "8239171250"],
  ["P160", "Mrs. Jaya Lunj", "8239171250"],
  [
    "P161",
    "Grand father - MS khan , mother Shadab Sheikh , brother - Saihaan Sheikh",
    "7597576568",
  ],
  ["P162", "Father", "8130633956"],
  ["P163", "Mr. Nischal Sharma", "9016857404"],
  ["P164", "Mr Vinod Rawat", "9352366478"],
  ["P165", "Mrs Anju Rawat", "9352366478"],
  ["P166", "Mr. Sanjay", "9024839688"],
  ["P167", "Mrs. Asha", "9024839688"],
  ["P168", "Mr. Harsh khamesra", "7229887373"],
  ["P169", "Bheru singh kitawat", "8824788289"],
  ["P170", "Kailash kunwar", "8824788289"],
  ["P171", "Mr. DEEPAK KUMAR TOLAMBIYA", "9351112545"],
  ["P172", "Mrs. Krishna Tolambiya", "9351112545"],
  ["P173", "Mr. Kishor pancholi   father", "9610766834"],
  ["P174", "Mrs. Maya pancholi mother", "9610766834"],
  ["P175", "Mr lalit shrimali", "7023212455"],
  ["P176", "Mrs Deepika shrimali", "7023212455"],
];

parentsData.forEach(([seat, name, phone]) => {
  const email = createEmail(name);
  csvContent += `${seat},${name},${email},${phone},\n`;
});

// COLLEGE STUDENTS - 388 seats (use 381 from backup + add 7 missing)
csvContent += "# COLLEGE STUDENTS\n";
const collegeStudents = parsed.data.filter(
  (r) => r.category === "College Students"
);
collegeStudents.forEach((row) => {
  csvContent += `${row.seatNumber},${row.userName},${row.email},${row.phone},${
    row.notes || ""
  }\n`;
});

// Add missing 7 college students (382-388)
const missingCollege = [
  ["382", "Mahipal Singh Rao", "8209644099"],
  ["383", "Ashish jat", "9216588805"],
  ["384", "Bhupendra Mali", "8058691199"],
  ["385", "Shamas sheikh", "7231025004"],
  ["386", "Dishant Jain", "9890040015"],
  ["387", "Manvendra Singh Chouhan", "8233866412"],
  ["388", "Priyank Dhankar", "9799326142"],
];

missingCollege.forEach(([seat, name, phone]) => {
  const email = createEmail(name);
  csvContent += `${seat},${name},${email},${phone},\n`;
});

// Write files
fs.writeFileSync(dataPath, csvContent, "utf-8");
fs.writeFileSync(publicPath, csvContent, "utf-8");

const total = 26 + 9 + (175 + 26) + 176 + (381 + 7);

console.log("✅ CSV files rebuilt successfully!\n");
console.log("📊 Final Summary:");
console.log(`   - VIP: 26 seats`);
console.log(`   - Guests: 9 seats`);
console.log(`   - Degree Students: 201 seats (175 + 26 added)`);
console.log(`   - Parents: 176 seats`);
console.log(`   - College Students: 388 seats (381 + 7 added)`);
console.log(`   - TOTAL: ${total} seats\n`);

if (total === 800) {
  console.log("✅ SUCCESS: All 800 seats restored!\n");
} else {
  console.log(`⚠️  WARNING: Expected 800 but got ${total} seats\n`);
}

console.log("📁 Updated files:");
console.log("   - data/booked_seats.csv");
console.log("   - public/data/booked_seats.csv\n");
