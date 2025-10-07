import React, { useState, useEffect } from "react";
import { User, Seat } from "../types";

interface BookedRecord {
  userId: number | null;
  seatNumber: string;
  ticketGenerated?: boolean;
  notes?: string;
}

interface DataViewerProps {
  users: User[];
  seats: Seat[];
  activeTab: "users" | "booked";
  onTabChange: (tab: "users" | "booked") => void;
  onClose: () => void;
  onUsersSave: (users: User[]) => void;
  onBookedSave: (records: BookedRecord[]) => void;
}

const DataViewer: React.FC<DataViewerProps> = ({
  users,
  seats,
  activeTab,
  onTabChange,
  onClose,
  onUsersSave,
  onBookedSave,
}) => {
  const initialUsers = users;
  const bookedSeats = seats.filter((seat) => seat.status === "booked");

  const [usersState, setUsersState] = useState<User[]>(() =>
    initialUsers.map((u) => ({ ...u }))
  );
  const [bookedState, setBookedState] = useState<BookedRecord[]>(() =>
    bookedSeats.map((s) => ({
      userId: s.assignedUser?.id ?? null,
      seatNumber: s.seatNumber,
      ticketGenerated: !!s.ticketGenerated,
      notes: s.importNotes || "",
    }))
  );

  // Reset local copies when props change / tab switch
  useEffect(() => {
    setUsersState(initialUsers.map((u) => ({ ...u })));
  }, [users]);

  useEffect(() => {
    setBookedState(
      bookedSeats.map((s) => ({
        userId: s.assignedUser?.id ?? null,
        seatNumber: s.seatNumber,
        ticketGenerated: !!s.ticketGenerated,
        notes: s.importNotes || "",
      }))
    );
  }, [seats]);

  const downloadCsv = (rows: any[], columns: string[], filename: string) => {
    const header = columns.join(",") + "\n";
    const body = rows
      .map((r) =>
        columns
          .map((c) => {
            const v = r[c] ?? "";
            // escape commas and double quotes
            const safe = String(v).replace(/"/g, '""');
            return `"${safe}"`;
          })
          .join(",")
      )
      .join("\n");

    const csv = header + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleUsersSave = () => {
    onUsersSave(usersState.map((u) => ({ ...u })));
  };

  const handleBookedSave = () => {
    onBookedSave(bookedState.map((r) => ({ ...r })));
  };

  const revertUsers = () => setUsersState(initialUsers.map((u) => ({ ...u })));
  const revertBooked = () =>
    setBookedState(
      bookedSeats.map((s) => ({
        userId: s.assignedUser?.id ?? null,
        seatNumber: s.seatNumber,
        ticketGenerated: !!s.ticketGenerated,
        notes: s.importNotes || "",
      }))
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="glass-card max-h-[90vh] w-full max-w-6xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              📊 CSV Data Viewer
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              View and edit imported user roster and booked seat assignments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeTab === "users")
                  downloadCsv(
                    usersState,
                    ["id", "name", "email", "phone", "category"],
                    "users.csv"
                  );
                else
                  downloadCsv(
                    bookedState.map((r) => ({
                      userId: r.userId ?? "",
                      seatNumber: r.seatNumber,
                      ticketGenerated: r.ticketGenerated ? "true" : "false",
                      notes: r.notes || "",
                    })),
                    ["userId", "seatNumber", "ticketGenerated", "notes"],
                    "booked_seats.csv"
                  );
              }}
              className="btn-secondary"
              title="Download CSV"
            >
              ⬇️ Download CSV
            </button>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 px-6 pt-4">
          <button
            onClick={() => onTabChange("users")}
            className={`px-6 py-3 text-sm font-medium transition rounded-t-xl ${
              activeTab === "users"
                ? "bg-white/10 text-white border-t border-l border-r border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => onTabChange("booked")}
            className={`px-6 py-3 text-sm font-medium transition rounded-t-xl ${
              activeTab === "booked"
                ? "bg-white/10 text-white border-t border-l border-r border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            🎫 Booked Seats ({bookedSeats.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "users" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-slate-400">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {usersState.map((user, idx) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 text-slate-200 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">
                        {user.id}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={user.name}
                          onChange={(e) => {
                            const copy = [...usersState];
                            copy[idx] = { ...copy[idx], name: e.target.value };
                            setUsersState(copy);
                          }}
                          className="w-full bg-transparent text-sm text-slate-200 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={user.email}
                          onChange={(e) => {
                            const copy = [...usersState];
                            copy[idx] = { ...copy[idx], email: e.target.value };
                            setUsersState(copy);
                          }}
                          className="w-full bg-transparent text-sm text-slate-200 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={user.phone}
                          onChange={(e) => {
                            const copy = [...usersState];
                            copy[idx] = { ...copy[idx], phone: e.target.value };
                            setUsersState(copy);
                          }}
                          className="w-full bg-transparent text-sm text-slate-200 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.category}
                          onChange={(e) => {
                            const copy = [...usersState];
                            copy[idx] = {
                              ...copy[idx],
                              category: e.target.value as User["category"],
                            };
                            setUsersState(copy);
                          }}
                          className="bg-transparent text-sm text-slate-200"
                        >
                          <option>VIP</option>
                          <option>Guests</option>
                          <option>Faculty</option>
                          <option>Degree Students</option>
                          <option>College Students</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-slate-400">
                    <th className="px-4 py-3 font-medium">Seat</th>
                    <th className="px-4 py-3 font-medium">User ID</th>
                    <th className="px-4 py-3 font-medium">User Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Ticket</th>
                    <th className="px-4 py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedState.map((rec, idx) => {
                    const user =
                      usersState.find((u) => u.id === rec.userId) || null;
                    return (
                      <tr
                        key={rec.seatNumber}
                        className="border-b border-white/5 text-slate-200 hover:bg-white/5 transition"
                      >
                        <td className="px-4 py-3 font-mono font-semibold text-sm text-primary-300">
                          {rec.seatNumber.toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={rec.userId ?? ""}
                            onChange={(e) => {
                              const copy = [...bookedState];
                              copy[idx] = {
                                ...copy[idx],
                                userId: e.target.value
                                  ? parseInt(e.target.value)
                                  : null,
                              };
                              setBookedState(copy);
                            }}
                            className="bg-transparent text-sm text-slate-200"
                          >
                            <option value="">(unassigned)</option>
                            {usersState.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.id} — {u.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">{user?.name ?? "—"}</td>
                        <td className="px-4 py-3">{user?.email ?? "—"}</td>
                        <td className="px-4 py-3">{user?.category ?? "—"}</td>
                        <td className="px-4 py-3">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!rec.ticketGenerated}
                              onChange={(e) => {
                                const copy = [...bookedState];
                                copy[idx] = {
                                  ...copy[idx],
                                  ticketGenerated: e.target.checked,
                                };
                                setBookedState(copy);
                              }}
                            />
                            <span className="text-xs text-slate-300">
                              Generated
                            </span>
                          </label>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={rec.notes || ""}
                            onChange={(e) => {
                              const copy = [...bookedState];
                              copy[idx] = {
                                ...copy[idx],
                                notes: e.target.value,
                              };
                              setBookedState(copy);
                            }}
                            className="w-full bg-transparent text-sm text-slate-200 focus:outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 bg-white/5 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (activeTab === "users") revertUsers();
                else revertBooked();
              }}
              className="btn-outline"
            >
              Revert
            </button>
            <button
              onClick={() => {
                if (activeTab === "users") handleUsersSave();
                else handleBookedSave();
              }}
              className="btn-primary"
            >
              Apply Changes
            </button>
          </div>

          <p className="text-xs text-slate-400 text-right">
            💡 Edits are in-memory. Use "Download CSV" to export changes or
            "Apply Changes" to save into the app's state. To persist to Google
            Sheets, follow the integration guide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataViewer;
