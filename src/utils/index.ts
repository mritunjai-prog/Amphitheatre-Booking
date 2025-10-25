// Utility functions for CSV parsing and seat management
import Papa from "papaparse";
import { User, Seat, BookedSeatRecord } from "../types";

const normalizeSeatNumber = (seatNumber: string) =>
  seatNumber.trim().toLowerCase();

// Parse CSV data
export const parseCSVData = (csvText: string): User[] => {
  const results = Papa.parse<User>(csvText, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => {
      // Keep id as string since it can be "D1", "C1", etc.
      return value;
    },
  });

  return results.data;
};

// Load CSV file
export const loadCSVData = async (filePath: string): Promise<User[]> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    return parseCSVData(csvText);
  } catch (error) {
    console.error("Error loading CSV:", error);
    return [];
  }
};

// Parse booked seats CSV
export const parseBookedSeatsData = (csvText: string): BookedSeatRecord[] => {
  const results = Papa.parse<BookedSeatRecord>(csvText, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => {
      // Keep userId as string since it can be "D1", "C1", etc.
      return value;
    },
  });

  return results.data
    .filter((record) => Boolean(record.seatNumber))
    .map((record) => ({
      ...record,
      seatNumber: normalizeSeatNumber(record.seatNumber as string),
      // If userId is not provided, default to seatNumber (new CSV format)
      userId: record.userId || record.seatNumber,
    }));
};

// Load booked seat assignments from CSV
export const loadBookedSeatData = async (
  filePath: string
): Promise<BookedSeatRecord[]> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    return parseBookedSeatsData(csvText);
  } catch (error) {
    console.error("Error loading booked seats CSV:", error);
    return [];
  }
};

