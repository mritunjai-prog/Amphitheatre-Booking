import React, { useState } from "react";
import { Seat, User } from "../types";
import { canUserAccessSeat } from "../utils";

interface SeatModalProps {
  seat: Seat | null;
  users: User[];
  seats: Seat[];
  onClose: () => void;
  onAssign: (seatId: string, userId: string) => void;
  onRemove: (seatId: string) => void;
}

const SeatModal: React.FC<SeatModalProps> = ({
  seat,
  users,
  seats,
  onClose,
  onAssign,
  onRemove,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (!seat) return null;

  // Filter out users who already have seats assigned
  const usersWithSeats = new Set(
    seats
      .filter((s) => s.assignedUser && s.id !== seat.id)
      .map((s) => s.assignedUser!.id)
  );

  const availableUsers = users.filter((user) => !usersWithSeats.has(user.id));

  const eligibleUsers = availableUsers.filter((user) =>
    canUserAccessSeat(seat, user)
  );

  const handleAssign = () => {
    if (selectedUserId) {
      onAssign(seat.id, selectedUserId);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const infoRows = [
    { label: "Seat Number", value: seat.seatNumber.toUpperCase() },
    { label: "Row", value: seat.row },
    { label: "Section", value: seat.section.toUpperCase() },
    { label: "Reserved For", value: seat.categoryReserved },
    { label: "Status", value: seat.status.toUpperCase() },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-2xl">
        <button
          className="absolute right-6 top-5 text-2xl text-white/60 transition hover:text-white"
          onClick={onClose}
          aria-label="Close seat modal"
        >
          ×
        </button>

        <div className="flex flex-col gap-8">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.38em] text-primary-200">
              {seat.importedFromCsv
                ? "Imported reservation"
                : "Manual assignment"}
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Seat {seat.seatNumber.toUpperCase()}
            </h2>
            <p className="text-sm text-slate-300">
              {seat.categoryReserved === "General"
                ? "General admission seat. Assign any attendee category."
                : `Only attendees from the ${seat.categoryReserved} category can be assigned here.`}
            </p>
            {seat.importNotes && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs text-amber-100">
                <span>📌</span>
                {seat.importNotes}
              </div>
            )}
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                Seat Information
              </h3>
              <dl className="mt-4 grid gap-3 text-sm text-slate-200">
                {infoRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/10 px-4 py-3"
                  >
                    <dt className="text-xs uppercase tracking-wide text-slate-400">
                      {row.label}
                    </dt>
                    <dd className="font-medium text-white">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {seat.assignedUser ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Assigned Guest
                </h3>
                <div className="mt-4 space-y-4 text-sm text-slate-200">
                  <div>
                    <p className="text-base font-semibold text-white">
                      {seat.assignedUser.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {seat.assignedUser.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge border-primary-400/40 bg-primary-500/10 text-primary-100">
                      {seat.assignedUser.category}
                    </span>
                    <span className="badge border-white/10 bg-white/5 text-white/80">
                      {seat.assignedUser.phone}
                    </span>
                    {seat.importedFromCsv && (
                      <span className="badge border-amber-400/40 bg-amber-500/15 text-amber-100">
                        Imported from CSV
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Assign a Guest
                </h3>
                <div className="mt-4 space-y-3 text-sm">
                  <label className="block text-xs uppercase tracking-wide text-slate-400">
                    Select an eligible attendee
                  </label>
                  <select
                    className="input-field"
                    value={selectedUserId ?? ""}
                    onChange={(e) =>
                      setSelectedUserId(
                        e.target.value ? e.target.value : null
                      )
                    }
                  >
                    <option value="">Choose a guest…</option>
                    {eligibleUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} · {user.category}
                      </option>
                    ))}
                  </select>
                  {eligibleUsers.length === 0 && (
                    <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                      No eligible users available for this seat category at the
                      moment.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="btn-outline" onClick={onClose}>
              Close
            </button>
            {seat.assignedUser ? (
              <button
                className="btn-gradient bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700"
                onClick={() => onRemove(seat.id)}
              >
                🗑 Remove Assignment
              </button>
            ) : (
              <button
                className="btn-gradient"
                onClick={handleAssign}
                disabled={!selectedUserId || eligibleUsers.length === 0}
              >
                ✅ Assign User
              </button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SeatModal;
