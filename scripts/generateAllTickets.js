const fs = require("fs");
const path = require("path");

const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const usersPath = path.join(__dirname, "../data/users.csv");
const registrationPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);
const outputDir = path.join(__dirname, "../tickets");

// Create tickets directory with subfolders if it doesn't exist
const categories = [
  "College_Students",
  "Degree_Students",
  "Parents",
  "VIP",
  "Faculty",
  "Press",
  "Guests",
];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

categories.forEach((cat) => {
  const catDir = path.join(outputDir, cat);
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }
});

console.log("🎫 Starting Ticket Generation for All Categories...\n");

// Read all data files
const bookedSeatsContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const usersContent = fs.readFileSync(usersPath, "utf-8");
const regContent = fs.readFileSync(registrationPath, "utf-8");

// Parse booked seats
const seatLines = bookedSeatsContent
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());
const seats = seatLines.map((line) => {
  const parts = line.split(",");
  return {
    category: parts[0],
    seatNumber: parts[1],
    userId: parts[2],
    userName: parts[3]?.replace(/"/g, ""),
    email: parts[4],
    phone: parts[5],
    notes: parts[6] || "",
  };
});

// Parse users for additional info
const userLines = usersContent
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());
const userMap = {};
userLines.forEach((line) => {
  const parts = line.split(",");
  const id = parts[0];
  userMap[id] = {
    name: parts[1]?.replace(/"/g, ""),
    email: parts[2],
    phone: parts[3],
    category: parts[4],
  };
});

// Parse registration data for enrollment numbers
const regLines = regContent
  .split("\n")
  .slice(1)
  .filter((l) => l.trim());
const enrollmentMap = {};

regLines.forEach((line) => {
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
  const degree = fields[4];

  if (name && enrollment) {
    enrollmentMap[name.toLowerCase()] = { enrollment, degree };
  }
});

// Helper function to get department from enrollment
function getDepartment(enrollment) {
  if (!enrollment) return "Unknown";

  const enroll = enrollment.toUpperCase();

  if (enroll.includes("MBA")) return "MBA";
  if (enroll.includes("BBA")) return "BBA";
  if (enroll.includes("DP")) return "PhD";
  if (enroll.includes("MCA")) return "MCA";
  if (enroll.includes("MCE")) return "M.Tech Civil Engineering";
  if (enroll.includes("MMN")) return "M.Tech Mining Engineering";
  if (enroll.includes("MME")) return "M.Tech Mechanical Engineering";
  if (enroll.includes("MEE")) return "M.Tech Electrical Engineering";
  if (enroll.includes("MCS")) return "M.Tech Computer Science";
  if (enroll.includes("CS")) return "B.Tech Computer Science";
  if (enroll.includes("EC")) return "B.Tech Electronics & Communication";
  if (enroll.includes("MN")) return "B.Tech Mining Engineering";
  if (enroll.includes("ME")) return "B.Tech Mechanical Engineering";
  if (enroll.includes("CD")) return "B.Tech Civil Engineering";

  return "Unknown";
}

// Generate HTML ticket
function generateTicket(seat, enrollment = null, department = null) {
  const ticketHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Convocation Ticket - ${seat.userName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .ticket {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 800px;
      width: 100%;
      overflow: hidden;
      position: relative;
    }
    
    .ticket-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      position: relative;
    }
    
    .ticket-header::after {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 0;
      right: 0;
      height: 40px;
      background: white;
      border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    }
    
    .ticket-header h1 {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .ticket-header p {
      font-size: 18px;
      opacity: 0.95;
    }
    
    .ticket-body {
      padding: 40px 30px 30px;
    }
    
    .attendee-info {
      margin-bottom: 30px;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 2px dashed #e0e0e0;
    }
    
    .info-row:last-child {
      border-bottom: none;
    }
    
    .info-label {
      font-weight: bold;
      color: #667eea;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .info-value {
      font-size: 16px;
      color: #333;
      font-weight: 600;
      text-align: right;
      max-width: 60%;
    }
    
    .seat-info {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 15px;
      text-align: center;
      margin: 20px 0;
    }
    
    .seat-number {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 10px;
      letter-spacing: 3px;
    }
    
    .seat-label {
      font-size: 16px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .event-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
    }
    
    .event-details h3 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 18px;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      color: #555;
    }
    
    .detail-item strong {
      margin-right: 8px;
      color: #333;
    }
    
    .ticket-footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      border-top: 2px dashed #e0e0e0;
    }
    
    .barcode {
      margin: 20px 0;
      padding: 15px;
      background: white;
      border-radius: 8px;
      display: inline-block;
    }
    
    .barcode-lines {
      display: flex;
      gap: 2px;
      justify-content: center;
    }
    
    .barcode-line {
      width: 3px;
      height: 60px;
      background: #333;
    }
    
    .barcode-line:nth-child(even) {
      height: 50px;
    }
    
    .barcode-line:nth-child(3n) {
      height: 55px;
    }
    
    .instructions {
      font-size: 12px;
      color: #666;
      margin-top: 15px;
      line-height: 1.6;
    }
    
    .category-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 10px;
      font-weight: 600;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .ticket {
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <h1>12th Convocation 2025</h1>
      <p>Institute of Engineering & Technology, Jaipur</p>
      <div class="category-badge">${seat.category}</div>
    </div>
    
    <div class="ticket-body">
      <div class="attendee-info">
        <div class="info-row">
          <span class="info-label">Name</span>
          <span class="info-value">${seat.userName || "N/A"}</span>
        </div>
        ${
          enrollment
            ? `
        <div class="info-row">
          <span class="info-label">Enrollment No.</span>
          <span class="info-value">${enrollment}</span>
        </div>`
            : ""
        }
        ${
          department
            ? `
        <div class="info-row">
          <span class="info-label">Department</span>
          <span class="info-value">${department}</span>
        </div>`
            : ""
        }
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">${seat.email || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone</span>
          <span class="info-value">${seat.phone || "N/A"}</span>
        </div>
        ${
          seat.notes
            ? `
        <div class="info-row">
          <span class="info-label">Note</span>
          <span class="info-value">${seat.notes}</span>
        </div>`
            : ""
        }
      </div>
      
      <div class="seat-info">
        <div class="seat-number">${seat.seatNumber}</div>
        <div class="seat-label">Seat Number</div>
      </div>
      
      <div class="event-details">
        <h3>Event Details</h3>
        <div class="detail-item">
          <strong>📅 Date:</strong> To Be Announced
        </div>
        <div class="detail-item">
          <strong>🕐 Time:</strong> To Be Announced
        </div>
        <div class="detail-item">
          <strong>📍 Venue:</strong> IET Amphitheatre, Jaipur
        </div>
        <div class="detail-item">
          <strong>🎓 Category:</strong> ${seat.category}
        </div>
      </div>
    </div>
    
    <div class="ticket-footer">
      <div class="barcode">
        <div class="barcode-lines">
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
          <div class="barcode-line"></div>
        </div>
      </div>
      <div class="instructions">
        Please bring this ticket with you on the day of the event.<br>
        Entry will be allowed only with a valid ticket.<br>
        For queries, contact: convocation@ietjaipur.edu.in
      </div>
    </div>
  </div>
</body>
</html>`;

  return ticketHTML;
}

// Generate tickets for all categories
let ticketCount = {
  "College Students": 0,
  Parents: 0,
  "Degree Students": 0,
  VIP: 0,
  Faculty: 0,
  Press: 0,
  Guests: 0,
};

console.log("📝 Generating tickets...\n");

seats.forEach((seat, index) => {
  if (!seat.userId || !seat.userName) {
    return; // Skip empty seats
  }

  let enrollment = null;
  let department = null;

  // Get enrollment and department for degree students
  if (seat.category === "Degree Students") {
    const enrollmentData = enrollmentMap[seat.userName.toLowerCase()];
    if (enrollmentData) {
      enrollment = enrollmentData.enrollment;
      department = getDepartment(enrollment);
    }
  }

  const ticket = generateTicket(seat, enrollment, department);

  // Create filename using just the seat number (e.g., D100.html, P100.html, C100.html)
  const filename = `${seat.seatNumber}.html`;

  // Determine category folder
  const categoryFolder = seat.category.replace(/\s+/g, "_");
  const categoryPath = path.join(outputDir, categoryFolder);
  const filepath = path.join(categoryPath, filename);

  fs.writeFileSync(filepath, ticket);
  ticketCount[seat.category]++;

  if ((index + 1) % 50 === 0) {
    console.log(`  Generated ${index + 1} tickets...`);
  }
});

console.log("\n✅ Ticket Generation Complete!\n");
console.log("📊 Summary:");
console.log("─".repeat(50));
Object.keys(ticketCount).forEach((category) => {
  if (ticketCount[category] > 0) {
    console.log(`  ${category}: ${ticketCount[category]} tickets`);
  }
});
console.log("─".repeat(50));
console.log(
  `  Total: ${Object.values(ticketCount).reduce((a, b) => a + b, 0)} tickets\n`
);
console.log(`📁 All tickets saved in: ${outputDir}`);
console.log(`📂 Organized by category in subfolders`);
console.log("\n💡 To view a ticket, open any HTML file in your browser.");
