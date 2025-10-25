// Rebuild booked_seats.csv from Convocation_Seating_Report.docx
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

const wordPath = path.join(__dirname, "../Convocation_Seating_Report.docx");
const dataPath = path.join(__dirname, "../data/booked_seats.csv");
const publicPath = path.join(__dirname, "../public/data/booked_seats.csv");

console.log("📄 Extracting data from Word document...\n");

mammoth
  .extractRawText({ path: wordPath })
  .then((result) => {
    const text = result.value;
    const lines = text.split("\n");

    console.log("✅ Word document loaded\n");
    console.log("🔍 Parsing seat assignments...\n");

    // Parse the document to extract seat assignments
    const seats = {
      VIP: [],
      Guests: [],
      "Degree Students": [],
      Parents: [],
      "College Students": [],
    };

    let currentCategory = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect category headers
      if (line.includes("VIP SEATING") || line.startsWith("VIP (")) {
        currentCategory = "VIP";
        continue;
      }
      if (line.includes("GUEST SEATING") || line.startsWith("Guests (")) {
        currentCategory = "Guests";
        continue;
      }
      if (
        line.includes("DEGREE STUDENTS") ||
        line.startsWith("Degree Students (")
      ) {
        currentCategory = "Degree Students";
        continue;
      }
      if (line.includes("PARENTS SEATING") || line.startsWith("Parents (")) {
        currentCategory = "Parents";
        continue;
      }
      if (
        line.includes("COLLEGE STUDENTS") ||
        line.startsWith("College Students (")
      ) {
        currentCategory = "College Students";
        continue;
      }

      // Skip empty lines and headers
      if (
        !line ||
        line.includes("Seat No.") ||
        line.includes("Row") ||
        line.includes("Section")
      ) {
        continue;
      }

      // Try to extract seat information
      // Format examples:
      // VIP-L1  Ms. Pragya Kewalramani  mspragyakewalramani@vip.com  N/A
      // D1  PARAM TAIMNI  paramtaimni41@gmail.com
      // G-R1  Prof. Ashok Banerjee  profashokbanerjee@vip.com  N/A

      if (currentCategory) {
        // Try to match seat patterns
        const vipMatch = line.match(
          /^(VIP-[LR]\d+)\s+(.+?)\s+([\w@.]+)\s+(.*)$/
        );
        const guestMatch = line.match(
          /^(G-[RL]\d+)\s+(.+?)\s+([\w@.]+)\s+(.*)$/
        );
        const degreeMatch = line.match(/^(D\d+)\s+(.+?)\s+([\w@.]+)\s*(.*)$/);
        const parentMatch = line.match(/^(P\d+)\s+(.+?)\s+([\w@.]+)\s*(.*)$/);
        const collegeMatch = line.match(/^(\d+)\s+(.+?)\s+([\w@.]+)\s+(.*)$/);

        let match =
          vipMatch || guestMatch || degreeMatch || parentMatch || collegeMatch;

        if (match) {
          const seatNumber = match[1].trim();
          const userName = match[2].trim();
          const email = match[3].trim();
          const phone = match[4] ? match[4].trim() : "N/A";

          seats[currentCategory].push({
            seatNumber,
            userName,
            email,
            phone: phone || "N/A",
            notes: "",
          });
        }
      }
    }

    console.log("📊 Extracted seat assignments:");
    let total = 0;
    Object.entries(seats).forEach(([category, list]) => {
      console.log(`   - ${category}: ${list.length} seats`);
      total += list.length;
    });
    console.log(`   - TOTAL: ${total} seats\n`);

    if (total < 700) {
      console.log("⚠️  WARNING: Extracted seat count seems low!");
      console.log(
        "   The Word document parsing may need manual verification.\n"
      );
      console.log(
        "💡 Alternative: Please provide the raw data or check the document manually.\n"
      );
      return;
    }

    // Build new CSV content
    const header = "seatNumber,userName,email,phone,notes";
    let csvContent = header + "\n";

    Object.entries(seats).forEach(([category, list]) => {
      if (list.length > 0) {
        csvContent += `# ${category.toUpperCase()}\n`;
        list.forEach((seat) => {
          csvContent += `${seat.seatNumber},${seat.userName},${seat.email},${seat.phone},${seat.notes}\n`;
        });
      }
    });

    // Write to both locations
    fs.writeFileSync(dataPath, csvContent, "utf-8");
    fs.writeFileSync(publicPath, csvContent, "utf-8");

    console.log("✅ CSV files rebuilt successfully!\n");
    console.log("📁 Updated files:");
    console.log("   - data/booked_seats.csv");
    console.log("   - public/data/booked_seats.csv\n");
  })
  .catch((err) => {
    console.error("❌ Error reading Word document:", err.message);
    console.log("\n💡 The mammoth package may need to be installed:");
    console.log("   npm install mammoth\n");
  });
