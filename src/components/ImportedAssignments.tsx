import React from "react";
import { Seat } from "../types";

interface ImportedAssignmentsProps {
  seats: Seat[];
}

const ImportedAssignments: React.FC<ImportedAssignmentsProps> = ({ seats }) => {
  const total = seats.length;
  const preview = seats.slice(0, 8);

  return (
    <section className="glass-card space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Imported Reservations
          </h3>
          <p className="text-sm text-slate-300">
            Seats pre-assigned via{" "}
            <span className="font-semibold text-primary-200">
              /data/booked_seats.csv
            </span>{" "}
            are hydrated automatically and kept in sync.
          </p>
        </div>
        <span className="badge border-emerald-400/40 bg-emerald-500/10 text-emerald-100">
          {total} imported
        </span>
      </div>

      {total === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-slate-300">
          No reservations were imported from CSV. Assign seats manually and
          export the roster when ready.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="min-w-full divide-y divide-white/5 text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3">Seat</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {preview.map((seat) => (
                <tr key={seat.id} className="hover:bg-white/5">
                  <td className="px-5 py-4 font-semibold text-white">
                    {seat.seatNumber.toUpperCase()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-white/90">
                      {seat.assignedUser?.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {seat.assignedUser?.email}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="badge border-white/10 bg-white/10 text-white/80">
                      {seat.assignedUser?.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-300">
                    {seat.importNotes ? seat.importNotes : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total > preview.length && (
            <div className="border-t border-white/10 bg-white/5 px-5 py-3 text-xs text-slate-400">
              Showing first {preview.length} of {total} imported reservations.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ImportedAssignments;
