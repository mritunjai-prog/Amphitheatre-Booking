import React from "react";
import { Seat as SeatType } from "../types";
import Seat from "./Seat";

interface SeatRowProps {
  rowNumber: number;
  leftSeats: SeatType[];
  rightSeats: SeatType[];
  highlightedSeat: string | null;
  onSeatClick: (seat: SeatType) => void;
}

const SeatRow: React.FC<SeatRowProps> = ({
  rowNumber,
  leftSeats,
  rightSeats,
  highlightedSeat,
  onSeatClick,
}) => {
  // Determine the category label based on row number (ONLY for first row of each category)
  const getCategoryInfo = (row: number): { label: string; color: string } => {
    if (row === 1) return { label: "VIP", color: "text-purple-400" };
    if (row === 2) return { label: "Guests", color: "text-amber-400" };
    if (row === 4) return { label: "Faculty", color: "text-blue-400" };
    if (row === 6) return { label: "Parents", color: "text-pink-400" };
    if (row === 7) return { label: "Degree", color: "text-green-400" };
    if (row === 13) return { label: "College", color: "text-cyan-400" };
    return { label: "", color: "text-slate-400" };
  };

  const categoryInfo = getCategoryInfo(rowNumber);

  // Calculate the maximum seats per side for proper alignment (based on widest row)
  const maxSeatsPerSide = 25; // Row 25 (last row) has 25 seats per side = 50 total

  return (
    <div className="flex items-center gap-2">
      {/* Row number on the left */}
      <div className="flex h-5 w-6 flex-shrink-0 items-center justify-center text-[10px] font-semibold text-slate-400">
        {rowNumber}
      </div>

      {/* Seats */}
      <div className="flex flex-1 items-center justify-center gap-1">
        {/* Left seats - right aligned with fixed width */}
        <div
          className="flex flex-wrap justify-end gap-0.5"
          style={{ minWidth: `${maxSeatsPerSide * 22}px` }}
        >
          {leftSeats.map((seat) => (
            <Seat
              key={seat.id}
              seat={seat}
              isHighlighted={highlightedSeat === seat.seatNumber}
              onClick={onSeatClick}
            />
          ))}
        </div>

        <div className="h-5 w-px bg-white/20 mx-1"></div>

        {/* Right seats - left aligned with fixed width */}
        <div
          className="flex flex-wrap gap-0.5"
          style={{ minWidth: `${maxSeatsPerSide * 22}px` }}
        >
          {rightSeats.map((seat) => (
            <Seat
              key={seat.id}
              seat={seat}
              isHighlighted={highlightedSeat === seat.seatNumber}
              onClick={onSeatClick}
            />
          ))}
        </div>
      </div>

      {/* Category label on the right (only for first row of each category) */}
      <div
        className={`flex h-5 w-16 flex-shrink-0 items-center justify-end text-[10px] font-semibold ${categoryInfo.color}`}
      >
        {categoryInfo.label}
      </div>
    </div>
  );
};

export default SeatRow;
