// Professional Ticket Generation System with PDF and QR Code
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

// Read all booked seats
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const csvContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = csvContent.split("\n").slice(1); // Skip header

const tickets = [];

lines.forEach((line) => {
  if (!line.trim()) return;

  const match = line.match(
    /"([^"]+)","([^"]+)",(\d+),"([^"]+)","([^"]+)","([^"]+)","([^"]*)"/
  );
  if (match) {
    const [, category, seatNumber, userId, userName, email, phone, notes] =
      match;
    tickets.push({
      category,
      seatNumber,
      userId: parseInt(userId),
      userName,
      email,
      phone,
      notes,
    });
  }
});

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
  }\n`
);

// Create output directory
const outputDir = path.join(__dirname, "../tickets");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to get ticket prefix based on category
function getTicketPrefix(category) {
  if (category === "Degree Students") return "D";
  if (category === "Faculty") return "F";
  if (category === "College Students") return "C";
  if (category === "VIP") return "V";
  if (category === "Guests") return "G";
  if (category === "Parents") return "P";
  return "T"; // Default fallback
}

// Function to generate a single ticket
async function generateTicket(ticket) {
  return new Promise(async (resolve, reject) => {
    try {
      const prefix = getTicketPrefix(ticket.category);
      const seatNum = ticket.seatNumber.replace(/[^\d]/g, ""); // Extract only numbers
      const fileName = `ticket_${prefix}${seatNum}.pdf`;
      const filePath = path.join(outputDir, fileName);

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

      // Add Logo at top-left
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
      doc.rect(40, boxTop, 520, 180).fillAndStroke("#f5f5f5", "#1a237e");

      doc.fillColor("#000000");
      let yPos = boxTop + 20;

      // Guest Name
      doc.fontSize(11).font("Helvetica-Bold").text("GUEST NAME:", 60, yPos);
      doc
        .fontSize(14)
        .font("Helvetica")
        .text(ticket.userName.toUpperCase(), 180, yPos - 2, { width: 360 });

      yPos += 35;

      // Email - Only show for non-degree students
      if (ticket.category !== "Degree Students") {
        doc.fontSize(11).font("Helvetica-Bold").text("EMAIL:", 60, yPos);
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(ticket.email, 180, yPos + 1);

        yPos += 30;
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

      doc.moveDown(2);

      // SEAT INFORMATION BOX
      const seatBoxTop = doc.y + 20;
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
  // Get actual seat data from the seating system to determine correct section
  // Seats are arranged: Left section (first half) | Right section (second half)

  if (category === "Degree Students") {
    // Degree students are in rows 7-12
    const seatNum = parseInt(seatNumber.replace("D", ""));

    // Row 7: 46 seats (23 left, 23 right)
    if (seatNum <= 23) return { row: "7", section: "Left" };
    if (seatNum <= 46) return { row: "7", section: "Right" };

    // Row 8: 46 seats (23 left, 23 right)
    if (seatNum <= 69) return { row: "8", section: "Left" };
    if (seatNum <= 92) return { row: "8", section: "Right" };

    // Row 9: 44 seats (22 left, 22 right)
    if (seatNum <= 114) return { row: "9", section: "Left" };
    if (seatNum <= 136) return { row: "9", section: "Right" };

    // Row 10: 44 seats (22 left, 22 right)
    if (seatNum <= 158) return { row: "10", section: "Left" };
    if (seatNum <= 180) return { row: "10", section: "Right" };

    // Row 11: 42 seats (21 left, 21 right)
    if (seatNum <= 201) return { row: "11", section: "Left" };
    if (seatNum <= 222) return { row: "11", section: "Right" };

    // Row 12: 42 seats (21 left, 21 right)
    if (seatNum <= 243) return { row: "12", section: "Left" };
    return { row: "12", section: "Right" };
  } else {
    // College students in rows 13-25
    const seatNum = parseInt(seatNumber);

    // Row 13: 42 seats (21 left, 21 right)
    if (seatNum <= 21) return { row: "13", section: "Left" };
    if (seatNum <= 42) return { row: "13", section: "Right" };

    // Row 14: 40 seats (20 left, 20 right)
    if (seatNum <= 62) return { row: "14", section: "Left" };
    if (seatNum <= 82) return { row: "14", section: "Right" };

    // Row 15: 40 seats (20 left, 20 right)
    if (seatNum <= 102) return { row: "15", section: "Left" };
    if (seatNum <= 122) return { row: "15", section: "Right" };

    // Row 16: 38 seats (19 left, 19 right)
    if (seatNum <= 141) return { row: "16", section: "Left" };
    if (seatNum <= 160) return { row: "16", section: "Right" };

    // Row 17: 38 seats (19 left, 19 right)
    if (seatNum <= 179) return { row: "17", section: "Left" };
    if (seatNum <= 198) return { row: "17", section: "Right" };

    // Row 18: 36 seats (18 left, 18 right)
    if (seatNum <= 216) return { row: "18", section: "Left" };
    if (seatNum <= 234) return { row: "18", section: "Right" };

    // Row 19: 36 seats (18 left, 18 right)
    if (seatNum <= 252) return { row: "19", section: "Left" };
    if (seatNum <= 270) return { row: "19", section: "Right" };

    // Row 20: 34 seats (17 left, 17 right)
    if (seatNum <= 287) return { row: "20", section: "Left" };
    if (seatNum <= 304) return { row: "20", section: "Right" };

    // Row 21: 34 seats (17 left, 17 right)
    if (seatNum <= 321) return { row: "21", section: "Left" };
    if (seatNum <= 338) return { row: "21", section: "Right" };

    // Row 22: 32 seats (16 left, 16 right)
    if (seatNum <= 354) return { row: "22", section: "Left" };
    if (seatNum <= 370) return { row: "22", section: "Right" };

    // Row 23: 32 seats (16 left, 16 right)
    if (seatNum <= 386) return { row: "23", section: "Left" };
    if (seatNum <= 402) return { row: "23", section: "Right" };

    // Row 24: 30 seats (15 left, 15 right)
    if (seatNum <= 417) return { row: "24", section: "Left" };
    if (seatNum <= 432) return { row: "24", section: "Right" };

    // Row 25: 30 seats (15 left, 15 right)
    if (seatNum <= 447) return { row: "25", section: "Left" };
    return { row: "25", section: "Right" };
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
  console.log(`\n📁 Tickets saved in: ${outputDir}\n`);

  // Create summary file
  const summary = {
    generatedAt: new Date().toISOString(),
    totalTickets: tickets.length,
    successCount,
    errorCount,
    outputDirectory: outputDir,
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
