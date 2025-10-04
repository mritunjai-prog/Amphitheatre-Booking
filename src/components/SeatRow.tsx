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
  const isGuestRow = rowNumber === 1;

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-primary-400/60 hover:bg-white/10 md:px-6 ${
        isGuestRow ? "ring-1 ring-amber-400/60 bg-amber-400/10" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/20 text-lg font-semibold text-primary-100">
          {rowNumber}
        </div>
        {isGuestRow && (
          <span className="badge border-amber-400/50 bg-amber-400/20 text-amber-900">
            👑 Guests Priority Row
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap justify-end gap-2">
          {leftSeats.map((seat) => (
            <Seat
              key={seat.id}
              seat={seat}
              isHighlighted={highlightedSeat === seat.seatNumber}
              onClick={onSeatClick}
            />
          ))}
        </div>

        <div className="mx-auto h-14 w-1 rounded-full bg-gradient-to-b from-white/10 via-primary-400/40 to-white/10 lg:mx-6"></div>

        <div className="flex flex-1 flex-wrap gap-2">
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
