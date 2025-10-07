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
  const isVipRow = rowNumber === 1;
  const isGuestRow = rowNumber === 2;
  const isFacultyRow = rowNumber >= 3 && rowNumber <= 5;
  const isDegreeRow = rowNumber >= 6 && rowNumber <= 9;

  const rowBadge = isVipRow
    ? {
        text: "👑 VIP Row",
        classes: "border-purple-400/50 bg-purple-400/20 text-purple-100",
      }
    : isGuestRow
    ? {
        text: "🎭 Guests Row",
        classes: "border-amber-400/50 bg-amber-400/20 text-amber-100",
      }
    : isFacultyRow
    ? {
        text: "👨‍🏫 Faculty Row",
        classes: "border-blue-400/50 bg-blue-400/20 text-blue-100",
      }
    : isDegreeRow
    ? {
        text: "🎓 Degree Students Row",
        classes: "border-green-400/50 bg-green-400/20 text-green-100",
      }
    : {
        text: "🎓 College Students Row",
        classes: "border-cyan-400/50 bg-cyan-400/20 text-cyan-100",
      };

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 px-3 py-3 transition hover:border-primary-400/60 hover:bg-white/10 ${
        isVipRow
          ? "ring-1 ring-purple-400/60 bg-purple-400/10"
          : isGuestRow
          ? "ring-1 ring-amber-400/60 bg-amber-400/10"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-base font-semibold text-primary-100">
          {rowNumber}
        </div>
        <span className={`badge ${rowBadge.classes} text-xs px-3 py-1`}>
          {rowBadge.text}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-wrap justify-end gap-1.5">
          {leftSeats.map((seat) => (
            <Seat
              key={seat.id}
              seat={seat}
              isHighlighted={highlightedSeat === seat.seatNumber}
              onClick={onSeatClick}
            />
          ))}
        </div>

        <div className="h-10 w-0.5 rounded-full bg-gradient-to-b from-white/10 via-primary-400/40 to-white/10 mx-2"></div>

        <div className="flex flex-1 flex-wrap gap-1.5">
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
