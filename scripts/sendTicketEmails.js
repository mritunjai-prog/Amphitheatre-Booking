// Email Ticket Sending System
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Try to load email configuration
let emailConfig;
try {
  emailConfig = require("./emailConfig.js");
} catch (error) {
  console.error("\n❌ ERROR: emailConfig.js not found!");
  console.error("\n📝 Please follow these steps:");
  console.error("   1. Copy emailConfig.template.js to emailConfig.js");
  console.error("   2. Update emailConfig.js with your SMTP credentials");
  console.error("   3. Run this script again\n");
  process.exit(1);
}

// Read all booked seats
const bookedSeatsPath = path.join(__dirname, "../data/booked_seats.csv");
const csvContent = fs.readFileSync(bookedSeatsPath, "utf-8");
const lines = csvContent.split("\n").slice(1); // Skip header

const recipients = [];

// Helper function to get ticket prefix based on category
function getTicketPrefix(category) {
  if (category === "Degree Students") return "D";
  if (category === "Faculty") return "F";
  if (category === "College Students") return "C";
  if (category === "VIP") return "V";
  if (category === "Guests") return "G";
  if (category === "Parents") return "P";
  return "T"; // Default fallback
}

lines.forEach((line) => {
  if (!line.trim()) return;

  const match = line.match(
    /"([^"]+)","([^"]+)",(\d+),"([^"]+)","([^"]+)","([^"]+)","([^"]*)"/
  );
  if (match) {
    const [, category, seatNumber, userId, userName, email, phone, notes] =
      match;
    const prefix = getTicketPrefix(category);
    const seatNum = seatNumber.replace(/[^\d]/g, ""); // Extract only numbers

    recipients.push({
      category,
      seatNumber,
      userId: parseInt(userId),
      userName,
      email,
      phone,
      notes,
      ticketFile: `ticket_${prefix}${seatNum}.pdf`,
    });
  }
});

console.log(`\n📧 CONVOCATION TICKET EMAIL SENDER`);
console.log(
  `════════════════════════════════════════════════════════════════\n`
);
console.log(`📊 Total emails to send: ${recipients.length}`);
console.log(
  `   - Degree Students: ${
    recipients.filter((r) => r.category === "Degree Students").length
  }`
);
console.log(
  `   - College Students: ${
    recipients.filter((r) => r.category === "College Students").length
  }\n`
);

if (emailConfig.testMode) {
  console.log(
    `⚠️  TEST MODE ENABLED - Emails will only be sent to: ${emailConfig.testEmails.join(
      ", "
    )}\n`
  );
}

// Create email transporter
const transporter = nodemailer.createTransport(emailConfig.smtp);

// Verify SMTP connection
async function verifyConnection() {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!\n");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
    console.error("\n📝 Please check your emailConfig.js settings\n");
    return false;
  }
}

// Generate email HTML content
function generateEmailHTML(recipient) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 2px solid #1a237e;
      border-top: none;
    }
    .greeting {
      font-size: 18px;
      color: #1a237e;
      margin-bottom: 20px;
    }
    .info-box {
      background: #f5f5f5;
      border-left: 4px solid #d32f2f;
      padding: 15px;
      margin: 20px 0;
    }
    .info-box strong {
      color: #d32f2f;
    }
    .seat-info {
      background: #fff3e0;
      border: 2px solid #ff6f00;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
      border-radius: 8px;
    }
    .seat-number {
      font-size: 36px;
      font-weight: bold;
      color: #d32f2f;
      margin: 10px 0;
    }
    .instructions {
      background: #e3f2fd;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .instructions h3 {
      color: #1a237e;
      margin-top: 0;
    }
    .instructions ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
    }
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      border-radius: 0 0 10px 10px;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      background: #d32f2f;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 SIR PADAMPAT SINGHANIA UNIVERSITY</h1>
    <p>CONVOCATION CEREMONY 2025</p>
  </div>
  
  <div class="content">
    <p class="greeting">Dear <strong>${recipient.userName}</strong>,</p>
    
    <p>Congratulations! We are delighted to invite you to the <strong>SPSU Convocation Ceremony 2025</strong>.</p>
    
    <div class="info-box">
      <strong>📅 Date:</strong> 28th December, 2025<br>
      <strong>🕐 Time:</strong> 4:30 PM<br>
      <strong>📍 Venue:</strong> University Amphitheatre
    </div>
    
    <div class="seat-info">
      <p style="margin: 0; font-size: 14px; color: #666;">Your Assigned Seat</p>
      <div class="seat-number">${recipient.seatNumber}</div>
      <p style="margin: 0; font-size: 14px; color: #666;">Category: <strong>${recipient.category}</strong></p>
    </div>
    
    <p><strong>📎 Your Entry Ticket is attached to this email as a PDF.</strong></p>
    <p>Please download and save the ticket. You can either:</p>
    <ul>
      <li>📱 Show the digital ticket on your mobile device at entry</li>
      <li>🖨️ Print the ticket and bring it with you</li>
    </ul>
    
    <div class="instructions">
      <h3>📋 Important Instructions:</h3>
      <ul>
        <li>Please arrive <strong>30 minutes before</strong> the ceremony starts</li>
        <li>This ticket is <strong>non-transferable</strong> and must be presented at entry</li>
        <li><strong>Proper formal attire</strong> is mandatory</li>
        <li>Photography during the ceremony is restricted to designated areas</li>
        <li>Please maintain decorum throughout the ceremony</li>
        <li>Carry a valid <strong>Photo ID</strong> for verification</li>
      </ul>
    </div>
    
    <p style="margin-top: 30px;">We look forward to celebrating this momentous occasion with you!</p>
    
    <p style="margin-top: 20px;">
      <strong>Best Regards,</strong><br>
      Convocation Committee<br>
      Sir Padampat Singhania University
    </p>
  </div>
  
  <div class="footer">
    <p><strong>For any queries, please contact:</strong></p>
    <p>📧 convocation@spsu.ac.in | 📞 +91-XXXX-XXXXXX</p>
    <p style="margin-top: 15px; font-size: 11px;">
      Ticket ID: SPSU-CONV-2025-${recipient.userId}<br>
      This is an automated email. Please do not reply.
    </p>
  </div>
