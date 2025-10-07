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
  return (
    <div className="flex items-center gap-2">
      {/* Row number on the left */}
      <div className="flex h-5 w-6 flex-shrink-0 items-center justify-center text-[10px] font-semibold text-slate-400">
        {rowNumber}
      </div>

      {/* Seats */}
      <div className="flex flex-1 items-center justify-center gap-1">
        <div className="flex flex-wrap justify-end gap-0.5">
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

        <div className="flex flex-wrap gap-0.5">
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
    </div>
  );
};

export default SeatRow;
