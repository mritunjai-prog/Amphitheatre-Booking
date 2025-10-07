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
    transform: (value, field) => {
      if (field === "id") return parseInt(value);
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
    transform: (value, field) => {
      if (field === "userId") {
        return parseInt(value, 10);
      }
      return value;
    },
  });

  return results.data
    .filter(
      (record) => Boolean(record.seatNumber) && !Number.isNaN(record.userId)
    )
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
  const seatsPerRow = 50; // 25 left + 25 right
  const seatsPerSection = 25;

  // Counter for different seat number schemes
  let guestCounter = 1;
  let facultyCounter = 1;
  let degreeCounter = 1;
  let studentCounter = 1;

  for (let row = 1; row <= 29; row++) {
    for (let position = 1; position <= seatsPerRow; position++) {
      let seatNumber = "";
      let category: Seat["categoryReserved"] = "General";

      // Row 1: VIP (numbered VIP-1 to VIP-50)
      if (row === 1) {
        seatNumber = `VIP-${position}`;
        category = "VIP";
      }
      // Row 2: Guests (G1 to G50)
      else if (row === 2) {
        seatNumber = `G${guestCounter++}`;
        category = "Guests";
      }
      // Rows 3-5: Faculty (F1 to F150)
      else if (row >= 3 && row <= 5) {
        seatNumber = `F${facultyCounter++}`;
        category = "Faculty";
      }
      // Rows 6-9: Degree Students (D1 to D200)
      else if (row >= 6 && row <= 9) {
        seatNumber = `D${degreeCounter++}`;
        category = "Degree Students";
      }
      // Rows 10-29: College Students (1 to 1000)
      else {
        seatNumber = `${studentCounter++}`;
        category = "College Students";
      }

      seats.push({
        id: `seat-${seatNumber}`,
        seatNumber,
        row,
        section: position <= seatsPerSection ? "left" : "right",
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
  const ticketsGenerated = seats.filter((seat) => seat.ticketGenerated).length;

  return {
    total,
    booked,
    available,
    ticketsGenerated,
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
    ticketGenerated: seat.ticketGenerated ? "Yes" : "No",
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