// Generate all seats for the amphitheater
export const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];

  // Counter for different seat number schemes
  let guestCounter = 1;
  let facultyCounter = 1;
  let parentsCounter = 1;
  let degreeCounter = 1;
  let studentCounter = 1;
  let pressCounter = 1;

  // Total seats to allocate (actual capacity per user requirements)
  const maxGuests = 14; // Row 2 right side: 14 seats for Guests
  const maxPress = 14; // Row 2 left side: 14 seats for Press
  const maxFaculty = 60; // 2 rows of Faculty (30 + 30)
  const maxParents = 202; // Parents section expanded to 202 seats (rows 13-17: 38+40+40+42+42)
  const maxStudents = 388; // College Students (rows 20-27, with tapering for symmetry)

  // V-SHAPE TAPERING (REVERSE TAPERING)
  // Last row = 50 seats (widest, back)
  // Row 1 = narrowest (front, closest to stage)
  // Every 2 rows going UP (towards row 1), remove 2 seats TOTAL (1 from each side)

  // Total rows configuration:
  // Row 1: VIP (26 seats)
  // Row 2: Press (left) + Guests (right) (28 seats)
  // Row 3: REMOVED (0 seats)
  // Rows 4-5: Faculty (30 seats each) - display as rows 3-4
  // Row 6: REMOVED (0 seats)
  // Rows 7-12: Degree Students (210 seats) - display as rows 5-10
  // Rows 13-17: Parents (202 seats: 38+40+40+42+42) - display as rows 11-15
  // Rows 18-19: SKIPPED (no seats)
  // Rows 20-27: College Students (388 seats) - display as rows 16-23
  const totalRows = 27; // Keep original to 27 for seat generation

  // Function to get seats per row - V-SHAPE (reverse tapering) + FIXED front rows
  // Original row numbers for seat calculation
  const getSeatsPerRow = (row: number): number => {
    // Fixed seats for front rows
    if (row === 1) return 26; // VIP: 26 seats
    if (row === 2) return 28; // Row 2: 28 seats (14 Guests left + 14 Press right)
    if (row === 3) return 0; // Row 3: REMOVED - no more guests
    if (row === 4) return 30; // Faculty Row 1: 30 seats
    if (row === 5) return 30; // Faculty Row 2: 30 seats
    if (row === 6) return 0; // Row 6 REMOVED - no seats

    // Rows 17-19: SKIPPED (no seats) - but row 17 now used for parents
    if (row >= 18 && row <= 19) return 0;

    // V-shape tapering for student sections (rows 7-27, excluding 16-19)
    // Rows 25-27 get 50 seats (widest back section)
    if (row >= 25) return 50; // Rows 25-27 all get 50 seats (widest)

    const rowsFromBack = 25 - row;
    const reductionPairs = Math.floor(rowsFromBack / 2);
    const seatsRemoved = reductionPairs * 2;
    const calculatedSeats = 50 - seatsRemoved;
    return Math.max(
      calculatedSeats % 2 === 0 ? calculatedSeats : calculatedSeats - 1,
      10
    );
  };

  // Map physical row to display row (continuous numbering)
  const getDisplayRow = (physicalRow: number): number => {
    if (physicalRow <= 2) return physicalRow; // Rows 1-2 stay same
    if (physicalRow === 3) return 3; // Skip row 3 (0 seats)
    if (physicalRow === 4) return 3; // Faculty row 1 → display row 3
    if (physicalRow === 5) return 4; // Faculty row 2 → display row 4
    if (physicalRow === 6) return 5; // Skip row 6 (0 seats)
    if (physicalRow >= 7 && physicalRow <= 12) return physicalRow - 2; // Degree rows 7-12 → display 5-10
    if (physicalRow >= 13 && physicalRow <= 17) return physicalRow - 2; // Parents rows 13-17 → display 11-15
    if (physicalRow >= 18 && physicalRow <= 19) return physicalRow - 2; // Skip rows 18-19
    if (physicalRow >= 20) return physicalRow - 4; // College rows 20-27 → display 16-23
    return physicalRow;
  };

  // Now generate the actual seats
  for (let row = 1; row <= totalRows; row++) {
    const seatsInThisRow = getSeatsPerRow(row);
    if (seatsInThisRow === 0) continue; // Skip rows with 0 seats

    const displayRow = getDisplayRow(row);
    const seatsPerSide = Math.floor(seatsInThisRow / 2);
    const hasOddSeat = seatsInThisRow % 2 === 1;

    for (let position = 1; position <= seatsInThisRow; position++) {
      let seatNumber = "";
      let category: Seat["categoryReserved"] = "General";
      let section: "left" | "right" =
        position <= seatsPerSide ? "left" : "right";

      if (hasOddSeat && position === seatsPerSide + 1) {
        section = "left"; // Middle seat goes to left
      }

      // Row 1: VIP - Numbering from center outward
      // Left side: position 1 (far left) = L13, position 13 (center) = L1
      // Right side: position 14 (center) = R1, position 26 (far right) = R13
      if (row === 1) {
        if (section === "left") {
          // Reverse numbering: position 1 = L13, position 13 = L1
          seatNumber = `VIP-L${seatsPerSide - position + 1}`;
        } else {
          // Normal numbering: position 14 = R1, position 26 = R13
          seatNumber = `VIP-R${position - seatsPerSide}`;
        }
        category = "VIP";
      }
      // Row 2: Left side = Press, Right side = Guests
      else if (row === 2) {
        if (section === "left" && pressCounter <= maxPress) {
          // Left side: Press numbered from right to left (P-L14 to P-L1)
          const leftSeatNum = seatsPerSide - (position - 1);
          seatNumber = `P-L${leftSeatNum}`;
          category = "Press";
          pressCounter++;
        } else if (section === "right" && guestCounter <= maxGuests) {
          // Right side: Guests numbered from left to right (G-R1 to G-R14)
          const rightSeatNum = position - seatsPerSide;
          seatNumber = `G-R${rightSeatNum}`;
          category = "Guests";
          guestCounter++;
        } else {
          continue;
        }
      }
      // Rows 4-5: Faculty (F1 to F60, exactly 60 seats, 2 rows)
      else if (row >= 4 && row <= 5 && facultyCounter <= maxFaculty) {
        seatNumber = `F${facultyCounter++}`;
        category = "Faculty";
      }
      // Rows 7-12: Degree Students (all seats in these rows)
      else if (row >= 7 && row <= 12) {
        seatNumber = `D${degreeCounter++}`;
        category = "Degree Students";
      }
      // Rows 13-17: Parents (176 seats total with tapering)
      else if (row >= 13 && row <= 17 && parentsCounter <= maxParents) {
        seatNumber = `P${parentsCounter++}`;
        category = "Parents";
      }
      // Rows 20-27: College Students (all seats in these rows, max 388)
      else if (row >= 20 && row <= 27 && studentCounter <= maxStudents) {
        seatNumber = `${studentCounter++}`;
        category = "College Students";
      }
      // Skip any remaining seats after limits reached
      else {
        continue;
      }

      seats.push({
        id: `seat-${seatNumber}`,
        seatNumber,
        row: displayRow, // Use display row for continuous numbering
        section,
        categoryReserved: category,
        status: "available",
      });
    }
  }

  return seats;
};

