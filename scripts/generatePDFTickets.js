// Professional Ticket Generation System with PDF and QR Code
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const Papa = require("papaparse");

// Read all booked seats
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const registrationPath = path.join(
  __dirname,
  "../data/Registration Details (12th Convocation - 2025 Batch)_25Oct25_Final.csv"
);

const csvContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const parsedData = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  comments: "#",
});

// Helper function to derive category from seat number
function getCategoryFromSeatNumber(seatNumber) {
  if (!seatNumber) return null;

  const seat = seatNumber.toUpperCase();
  if (seat.startsWith("VIP-")) return "VIP";
  if (seat.startsWith("G-")) return "Guests";
  if (seat.startsWith("D")) return "Degree Students";
  if (seat.startsWith("P")) return "Parents";
  if (seat.startsWith("PRESS-")) return "Press";

  // College students have numeric seat numbers (1, 2, 3, ... 388)
  if (seat.match(/^\d+$/)) return "College Students";

  return null;
}

// Filter tickets and add category if missing
const tickets = parsedData.data
  .filter((row) => row.seatNumber && row.userName)
  .map((row) => ({
    ...row,
    category: row.category || getCategoryFromSeatNumber(row.seatNumber),
  }))
  .filter((row) => row.category); // Filter out any without valid category

// Parse registration data for enrollment numbers
const regContent = fs.readFileSync(registrationPath, "utf-8");
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
  if (!enrollment) return null;

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

  return null;
}

console.log(`\n🎫 CONVOCATION TICKET GENERATOR`);
console.log(
  `════════════════════════════════════════════════════════════════\n`
);
console.log(`📊 Total tickets to generate: ${tickets.length}`);
console.log(
  `   - Degree Students: ${
    tickets.filter((t) => t.category === "Degree Students").length
  }`
);
console.log(
  `   - College Students: ${
    tickets.filter((t) => t.category === "College Students").length
  }`
);
console.log(
  `   - Parents: ${tickets.filter((t) => t.category === "Parents").length}\n`
);

// Create output directory with category subfolders
const outputDir = path.join(__dirname, "../tickets_pdf");
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

