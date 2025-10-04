// Utility functions for CSV parsing and seat management
import Papa from "papaparse";
import { User, Seat, BookedSeatRecord } from "../types";

const normalizeSeatNumber = (seatNumber: string) =>
  seatNumber.trim().toLowerCase();

const seatSuffixFromIndex = (index: number) => {
  let n = index;
  let suffix = "";

  while (n > 0) {
    n--;
    suffix = String.fromCharCode(97 + (n % 26)) + suffix;
    n = Math.floor(n / 26);
  }

  return suffix;
};

const seatSuffixToValue = (suffix: string) => {
  let value = 0;
  const normalized = suffix.toLowerCase();

  for (let i = 0; i < normalized.length; i++) {
    value = value * 26 + (normalized.charCodeAt(i) - 96);
  }

  return value;
};

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

  for (let row = 1; row <= 15; row++) {
    const seatsInRow = row <= 10 ? 70 : 60;
    const seatsPerSection = Math.floor(seatsInRow / 2);

    for (let position = 1; position <= seatsInRow; position++) {
      const suffix = seatSuffixFromIndex(position);
      const seatNumber = `${row}${suffix}`;
      seats.push({
        id: `seat-${seatNumber}`,
        seatNumber,
        row,
        section: position <= seatsPerSection ? "left" : "right",
        categoryReserved: row === 1 ? "Guests" : "General",
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
      const suffixA = a.seatNumber.replace(/^\d+/, "");
      const suffixB = b.seatNumber.replace(/^\d+/, "");
      return seatSuffixToValue(suffixA) - seatSuffixToValue(suffixB);
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