// Group seats by row for rendering
export const groupSeatsByRow = (seats: Seat[]) => {
  const seatsByRow: { [key: number]: { left: Seat[]; right: Seat[] } } = {};

  seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = { left: [], right: [] };
    }
    seatsByRow[seat.row][seat.section].push(seat);
  });

  // Sort seats within each section
  Object.keys(seatsByRow).forEach((row) => {
    const rowNum = parseInt(row, 10);
    const sorter = (a: Seat, b: Seat) => {
      // Extract numbers from seat labels (VIP-1 -> 1, G1 -> 1, F1 -> 1, D1 -> 1, 1 -> 1)
      const numA = parseInt(a.seatNumber.replace(/^[A-Z]+-?/, ""), 10);
      const numB = parseInt(b.seatNumber.replace(/^[A-Z]+-?/, ""), 10);
      return numA - numB;
    };
    seatsByRow[rowNum].left.sort(sorter);
    seatsByRow[rowNum].right.sort(sorter);
  });

  return seatsByRow;
};

// Check if user can access seat based on category
export const canUserAccessSeat = (seat: Seat, user: User): boolean => {
  if (seat.categoryReserved === "General") return true;
  return seat.categoryReserved === user.category;
};

// Generate seat statistics
export const getSeatStatistics = (seats: Seat[]) => {
  const total = seats.length;
  const booked = seats.filter((seat) => seat.status === "booked").length;
  const available = total - booked;

  return {
    total,
    booked,
    available,
  };
};

// Export/download seat assignments as CSV
export const exportAssignments = (seats: Seat[]) => {
  const assignedSeats = seats.filter((seat) => seat.assignedUser);

  const csvData = assignedSeats.map((seat) => ({
    seatNumber: seat.seatNumber,
    row: seat.row,
    section: seat.section,
    userName: seat.assignedUser?.name,
    userEmail: seat.assignedUser?.email,
    userPhone: seat.assignedUser?.phone,
    userCategory: seat.assignedUser?.category,
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `seat-assignments-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Export/download booked seats in the exact CSV format
export const exportBookedSeatsCSV = (seats: Seat[]) => {
  const bookedSeats = seats.filter((seat) => seat.assignedUser);

  // Group by category
  const categorized: Record<string, Seat[]> = {
    VIP: [],
    Guests: [],
    Press: [],
    Faculty: [],
    "Degree Students": [],
    "College Students": [],
  };

  bookedSeats.forEach((seat) => {
    const category = seat.assignedUser?.category;
    if (category && categorized[category]) {
      categorized[category].push(seat);
    }
  });

  // Build CSV content with simplified format (no category or userId columns)
  let csvContent = "seatNumber,userName,email,phone,notes\n";

  Object.entries(categorized).forEach(([category, seats]) => {
    if (seats.length > 0) {
      csvContent += `\n# ${category.toUpperCase()}\n`;
      seats.forEach((seat) => {
        const user = seat.assignedUser;
        // Only output: seatNumber, userName, email, phone, notes
        // Category can be derived from seat prefix (VIP-, D, P, G-, etc.)
        // userId was redundant (always same as seatNumber)
        const row = `${seat.seatNumber},${user?.name},${user?.email},${
          user?.phone
        },${seat.importNotes || ""}`;
        csvContent += row + "\n";
      });
    }
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "booked_seats.csv";
  link.click();
  window.URL.revokeObjectURL(url);
};