// Function to generate a single ticket
async function generateTicket(ticket) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get enrollment and department for degree students
      let enrollment = null;
      let department = null;

      if (ticket.category === "Degree Students") {
        const enrollmentData = enrollmentMap[ticket.userName.toLowerCase()];
        if (enrollmentData) {
          enrollment = enrollmentData.enrollment;
          department = getDepartment(enrollment);
        }
      }

      const fileName = `${ticket.seatNumber}.pdf`;
      const categoryFolder = ticket.category.replace(/\s+/g, "_");
      const filePath = path.join(outputDir, categoryFolder, fileName);

      // Create PDF document
      const doc = new PDFDocument({
        size: [600, 800],
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Generate QR Code
      const qrData = JSON.stringify({
        ticketId: `SPSU-CONV-2025-${ticket.userId}`,
        name: ticket.userName,
        seat: ticket.seatNumber,
        category: ticket.category,
      });
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 150,
        margin: 1,
      });

      // Add Logo at top-left (if exists)
      const logoPath = path.join(__dirname, "../image/logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 80, height: 80 });
      }

      // HEADER - University Name (adjusted for logo)
      doc
        .fontSize(20)
        .fillColor("#1a237e")
        .font("Helvetica-Bold")
        .text("SIR PADAMPAT SINGHANIA", 130, 40, { align: "left", width: 420 });

      doc
        .fontSize(20)
        .fillColor("#1a237e")
        .font("Helvetica-Bold")
        .text("UNIVERSITY", 130, 63, { align: "left", width: 420 });

      doc
        .fontSize(16)
        .fillColor("#283593")
        .text("CONVOCATION CEREMONY 2025", 130, 90, { align: "left" });

      doc
        .fontSize(11)
        .fillColor("#666666")
        .font("Helvetica")
        .text("Date: 28th October, 2025 | Time: 4:30 PM", 130, 110, {
          align: "left",
        });

      // Decorative line
      doc
        .strokeColor("#1a237e")
        .lineWidth(2)
        .moveTo(40, 130)
        .lineTo(560, 130)
        .stroke();

      // TICKET TITLE
      doc
        .fontSize(22)
        .fillColor("#d32f2f")
        .font("Helvetica-Bold")
        .text("ENTRY TICKET", 40, 150, { align: "center" });

      // Guest Information Box
      const boxTop = 185;
      let boxHeight = 180;

      // Adjust box height based on content
      if (ticket.category === "Degree Students" && enrollment && department) {
        boxHeight = 210;
      } else if (ticket.notes) {
        boxHeight = 200;
      }

      doc.rect(40, boxTop, 520, boxHeight).fillAndStroke("#f5f5f5", "#1a237e");

      doc.fillColor("#000000");
      let yPos = boxTop + 20;

      // Guest Name
      doc.fontSize(11).font("Helvetica-Bold").text("GUEST NAME:", 60, yPos);
      doc
        .fontSize(14)
        .font("Helvetica")
        .text(ticket.userName.toUpperCase(), 180, yPos - 2, { width: 360 });

      yPos += 35;

      // Enrollment Number for Degree Students
      if (ticket.category === "Degree Students" && enrollment) {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("ENROLLMENT NO:", 60, yPos);
        doc.fontSize(11).font("Helvetica").text(enrollment, 180, yPos);

        yPos += 30;
      }

      // Department for Degree Students
      if (ticket.category === "Degree Students" && department) {
        doc.fontSize(11).font("Helvetica-Bold").text("DEPARTMENT:", 60, yPos);
        doc.fontSize(11).font("Helvetica").text(department, 180, yPos);

        yPos += 30;
      }

      // Email - Show for non-degree students or if no enrollment info
      if (ticket.category !== "Degree Students" || !enrollment) {
        if (ticket.email) {
          doc.fontSize(11).font("Helvetica-Bold").text("EMAIL:", 60, yPos);
          doc
            .fontSize(10)
            .font("Helvetica")
            .text(ticket.email, 180, yPos + 1);

          yPos += 30;
        }
      }

      // Category
      doc.fontSize(11).font("Helvetica-Bold").text("CATEGORY:", 60, yPos);
      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor("#1a237e")
        .text(ticket.category.toUpperCase(), 180, yPos);

      yPos += 35;

      // Additional Notes (if any)
      if (ticket.notes) {
        doc
          .fontSize(9)
          .fillColor("#666666")
          .font("Helvetica-Oblique")
          .text(ticket.notes, 60, yPos, { width: 480 });
      }

      // SEAT INFORMATION BOX
      const seatBoxTop = boxTop + boxHeight + 20;
      doc.rect(40, seatBoxTop, 520, 120).fillAndStroke("#fff3e0", "#ff6f00");

      // Seat Number - Large and prominent
      doc
        .fontSize(16)
        .fillColor("#000000")
        .font("Helvetica-Bold")
        .text("SEAT INFORMATION", 60, seatBoxTop + 15);

      doc
        .fontSize(48)
        .fillColor("#d32f2f")
        .font("Helvetica-Bold")
        .text(ticket.seatNumber, 60, seatBoxTop + 45);

      // Row and Section info
      const seatInfo = getSeatDetails(ticket.seatNumber, ticket.category);
      doc
        .fontSize(12)
        .fillColor("#000000")
        .font("Helvetica")
        .text(`Row: ${seatInfo.row}`, 250, seatBoxTop + 50);
      doc.text(`Section: ${seatInfo.section}`, 250, seatBoxTop + 70);

      // QR Code
      const qrX = 420;
      const qrY = seatBoxTop + 20;
      doc.image(qrCodeDataUrl, qrX, qrY, { width: 80, height: 80 });

      // Important Instructions - Positioned carefully to fit on one page
      const instructionsY = seatBoxTop + 140;
      doc
        .fontSize(10)
        .fillColor("#d32f2f")
        .font("Helvetica-Bold")
        .text("IMPORTANT INSTRUCTIONS:", 40, instructionsY);

      const instructions = [
        "• Please arrive 30 minutes before the ceremony starts",
        "• This ticket is non-transferable and must be presented at entry",
        "• Proper formal attire is mandatory",
        "• Photography during the ceremony is restricted to designated areas",
        "• Please maintain decorum throughout the ceremony",
      ];

      doc.fontSize(9).fillColor("#000000").font("Helvetica");

      let instructionY = instructionsY + 18;
      instructions.forEach((instruction) => {
        doc.text(instruction, 40, instructionY, { width: 520 });
        instructionY += 14;
      });

      // Footer - positioned at bottom of page
      doc
        .fontSize(8)
        .fillColor("#999999")
        .font("Helvetica-Oblique")
        .text(`Ticket ID: SPSU-CONV-2025-${ticket.userId}`, 40, 740, {
          align: "center",
        });

      doc
        .fontSize(7)
        .text("For queries, contact: studentwelfare@spsu.ac.in", 40, 755, {
          align: "center",
        });

      doc.end();

      stream.on("finish", () => {
        resolve(fileName);
      });

      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to get seat details
