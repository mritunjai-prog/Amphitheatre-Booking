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
    .filter((record) => Boolean(record.seatNumber) && Boolean(record.userId))
    .map((record) => ({
      ...record,
      seatNumber: normalizeSeatNumber(record.seatNumber as string),
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

  // Total seats to allocate (actual capacity per user requirements)
  const maxGuests = 56; // 2 rows of Guests (28 + 28)
  const maxFaculty = 60; // 2 rows of Faculty (30 + 30)
  const maxParents = 290; // Parents section (rows 13-19, with tapering)
  const maxStudents = 388; // College Students (rows 20-27, with tapering for symmetry)

  // V-SHAPE TAPERING (REVERSE TAPERING)
  // Last row = 50 seats (widest, back)
  // Row 1 = narrowest (front, closest to stage)
  // Every 2 rows going UP (towards row 1), remove 2 seats TOTAL (1 from each side)

  // Total rows configuration:
  // Row 1: VIP (26 seats)
  // Rows 2-3: Guests (28 seats each)
  // Rows 4-5: Faculty (30 seats each)
  // Row 6: REMOVED (0 seats)
  // Rows 7-12: Degree Students (210 seats)
  // Rows 13-19: Parents (290 seats)
  // Rows 20-27: College Students (388 seats)
  const totalRows = 27; // Fixed to row 27 to accommodate all sections

  // Function to get seats per row - V-SHAPE (reverse tapering) + FIXED front rows
  // Rows 1-5: FIXED seat counts matching user requirements
  // Rows 7-28: V-SHAPE tapering (Degree + Parents + College sections)
  // Row 6: REMOVED (skipped)
  const getSeatsPerRow = (row: number): number => {
    // Fixed seats for front rows (actual capacity from user requirements)
    if (row === 1) return 26; // VIP: 26 seats
    if (row === 2) return 28; // Guests Row 1: 28 seats
    if (row === 3) return 28; // Guests Row 2: 28 seats
    if (row === 4) return 30; // Faculty Row 1: 30 seats
    if (row === 5) return 30; // Faculty Row 2: 30 seats
    if (row === 6) return 0; // Row 6 REMOVED - no seats

    // V-shape tapering for ALL student sections (rows 7-28)
    // Rows 25-28 get 50 seats (widest back section)
    // Row 7 gets 32 seats (narrowest front)
    // Remove 2 seats TOTAL (1 from each side) every 2 rows going UP from row 25
    if (row >= 25) return 50; // Rows 25-28 all get 50 seats (widest)

    const rowsFromBack = 25 - row; // 0 for row 25, 1 for row 24, etc.
    const reductionPairs = Math.floor(rowsFromBack / 2);
    const seatsRemoved = reductionPairs * 2;
    const calculatedSeats = 50 - seatsRemoved;
    return Math.max(
      calculatedSeats % 2 === 0 ? calculatedSeats : calculatedSeats - 1,
      10
    );
  };

  // Degree Students fill rows 8-13

  // Now generate the actual seats
  for (let row = 1; row <= totalRows; row++) {
    const seatsInThisRow = getSeatsPerRow(row);
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

      // Row 1: VIP (numbered VIP-1 to VIP-50)
      if (row === 1) {
        seatNumber = `VIP-${position}`;
        category = "VIP";
      }
      // Rows 2-3: Guests (G1 to G100, 2 rows)
      else if (row >= 2 && row <= 3 && guestCounter <= maxGuests) {
        seatNumber = `G${guestCounter++}`;
        category = "Guests";
      }
      // Rows 4-5: Faculty (F1 to F100, exactly 100 seats, 2 rows)
      else if (row >= 4 && row <= 5 && facultyCounter <= maxFaculty) {
        seatNumber = `F${facultyCounter++}`;
        category = "Faculty";
      }
      // Row 6: REMOVED - skip this row entirely
      else if (row === 6) {
        continue; // Skip row 6 completely
      }
      // Rows 7-12: Degree Students (all seats in these rows)
      else if (row >= 7 && row <= 12) {
        seatNumber = `D${degreeCounter++}`;
        category = "Degree Students";
      }
      // Rows 13-19: Parents (290 seats total with tapering)
      else if (row >= 13 && row <= 19 && parentsCounter <= maxParents) {
        seatNumber = `P${parentsCounter++}`;
        category = "Parents";
      }
      // Rows 20-28: College Students (400 seats with tapering for symmetry)
      else if (row >= 20 && studentCounter <= maxStudents) {
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
        row,
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
    Guests: [],
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

  // Build CSV content with category headers
  let csvContent = "category,seatNumber,userId,userName,email,phone,notes\n";

  Object.entries(categorized).forEach(([category, seats]) => {
    if (seats.length > 0) {
      csvContent += `\n# ${category.toUpperCase()}\n`;
      seats.forEach((seat) => {
        const user = seat.assignedUser;
        const row = `${user?.category},${seat.seatNumber},${user?.id},${
          user?.name
        },${user?.email},${user?.phone},${seat.importNotes || ""}`;
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
