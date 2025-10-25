// Types for the application

export interface User {
  id: string; // Changed from number to string to support "D1", "C1", etc.
  name: string;
  email: string;
  phone: string;
  category:
    | "VIP"
    | "Guests"
    | "Press"
    | "Faculty"
    | "Parents"
    | "Degree Students"
    | "College Students";
}

export interface Seat {
  id: string;
  seatNumber: string;
  row: number;
  section: "left" | "right";
  categoryReserved:
    | "VIP"
    | "Guests"
    | "Press"
    | "Faculty"
    | "Parents"
    | "Degree Students"
    | "College Students"
    | "General";
  status: "available" | "booked";
  assignedUser?: User;
  importedFromCsv?: boolean;
  importNotes?: string;
}

export interface SeatAssignment {
  seatId: string;
  userId: string; // Changed from number to string to support "D1", "C1", etc.
  assignedAt: Date;
}

export interface BookedSeatRecord {
  category?: string; // Optional - can be derived from seatNumber prefix
  seatNumber: string;
  userId?: string; // Optional - defaults to seatNumber if not provided
  userName?: string;
  email?: string;
  phone?: string;
  notes?: string;
}
