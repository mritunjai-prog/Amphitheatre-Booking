import React, { useState, useEffect, useMemo, useCallback } from "react";
import { User, Seat } from "./types";
import {
  loadCSVData,
  loadBookedSeatData,
  generateSeats,
  groupSeatsByRow,
  getSeatStatistics,
  exportAssignments,
} from "./utils";
import SeatRow from "./components/SeatRow";
import SeatModal from "./components/SeatModal";
import Notification from "./components/Notification";
import ImportedAssignments from "./components/ImportedAssignments.tsx";

interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  id: number;
}

const parseBoolean = (value: string | boolean | undefined): boolean => {
  if (typeof value === "boolean") return value;
  if (!value) return false;

  const normalized = value.toString().trim().toLowerCase();
  return ["true", "yes", "y", "1"].includes(normalized);
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedSeat, setHighlightedSeat] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showNotification = useCallback(
    (message: string, type: NotificationState["type"]) => {
      const id = Date.now();
      setNotification({ message, type, id });
    },
    []
  );

  const hydrateFromCsv = useCallback(async () => {
    const [userData, bookedSeatData] = await Promise.all([
      loadCSVData("/data/users.csv"),
      loadBookedSeatData("/data/booked_seats.csv"),
    ]);

    const seatLayout = generateSeats();
    const userById = new Map(userData.map((user) => [user.id, user]));
    const seatByNumber = new Map(
      seatLayout.map((seat) => [seat.seatNumber.toLowerCase(), seat])
    );

    bookedSeatData.forEach((record) => {
      const seat = seatByNumber.get(record.seatNumber.toLowerCase());
      const user = userById.get(record.userId);

      if (seat && user) {
        seat.status = "booked";
        seat.assignedUser = user;
        seat.ticketGenerated = parseBoolean(record.ticketGenerated);
        seat.importedFromCsv = true;
        seat.importNotes = record.notes;
      } else {
        console.warn("Unable to hydrate booked seat from CSV", record);
      }
    });

    setUsers(userData);
    setSeats(seatLayout);
  }, []);

  // Load CSV data and initialize seats
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await hydrateFromCsv();
        showNotification(
          "Seat grid and CSV data synced successfully.",
          "success"
        );
      } catch (error) {
        console.error("Error loading data:", error);
        showNotification(
          "Error loading data. Please verify the CSV files.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [hydrateFromCsv, showNotification]);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const foundSeat = seats.find((seat) =>
        seat.seatNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setHighlightedSeat(foundSeat ? foundSeat.seatNumber : null);
    } else {
      setHighlightedSeat(null);
    }
  }, [searchTerm, seats]);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  const handleAssignSeat = (seatId: string, userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      showNotification("User not found!", "error");
      return;
    }

    let assignedSeatNumber = "";
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status: "booked" as const,
              assignedUser: user,
              ticketGenerated: false,
              importedFromCsv: false,
              importNotes: undefined,
            }
          : seat
      )
    );

    const seat = seats.find((s) => s.id === seatId);
    assignedSeatNumber = seat ? seat.seatNumber.toUpperCase() : "";

    setSelectedSeat(null);
    showNotification(
      `Seat ${assignedSeatNumber || seatId} assigned to ${user.name}!`,
      "success"
    );
  };

  const handleRemoveAssignment = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);

    setSeats((prevSeats) =>
      prevSeats.map((s) =>
        s.id === seatId
          ? {
              ...s,
              status: "available" as const,
              assignedUser: undefined,
              ticketGenerated: false,
              importedFromCsv: false,
              importNotes: undefined,
            }
          : s
      )
    );

    setSelectedSeat(null);
    showNotification(
      `Assignment removed for seat ${
        seat?.seatNumber.toUpperCase() || seatId
      }!`,
      "info"
    );
  };

  const handleGenerateTicket = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);

    setSeats((prevSeats) =>
      prevSeats.map((s) =>
        s.id === seatId ? { ...s, ticketGenerated: true } : s
      )
    );

    setSelectedSeat(null);
    showNotification(
      `Ticket generated for seat ${seat?.seatNumber.toUpperCase() || seatId}!`,
      "success"
    );
  };

  const handleExportAssignments = () => {
    try {
      exportAssignments(seats);
      showNotification("Seat assignments exported successfully!", "success");
    } catch (error) {
      showNotification("Error exporting assignments.", "error");
    }
  };

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      await hydrateFromCsv();
      showNotification("CSV data reloaded successfully!", "success");
    } catch (error) {
      showNotification("Error refreshing data.", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const seatsByRow = useMemo(() => groupSeatsByRow(seats), [seats]);
  const statistics = useMemo(() => getSeatStatistics(seats), [seats]);
  const importedAssignments = useMemo(
    () => seats.filter((seat) => seat.importedFromCsv && seat.assignedUser),
    [seats]
  );

  const categorySummary = useMemo(() => {
    const categories: Record<User["category"], number> = {
      Students: 0,
      Guests: 0,
      Parents: 0,
      Faculty: 0,
      Alumni: 0,
    };

    users.forEach((user) => {
      categories[user.category] += 1;
    });

    return categories;
  }, [users]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-200">
        <div className="glass-card max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/20 text-4xl shadow-soft">
            🎭
          </div>
          <h2 className="text-2xl font-semibold text-white">
            Preparing the Amphitheater...
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Syncing seat layout, user roster, and pre-booked reservations from
            CSV files.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-400">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary-400"></span>
            Loading data, please hold tight…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute bottom-[-120px] left-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-10">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 p-10 shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                Annual Function 2025
              </p>
              <h1 className="mt-4 flex items-center gap-3 text-3xl font-semibold text-white md:text-4xl">
                🎭 University Amphitheater Command Center
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
                Orchestrate seating for guests, students, faculty, alumni, and
                parents with live statistics, CSV-driven reservations, and
                on-the-spot ticket generation.
              </p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-4 text-center text-sm text-white/80 backdrop-blur-xl">
              <p className="font-semibold text-white">
                {users.length} attendees loaded
              </p>
              <p className="text-xs uppercase tracking-wide">from CSV roster</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Seats",
              value: statistics.total,
              icon: "🪑",
              accent: "from-white/10 via-white/5 to-white/0",
              highlight: "text-white",
            },
            {
              label: "Assigned",
              value: statistics.booked,
              icon: "👤",
              accent: "from-rose-500/40 via-rose-500/20 to-transparent",
              highlight: "text-rose-100",
            },
            {
              label: "Available",
              value: statistics.available,
              icon: "✨",
              accent: "from-emerald-400/40 via-emerald-400/15 to-transparent",
              highlight: "text-emerald-100",
            },
            {
              label: "Tickets Generated",
              value: statistics.ticketsGenerated,
              icon: "🎫",
              accent: "from-amber-400/40 via-amber-400/15 to-transparent",
              highlight: "text-amber-100",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="glass-card flex items-center justify-between overflow-hidden p-6 transition hover:border-primary-400/60 hover:shadow-lg"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {card.label}
                </p>
                <p className={`mt-3 text-3xl font-semibold ${card.highlight}`}>
                  {card.value}
                </p>
              </div>
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-3xl`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="glass-card space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Operations Console
                </h2>
                <p className="text-sm text-slate-300">
                  Refresh CSV inputs, export allocations, and spotlight any seat
                  instantly.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <button
                  className="btn-gradient"
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Refreshing…" : "🔄 Refresh CSV Data"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleExportAssignments}
                >
                  📥 Export Assignments
                </button>
                <button
                  className="btn-outline"
                  onClick={() => setSearchTerm("")}
                >
                  ✨ Clear Highlight
                </button>
              </div>
              <div className="w-full lg:w-72">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search seat (e.g., 1aa, 5ac, 12c)…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Available Seat",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  label: "Assigned Seat",
                  color: "from-rose-500 to-rose-600",
                },
                {
                  label: "Guest Reservation",
                  color: "from-amber-400 to-amber-500",
                },
                {
                  label: "Highlighted Seat",
                  color: "from-primary-400 to-primary-600",
                },
              ].map((entry) => (
                <div
                  key={entry.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${entry.color}`}
                  ></span>
                  <p className="text-sm font-medium text-slate-200">
                    {entry.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Audience Mix
                </h3>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Users imported from /data/users.csv
                </p>
              </div>
              <span className="badge border-primary-400/40 bg-primary-500/20 text-primary-100">
                {users.length} total
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
              {Object.entries(categorySummary).map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="font-medium">{category}</span>
                  <span className="text-white/80">{count}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Tip: Click on any seat to assign an eligible guest based on
              reserved categories. Guest-row seats enforce category constraints
              automatically.
            </p>
          </div>
        </section>

        <section className="glass-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Amphitheater Layout
              </h2>
              <p className="text-sm text-slate-300">
                Two mirrored sections with a central aisle. Guest-exclusive row
                highlighted.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-wide text-slate-300">
              Stage orientation · Main entrance at base
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-12">
            <div className="flex justify-center">
              <div className="rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-300/30 to-amber-500/20 px-12 py-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-100">
                🎭 Stage
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {Array.from({ length: 15 }, (_, index) => {
                const rowNumber = index + 1;
                const rowData = seatsByRow[rowNumber];

                return (
                  <SeatRow
                    key={rowNumber}
                    rowNumber={rowNumber}
                    leftSeats={rowData?.left || []}
                    rightSeats={rowData?.right || []}
                    highlightedSeat={highlightedSeat}
                    onSeatClick={handleSeatClick}
                  />
                );
              })}
            </div>

            <div className="flex justify-center">
              <div className="rounded-full border border-white/10 bg-white/5 px-10 py-3 text-xs uppercase tracking-[0.4em] text-slate-300">
                🚪 Main Entrance
              </div>
            </div>
          </div>
        </section>

        <ImportedAssignments seats={importedAssignments} />

        {/* Seat Assignment Modal */}
        {selectedSeat && (
          <SeatModal
            seat={selectedSeat}
            users={users}
            onClose={() => setSelectedSeat(null)}
            onAssign={handleAssignSeat}
            onRemove={handleRemoveAssignment}
            onGenerateTicket={handleGenerateTicket}
          />
        )}

        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
