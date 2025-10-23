# Seating Layout Reconfiguration - October 23, 2025

## Overview

Major seating layout reconfiguration to accommodate new parent section requirements and reduce college student capacity.

## Changes Summary

### Row Configuration Changes

- **Row 6 REMOVED**: Previously held 50 Parent seats, now completely skipped
- **Parents Section RELOCATED**: Moved from Row 6 to Rows 13-21 (partial)
- **Parent Capacity INCREASED**: From 50 seats to 368 seats (+318 seats)
- **College Capacity REDUCED**: From 578 seats to 400 seats (-178 seats)
- **Row Range EXTENDED**: From Row 25 maximum to Row 29 maximum (+4 rows)
- **Total Capacity INCREASED**: From 788 seats to 1,228 seats (+440 seats)

## New Seating Layout (29 Rows)

### Fixed Front Rows (Rows 1-5)

- **Row 1**: VIP (50 seats)
- **Rows 2-3**: Guests (100 seats total, 50 per row)
- **Rows 4-5**: Faculty (100 seats total, 50 per row)
- **Row 6**: REMOVED (0 seats) ⚠️

### Student Sections with V-Shape Tapering (Rows 7-29)

- **Rows 7-12**: Degree Students (210 seats total)

  - Row 7: 32 seats
  - Row 8: 34 seats
  - Row 9: 34 seats
  - Row 10: 36 seats
  - Row 11: 36 seats
  - Row 12: 38 seats

- **Rows 13-21 (partial)**: Parents (368 seats total) ← NEW LOCATION

  - Row 13: 38 seats (P1-P38)
  - Row 14: 40 seats (P39-P78)
  - Row 15: 40 seats (P79-P118)
  - Row 16: 42 seats (P119-P160)
  - Row 17: 42 seats (P161-P202)
  - Row 18: 44 seats (P203-P246)
  - Row 19: 44 seats (P247-P290)
  - Row 20: 46 seats (P291-P336)
  - Row 21: 46 seats (P337-P368) + 14 college seats

- **Rows 21 (partial)-29**: College Students (400 seats total) ← REDUCED
  - Row 21: 14 seats (1-14)
  - Row 22: 48 seats (15-62)
  - Row 23: 48 seats (63-110)
  - Row 24: 50 seats (111-160)
  - Row 25: 50 seats (161-210)
  - Row 26: 50 seats (211-260)
  - Row 27: 50 seats (261-310)
  - Row 28: 50 seats (311-360)
  - Row 29: 50 seats (361-400)

## Capacity Summary

### Before Changes (Old Layout)

- VIP: 50 seats (Row 1)
- Guests: 100 seats (Rows 2-3)
- Faculty: 100 seats (Rows 4-5)
- Parents: 50 seats (Row 6)
- Degree Students: 210 seats (Rows 7-12)
- College Students: 578 seats (Rows 13-25)
- **Total: 1,088 seats**

### After Changes (New Layout)

- VIP: 50 seats (Row 1)
- Guests: 100 seats (Rows 2-3)
- Faculty: 100 seats (Rows 4-5)
- Parents: 368 seats (Rows 13-21) ← **+318 seats**
- Degree Students: 210 seats (Rows 7-12)
- College Students: 400 seats (Rows 21-29) ← **-178 seats**
- **Total: 1,228 seats** ← **+140 seats**

## Current Bookings Status

- **Degree Students**: 196 booked / 210 capacity (93% utilization)
- **College Students**: 395 booked / 400 capacity (99% utilization)
- **Parents**: 0 booked / 368 capacity (0% utilization)
- **Overall**: 591 booked / 1,228 capacity (48% utilization)

## Technical Implementation

### Files Modified

1. **src/utils/index.ts**

   - Updated `generateSeats()` function
   - Modified `getSeatsPerRow()` to skip Row 6
   - Extended row range from 25 to 29
   - Updated seat allocation logic for Parents (368) and College (400)
   - Rows 25-29 all get 50 seats (widest back section)

2. **scripts/verifySeatLayout.js**
   - Created verification script to validate seat distribution
   - Confirms all category totals match requirements
   - Validates V-shape tapering symmetry

### Seat Numbering Convention

- **VIP**: VIP-1 to VIP-50
- **Guests**: G1 to G100
- **Faculty**: F1 to F100
- **Parents**: P1 to P368 (NEW)
- **Degree Students**: D1 to D210
- **College Students**: 1 to 400

## V-Shape Tapering Pattern

The amphitheater maintains a V-shape (reverse tapering) design:

- **Front rows (closer to stage)**: Narrower (fewer seats)
- **Back rows (farther from stage)**: Wider (more seats)
- **Formula**: Starting from Row 29 (50 seats), reduce by 2 seats TOTAL (1 per side) every 2 rows going forward
- **Rows 25-29**: All have 50 seats (widest back section)
- **Rows 1-5**: Fixed at 50 seats each (VIP, Guests, Faculty)
- **Row 6**: Completely removed (0 seats)

## Symmetry Considerations

- Each row is split into LEFT and RIGHT sections
- Seat reduction happens evenly (1 seat from each side) every 2 rows
- Middle seat (if odd) goes to LEFT section
- Pattern maintains visual balance across the amphitheater

## Verification Results

✅ All validations passed:

- VIP: 50 seats ✓
- Guests: 100 seats ✓
- Faculty: 100 seats ✓
- Degree Students: 210 seats ✓
- Parents: 368 seats ✓
- College Students: 400 seats ✓
- Total: 1,228 seats ✓

## Next Steps

1. ✅ Seat generation updated in `src/utils/index.ts`
2. ✅ Verification script confirms correct distribution
3. ✅ Dev server running successfully
4. ⏳ Frontend tested and working correctly
5. ⏳ Update user documentation with new capacity
6. ⏳ Regenerate tickets if needed for new bookings

## Notes

- Current bookings (591 total) fit comfortably within new capacity (1,228)
- 196 degree students fit in 210 capacity ✓
- 395 college students fit in 400 capacity ✓
- 368 parent seats now available for new bookings
- Symmetry and V-shape tapering pattern maintained throughout
- Row 6 completely skipped in seat generation (no seats created)

## Date

October 23, 2025

## Status

✅ **COMPLETED** - Seating layout successfully reconfigured and validated
