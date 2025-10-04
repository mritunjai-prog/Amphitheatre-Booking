// Types for the application

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: "Students" | "Guests" | "Parents" | "Faculty" | "Alumni";
}

export interface Seat {
  id: string;
  seatNumber: string;
  row: number;
  section: "left" | "right";
  categoryReserved:
    | "Students"
    | "Guests"
    | "Parents"
    | "Faculty"
    | "Alumni"
    | "General";
  status: "available" | "booked";
  assignedUser?: User;
  ticketGenerated?: boolean;
  importedFromCsv?: boolean;
  importNotes?: string;
}

export interface SeatAssignment {
  seatId: string;
  userId: number;
  assignedAt: Date;
}

export interface BookedSeatRecord {
  seatNumber: string;
  userId: number;
  ticketGenerated?: string | boolean;
  notes?: string;
}
