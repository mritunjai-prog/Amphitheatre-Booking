# Amphitheatre Booking System — Comprehensive Project Report

Generated: October 8, 2025

## 1. Executive summary

This document is a full project report for the Amphitheatre Booking application located at `react-amphitheater-admin`. It captures architecture, feature set, data model, implementation notes, seat allocation logic, recent changes, and operational guidance to run, test, or extend the system. It consolidates development history and configuration from the active workspace and the recent interactive session.

## 2. Project location & repository

- Local workspace: `C:\Users\IAMRO-PC\Downloads\react-amphitheater-admin-complete\react-amphitheater-admin`
- Repository: **Amphitheatre-Booking** (owner: `mritunjai-prog`)
- Branch: `main`

## 3. Technology stack

- React 18 + TypeScript
- Vite (dev server)
- TailwindCSS for styling
- Papa Parse for CSV parsing
- Git for version control

## 4. How to run the project (developer)

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev` (default: http://localhost:3000/)
3. Open the URL in a browser and interact with the UI (seat grid, CSV save/load)

## 5. Data files & location

Two datasets are used (also mirrored in `public/data`):

- `data/users.csv` — user list (id,name,email,phone,category)
- `data/booked_seats.csv` — booked seat records (category,seatNumber,userId,userName,email,phone,notes)

Note: per recent operation, both CSVs have been cleared of sample rows and now contain only headers. This helps start with an empty production-ready dataset.

## 6. Key source files and responsibilities

- `src/utils/index.ts` — core seat generation, CSV parsing helpers, and seat grouping logic.
- `src/components/SeatRow.tsx` — renders an individual row with left/right seat containers and category labels.
- `src/components/Seat.tsx` — single seat UI, colors per category, click/hover handlers.
- `src/App.tsx` — main application, seatCategorySummary, CSV save/load UI, modal integration.
- `public/data/*` — copies of CSVs for static serving.

## 7. Seating allocation & V-shape tapering rules

The seating grid follows a V-shaped (stadium) tapering design: narrowest rows are closest to stage, widest at the back. Key points:

- Rows capped at 25 (no row 26+).
- Last row (row 25) is the widest. Recent update sets it to full 50 seats (25 left + 25 right).
- Tapering rule: Every 2 rows going up, remove 2 seats total (1 from each side). That produces pairs of rows with the same width: e.g. row 25-24 = 50 seats, row 23-22 = 48 seats, row 21-20 = 46 seats, etc.
- All rows maintain even seat counts to ensure left/right symmetry.

## 8. Seat categories and allocation

Categories and row assignments in final configuration:

- Row 1: VIP (purple)
- Rows 2-3: Guests (amber) — 100 seats
- Rows 4-5: Faculty (blue) — 100 seats
- Row 6: Parents (pink) — 50 seats
- Rows 7-12: Degree Students (green)
- Rows 13-25: College Students (cyan) — recently increased cap to 650 to populate full last rows)

## 9. Recent changes (chronology & purpose)

- Removed special-case row calculation (row 25) and standardized tapering calculation for consistency.
- Adjusted seat counts and taper direction so back rows are widest (V-shape).
- Simplified category labels to show only on the first row of each category (rows 1,2,4,6,7,13).
- Aligned final rows (24 & 25) so center divider and seats vertically line up; later updated to full last row with 50 seats.
- Increased `maxStudents` from 566 → 650 to allow filling the full seat plan.
- Cleared sample CSV data in `data/` and `public/data/` (headers retained).
- Committed and pushed changes to `origin/main`.

## 10. Notable code excerpts

Seat per row calculation (pseudo/summary):

```
const getSeatsPerRow = (row) => {
  if (row === 25) return 50;
  const rowsFromBack = 25 - row;
  const reductionPairs = Math.floor(rowsFromBack / 2);
  return Math.max( even(50 - reductionPairs * 2), 10 );
};
```

Note: function ensures even seat counts and a minimum of 10 seats per row.

## 11. How seat IDs are assigned

- Guests: G1..G100
- Faculty: F1..F100
- Parents: P1..P50
- Degree students: D1..
- College students: numeric IDs starting at 1 (1..N)

## 12. UI behavior & features

- Compact seat size for density (small square components).
- Hover and click interactions show seat details and open modals for booking/editing.
- CSV import & manual save/export supported (Papa Parse used client-side).
- Total seat counts by category displayed in the UI.
- Category labels shown on right side of first row of each category to reduce visual clutter.

## 13. Files changed in the most recent commits

Example files modified during the alignment and tapering fixes:

- `src/utils/index.ts` — seat logic & limits
- `src/components/SeatRow.tsx` — layout: fixed containers for symmetry
- `src/components/Seat.tsx` — seat visuals
- `data/*` and `public/data/*` — CSVs cleared

## 14. Git activity

Recent commits (examples):

- "Fix row 25 alignment: Full 50-seat last row with proper V-shape tapering and increased College student capacity to 650"
- "Clear sample data: keep CSV headers only for users and booked_seats"

All changes pushed to `origin/main` successfully.

## 15. Operational checks (quick smoke tests)

1. Start dev server and verify no TS errors: `npm run dev`
2. Open http://localhost:3000/ — ensure seating grid renders (25 rows max) and total counts display
3. Load CSVs (users/booked_seats) if needed — remember they are currently headers-only

## 16. Next steps & recommendations

- Seed real dataset: populate `data/users.csv` and `data/booked_seats.csv` with production records or provide an import UI in admin flows.
- Add automated e2e tests (Cypress/playwright) to validate seat alignment and booking flows.
- Consider storing booked seats server-side or in a DB for persistence and multi-user coordination.
- Optionally implement an export that creates a download-ready CSV automatically after save.

## 17. Appendix

Top-level file list (summary):

```
index.html
package.json
postcss.config.cjs
README.md
vite.config.ts
src/
  App.tsx
  main.tsx
  components/
    SeatRow.tsx
    Seat.tsx
    SeatModal.tsx
  utils/
    index.ts
  types/
    index.ts
data/
  users.csv (headers only)
  booked_seats.csv (headers only)
public/data/
  users.csv (headers only)
  booked_seats.csv (headers only)
```

---

If you'd like this converted to a proper `.docx` I can either:

1. Generate a `.docx` using an npm package (add dependency and script), or
2. Provide a command you can run locally to convert the `REPORT.md` to `report.docx` using `pandoc`.

Tell me which option you'd prefer and whether to commit the new report files to the repo. 