function getSeatDetails(seatNumber, category) {
  // Extract numeric part from seat number
  let seatNum;

  if (category === "Degree Students") {
    seatNum = parseInt(seatNumber.replace("D", ""));

    // Degree students are in rows 7-12 (Display rows 5-10)
    // Row 7: 32 seats (16 left, 16 right)
    if (seatNum <= 16) return { row: "7 (Display 5)", section: "Left" };
    if (seatNum <= 32) return { row: "7 (Display 5)", section: "Right" };

    // Row 8: 34 seats (17 left, 17 right)
    if (seatNum <= 49) return { row: "8 (Display 6)", section: "Left" };
    if (seatNum <= 66) return { row: "8 (Display 6)", section: "Right" };

    // Row 9: 34 seats (17 left, 17 right)
    if (seatNum <= 83) return { row: "9 (Display 7)", section: "Left" };
    if (seatNum <= 100) return { row: "9 (Display 7)", section: "Right" };

    // Row 10: 36 seats (18 left, 18 right)
    if (seatNum <= 118) return { row: "10 (Display 8)", section: "Left" };
    if (seatNum <= 136) return { row: "10 (Display 8)", section: "Right" };

    // Row 11: 36 seats (18 left, 18 right)
    if (seatNum <= 154) return { row: "11 (Display 9)", section: "Left" };
    if (seatNum <= 172) return { row: "11 (Display 9)", section: "Right" };

    // Row 12: 38 seats (19 left, 19 right)
    if (seatNum <= 191) return { row: "12 (Display 10)", section: "Left" };
    return { row: "12 (Display 10)", section: "Right" };
  } else if (category === "Parents") {
    seatNum = parseInt(seatNumber.replace("P", ""));

    // Parents are in rows 13-17 (Display rows 11-15)
    // Row 13: 38 seats (19 left, 19 right)
    if (seatNum <= 19) return { row: "13 (Display 11)", section: "Left" };
    if (seatNum <= 38) return { row: "13 (Display 11)", section: "Right" };

    // Row 14: 40 seats (20 left, 20 right)
    if (seatNum <= 58) return { row: "14 (Display 12)", section: "Left" };
    if (seatNum <= 78) return { row: "14 (Display 12)", section: "Right" };

    // Row 15: 40 seats (20 left, 20 right)
    if (seatNum <= 98) return { row: "15 (Display 13)", section: "Left" };
    if (seatNum <= 118) return { row: "15 (Display 13)", section: "Right" };

    // Row 16: 42 seats (21 left, 21 right)
    if (seatNum <= 139) return { row: "16 (Display 14)", section: "Left" };
    if (seatNum <= 160) return { row: "16 (Display 14)", section: "Right" };

    // Row 17: 42 seats (21 left, 21 right)
    if (seatNum <= 181) return { row: "17 (Display 15)", section: "Left" };
    return { row: "17 (Display 15)", section: "Right" };
  } else {
    // College students in rows 20-27 (Display rows 16-23)
    seatNum = parseInt(seatNumber.replace(/[^\d]/g, ""));

    // Row 20: 44 seats (22 left, 22 right)
    if (seatNum <= 22) return { row: "20 (Display 16)", section: "Left" };
    if (seatNum <= 44) return { row: "20 (Display 16)", section: "Right" };

    // Row 21: 46 seats (23 left, 23 right)
    if (seatNum <= 67) return { row: "21 (Display 17)", section: "Left" };
    if (seatNum <= 90) return { row: "21 (Display 17)", section: "Right" };

    // Row 22: 46 seats (23 left, 23 right)
    if (seatNum <= 113) return { row: "22 (Display 18)", section: "Left" };
    if (seatNum <= 136) return { row: "22 (Display 18)", section: "Right" };

    // Row 23: 48 seats (24 left, 24 right)
    if (seatNum <= 160) return { row: "23 (Display 19)", section: "Left" };
    if (seatNum <= 184) return { row: "23 (Display 19)", section: "Right" };

    // Row 24: 48 seats (24 left, 24 right)
    if (seatNum <= 208) return { row: "24 (Display 20)", section: "Left" };
    if (seatNum <= 232) return { row: "24 (Display 20)", section: "Right" };

    // Row 25: 50 seats (25 left, 25 right)
    if (seatNum <= 257) return { row: "25 (Display 21)", section: "Left" };
    if (seatNum <= 282) return { row: "25 (Display 21)", section: "Right" };

    // Row 26: 50 seats (25 left, 25 right)
    if (seatNum <= 307) return { row: "26 (Display 22)", section: "Left" };
    if (seatNum <= 332) return { row: "26 (Display 22)", section: "Right" };

    // Row 27: 50 seats (25 left, 25 right)
    if (seatNum <= 357) return { row: "27 (Display 23)", section: "Left" };
    return { row: "27 (Display 23)", section: "Right" };
  }
}