</body>
</html>
  `;
}

// Generate plain text version
function generateEmailText(recipient) {
  return `
Dear ${recipient.userName},

Congratulations! We are delighted to invite you to the SPSU Convocation Ceremony 2025.

EVENT DETAILS:
- Date: 28th December, 2025
- Time: 4:30 PM
- Venue: University Amphitheatre

YOUR SEAT ASSIGNMENT:
Seat Number: ${recipient.seatNumber}
Category: ${recipient.category}

Your entry ticket is attached to this email as a PDF. Please download and save it. You can either show the digital ticket on your mobile device or print it.

IMPORTANT INSTRUCTIONS:
- Arrive 30 minutes before the ceremony starts
- This ticket is non-transferable and must be presented at entry
- Proper formal attire is mandatory
- Carry a valid Photo ID for verification
- Photography during the ceremony is restricted to designated areas
- Please maintain decorum throughout the ceremony

We look forward to celebrating this momentous occasion with you!

Best Regards,
Convocation Committee
Sir Padampat Singhania University

For queries: convocation@spsu.ac.in | +91-XXXX-XXXXXX
Ticket ID: SPSU-CONV-2025-${recipient.userId}
  `;
}

// Send a single email
async function sendEmail(recipient) {
  const ticketPath = path.join(__dirname, "../tickets", recipient.ticketFile);

  // Check if ticket file exists
  if (!fs.existsSync(ticketPath)) {
    throw new Error(`Ticket file not found: ${recipient.ticketFile}`);
  }

  const recipientEmail = emailConfig.testMode
    ? emailConfig.testEmails[0]
    : recipient.email;

  const mailOptions = {
    from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
    to: recipientEmail,
    subject: emailConfig.subject,
    text: generateEmailText(recipient),
    html: generateEmailHTML(recipient),
    attachments: [
      {
        filename: recipient.ticketFile,
        path: ticketPath,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
  return recipientEmail;
}

// Send emails in batches
async function sendAllEmails() {
  const isConnected = await verifyConnection();
  if (!isConnected) {
    return;
  }

  console.log(`📤 Starting email delivery...\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  const targetRecipients = emailConfig.testMode
    ? recipients.slice(0, 5)
    : recipients;

  for (let i = 0; i < targetRecipients.length; i++) {
    try {
      const emailSent = await sendEmail(targetRecipients[i]);
      successCount++;
      console.log(
        `   ✓ [${i + 1}/${targetRecipients.length}] Sent to: ${
          targetRecipients[i].userName
        } (${emailSent})`
      );

      // Batch delay
      if (
        (i + 1) % emailConfig.batchSize === 0 &&
        i < targetRecipients.length - 1
      ) {
        console.log(
          `   ⏳ Waiting ${emailConfig.delayBetweenBatches}ms before next batch...\n`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, emailConfig.delayBetweenBatches)
        );
      }
    } catch (error) {
      errorCount++;
      const errorInfo = {
        recipient: targetRecipients[i].userName,
        email: targetRecipients[i].email,
        error: error.message,
      };
      errors.push(errorInfo);
      console.error(
        `   ✗ [${i + 1}/${targetRecipients.length}] Failed: ${
          targetRecipients[i].userName
        } - ${error.message}`
      );
    }
  }

  console.log(`\n✅ EMAIL SENDING COMPLETE!\n`);
  console.log(`   ✓ Successfully sent: ${successCount} emails`);
  console.log(`   ✗ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log(`\n❌ Failed Emails:\n`);
    errors.forEach((err, idx) => {
      console.log(
        `   ${idx + 1}. ${err.recipient} (${err.email}): ${err.error}`
      );
    });

    // Save error log
    const errorLogPath = path.join(__dirname, "../tickets/email_errors.json");
    fs.writeFileSync(errorLogPath, JSON.stringify(errors, null, 2));
    console.log(`\n📝 Error log saved: ${errorLogPath}`);
  }

  // Create summary
  const summary = {
    sentAt: new Date().toISOString(),
    totalRecipients: targetRecipients.length,
    successCount,
    errorCount,
    testMode: emailConfig.testMode,
    errors: errors,
  };

  const summaryPath = path.join(__dirname, "../tickets/email_summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📊 Summary saved: ${summaryPath}\n`);
  console.log(
    `════════════════════════════════════════════════════════════════\n`
  );
}

// Run the email sending
sendAllEmails().catch(console.error);
