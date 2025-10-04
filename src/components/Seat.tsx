import React from "react";
import { Seat as SeatType } from "../types";

interface SeatProps {
  seat: SeatType;
  isHighlighted: boolean;
  onClick: (seat: SeatType) => void;
}

const Seat: React.FC<SeatProps> = ({ seat, isHighlighted, onClick }) => {
  const baseClass =
    "relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-xs font-semibold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 hover:scale-[1.05] hover:shadow-lg";

  const palette =
    seat.status === "booked"
      ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/30"
      : seat.categoryReserved === "Guests"
      ? "bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 shadow-amber-400/40"
      : "bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 shadow-emerald-500/30";

  const highlightClass = isHighlighted
    ? "animate-pulse-glow ring-2 ring-primary-200 ring-offset-2 ring-offset-slate-950"
    : "";

  const tooltip = (() => {
    let title = `Seat ${seat.seatNumber.toUpperCase()}`;

    if (seat.assignedUser) {
      title += ` · Assigned to ${seat.assignedUser.name}`;
      if (seat.ticketGenerated) {
        title += " · Ticket Generated";
      }
    } else if (seat.categoryReserved !== "General") {
      title += ` · Reserved for ${seat.categoryReserved}`;
    } else {
      title += " · Available";
    }

    if (seat.importedFromCsv) {
      title += " · Imported from CSV";
    }

    return title;
  })();

  const seatLabel = seat.seatNumber.toUpperCase();

  return (
    <button
      className={`${baseClass} ${palette} ${highlightClass}`}
      onClick={() => onClick(seat)}
      title={tooltip}
      data-seat-id={seat.id}
      data-seat-number={seat.seatNumber}
    >
      {seat.importedFromCsv && (
        <span
          className="absolute left-1 top-1 inline-flex h-2 w-2 animate-pulse rounded-full bg-white/90 shadow"
          title="Imported from CSV"
        />
      )}
      {seat.ticketGenerated && (
        <span
          className="absolute right-1 top-1 text-[10px]"
          role="img"
          aria-label="Ticket generated"
        >
          🎫
        </span>
      )}
      <span>{seatLabel}</span>
    </button>
  );
};

export default Seat;