// Generate all tickets
async function generateAllTickets() {
  console.log(`🎨 Generating tickets...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < tickets.length; i++) {
    try {
      const fileName = await generateTicket(tickets[i]);
      successCount++;

      if ((i + 1) % 50 === 0) {
        console.log(`   ✓ Generated ${i + 1}/${tickets.length} tickets...`);
      }
    } catch (error) {
      errorCount++;
      console.error(
        `   ✗ Error generating ticket for ${tickets[i].userName}: ${error.message}`
      );
    }
  }

  console.log(`\n✅ TICKET GENERATION COMPLETE!\n`);
  console.log(`   ✓ Successfully generated: ${successCount} tickets`);
  console.log(`   ✗ Errors: ${errorCount}`);
  console.log(`\n📁 Tickets saved in: ${outputDir}`);
  console.log(`📂 Organized by category in subfolders\n`);

  // Create summary file
  const summary = {
    generatedAt: new Date().toISOString(),
    totalTickets: tickets.length,
    successCount,
    errorCount,
    outputDirectory: outputDir,
    categories: {
      degreeStudents: tickets.filter((t) => t.category === "Degree Students")
        .length,
      collegeStudents: tickets.filter((t) => t.category === "College Students")
        .length,
      parents: tickets.filter((t) => t.category === "Parents").length,
      vip: tickets.filter((t) => t.category === "VIP").length,
      guests: tickets.filter((t) => t.category === "Guests").length,
    },
  };

  fs.writeFileSync(
    path.join(outputDir, "generation_summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log(`📊 Summary saved: generation_summary.json\n`);
  console.log(
    `════════════════════════════════════════════════════════════════\n`
  );
}

// Run the generation
generateAllTickets().catch(console.error);
