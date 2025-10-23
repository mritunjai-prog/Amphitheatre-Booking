# Seat Allocation Update - October 23, 2025

## Summary

Successfully updated seat allocations for the new amphitheater layout with all old forms removed.

## Files Updated

### CSV Files Updated

1. ✅ `data/booked_seats.csv` - Updated seat numbers
2. ✅ `data/users.csv` - Updated seat numbers
3. ✅ `public/data/booked_seats.csv` - Synced copy
4. ✅ `public/data/users.csv` - Synced copy

### Files Removed

1. ✅ `data/CONSENT FORM FOR CONVOCATION main.csv` - Old consent form
2. ✅ `data/NEW CONSENT FORM.csv` - Processed consent form
3. ✅ `data/consent_form_processing_summary.json` - Processing metadata
4. ✅ `data/duplicates_report.csv` - Temporary analysis file
5. ✅ `data/Data base Convocation 12 till date.csv` - Old database
6. ✅ `data/college_students_cleaned.csv` - Processed file

### Remaining Data Files

- `data/booked_seats.csv` - Active bookings (591 records)
- `data/users.csv` - User database (591 records)
- `data/NEW DEGREE AWARDING.csv` - Source file for degree students
- `data/degree_processing_summary.json` - Degree processing metadata

## Current Seat Allocations

### Booked Seats (591 total)

**Degree Students: 196 seats (D1-D196)**

- Capacity: 210 seats
- Available: 14 seats
- Utilization: 93%

**College Students: 395 seats (1-395)**

- Capacity: 400 seats
- Available: 5 seats
- Utilization: 99%

### Available Capacity

| Category         | Total Capacity | Booked  | Available | Utilization |
| ---------------- | -------------- | ------- | --------- | ----------- |
| VIP              | 26             | 0       | 26        | 0%          |
| Guests           | 56             | 0       | 56        | 0%          |
| Faculty          | 60             | 0       | 60        | 0%          |
| Degree Students  | 210            | 196     | 14        | 93%         |
| Parents          | 290            | 0       | 290       | 0%          |
| College Students | 400            | 395     | 5         | 99%         |
| **TOTAL**        | **1,042**      | **591** | **451**   | **57%**     |

## Seat Numbering Convention

### Updated Format

- **VIP**: VIP-1 to VIP-26
- **Guests**: G1 to G56
- **Faculty**: F1 to F60
- **Degree Students**: D1 to D210 (196 booked: D1-D196)
- **Parents**: P1 to P290 (0 booked)
- **College Students**: 1 to 400 (395 booked: 1-395)

## Layout Details

### Row Distribution

- **Row 1**: VIP (26 seats)
- **Rows 2-3**: Guests (56 seats, 28 each)
- **Rows 4-5**: Faculty (60 seats, 30 each)
- **Row 6**: REMOVED
- **Rows 7-12**: Degree Students (210 seats with tapering)
- **Rows 13-19**: Parents (290 seats with tapering)
- **Rows 20-28**: College Students (400 seats with tapering)

### Visual Styling

- **Available seats**: Bright category colors
- **Booked seats**: Darker shade of category color (not red)
- **Symmetry**: V-shape tapering maintained throughout

## Next Steps

1. ✅ Seat allocations updated
2. ✅ Old forms removed
3. ✅ CSV files synchronized
4. ⏳ Ready for new bookings (VIP, Guests, Faculty, Parents)
5. ⏳ Can accommodate 14 more degree students
6. ⏳ Can accommodate 5 more college students

## Technical Details

### Files Modified

- `scripts/updateSeatAllocations.js` - Seat allocation update script
- `data/booked_seats.csv` - Main booking database
- `data/users.csv` - User database
- `public/data/*.csv` - Public copies synced

### Color Scheme (Booked Seats)

- VIP booked: Dark purple (purple-700 to purple-900)
- Guests booked: Dark amber (amber-600 to orange-700)
- Faculty booked: Dark blue (blue-600 to blue-800)
- Parents booked: Dark pink (pink-600 to pink-800)
- Degree booked: Dark green (green-600 to green-800)
- College booked: Dark cyan (cyan-600 to cyan-800)

## Date

October 23, 2025

## Status

✅ **COMPLETED** - All seat allocations updated, old forms removed, ready for new bookings
