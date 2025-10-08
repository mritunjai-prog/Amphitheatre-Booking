# Seating Allocation Updates - October 2025

## Summary of Changes

The amphitheater seating layout has been updated to include a new **Parents** category and adjust seat allocations across all categories.

## New Seating Distribution

### Total Capacity: 1,050 Seats (21 Rows × 50 Seats)

| Category             | Seat Range      | Total Seats | Rows                                   | Color                   |
| -------------------- | --------------- | ----------- | -------------------------------------- | ----------------------- |
| **VIP**              | VIP-1 to VIP-50 | 50          | Row 1                                  | Purple gradient 🟣      |
| **Guests**           | G1 to G50       | 50          | Row 2                                  | Orange/Gold gradient 🟠 |
| **Faculty**          | F1 to F65       | 65          | Rows 3, 4, and first 15 seats of Row 5 | Blue gradient 🔵        |
| **Parents**          | P1 to P135      | 135         | Last 35 seats of Row 5 + Rows 6-7      | Pink gradient 🩷         |
| **Degree Students**  | D1 to D200      | 200         | Rows 8-11                              | Green gradient 🟢       |
| **College Students** | 1 to 600        | 600         | Rows 12-23                             | Cyan gradient 🔵        |

**Note**: No General seats - all seats are category-specific

## What Changed

### 1. Faculty Seats - REDUCED

- **Previous**: F1 to F150 (150 seats, Rows 3-5)
- **New**: F1 to F65 (65 seats, Rows 3-4 + first 15 seats of Row 5)
- **Change**: Reduced by 85 seats

### 2. Parents Category - NEW

- **Previous**: Did not exist
- **New**: P1 to P135 (135 seats)
- **Location**: Last 35 seats of Row 5 + all of Rows 6-7
- **Purpose**: Dedicated seating for parents attending university events
- **Color**: Pink gradient (from-pink-400 to-pink-600)
- **Note**: Parents start immediately after Faculty ends in Row 5

### 3. Degree Students - SHIFTED

- **Previous**: D1 to D200 (200 seats, Rows 6-9)
- **New**: D1 to D200 (200 seats, Rows 8-11)
- **Change**: Moved down by 2 rows to accommodate Parents

### 4. College Students - REDUCED

- **Previous**: 1 to 1000 (1000 seats, Rows 10-29)
- **New**: 1 to 600 (600 seats, Rows 12-23)
- **Change**: Reduced by 400 seats, moved down by 2 rows

### 5. General Seats - REMOVED

- **Previous**: 350 seats (Rows 24-29)
- **New**: 0 seats (REMOVED)
- **Reason**: Amphitheater now only has category-specific seating

## Row-by-Row Breakdown

| Row   | Category                    | Seat Numbers                     | Count |
| ----- | --------------------------- | -------------------------------- | ----- |
| 1     | VIP                         | VIP-1 to VIP-50                  | 50    |
| 2     | Guests                      | G1 to G50                        | 50    |
| 3     | Faculty                     | F1 to F50                        | 50    |
| 4     | Faculty                     | F51 to F65 (first 15 seats only) | 15    |
| 5     | Faculty (15) + Parents (35) | F51-F65, P1-P35                  | 50    |
| 6     | Parents                     | P36 to P85                       | 50    |
| 7     | Parents                     | P86 to P135                      | 50    |
| 8     | Degree Students             | D1 to D50                        | 50    |
| 9     | Degree Students             | D51 to D100                      | 50    |
| 10    | Degree Students             | D101 to D150                     | 50    |
| 11    | Degree Students             | D151 to D200                     | 50    |
| 12-23 | College Students            | 1 to 600                         | 600   |

**Total Rows**: 23 (down from 29)
**Total Seats**: 1,050 (down from 1,450)

## Color Legend

The system uses color-coding to help identify seat categories at a glance:

- 🟣 **Purple**: VIP seats (very important guests)
- 🟠 **Orange/Gold**: Guest seats (invited visitors)
- 🔵 **Blue**: Faculty seats (professors, teachers)
- 🩷 **Pink**: Parents seats (NEW - parents of students)
- 🟢 **Green**: Degree Students (final year, postgraduate)
- 🔵 **Cyan/Teal**: College Students (undergraduate students)
- 🟢 **Emerald**: General/Available seats (anyone can book)
- 🔴 **Red**: Booked/Assigned seats (already taken)

## User Category Assignment

When adding users to the system, use these categories:

1. **VIP** - Chief guests, dignitaries, special invitees
2. **Guests** - External guests, alumni, special visitors
3. **Faculty** - Professors, teachers, academic staff
4. **Parents** - Parents of students attending the event
5. **Degree Students** - Final year, postgraduate students
6. **College Students** - Undergraduate, regular students

## How This Affects Seat Assignment

- **Parents** can now only be assigned to seats marked P1-P135
- **Faculty** assignments are limited to F1-F65 (reduced from F1-F150)
- **College Students** can only book seats 1-600 (reduced from 1-1000)
- All other categories remain the same
- **General seats** (350) can accommodate overflow from any category

## Data File Updates

After making these changes, you'll need to update your CSV files:

### users.csv

Add "Parents" as a new category option:

```csv
id,name,email,phone,category
10,John Parent,john.parent@email.com,+91-9876543219,Parents
```

### booked_seats.csv

Use the new seat numbers for Parents:

```csv
category,seatNumber,userId,userName,email,phone,notes
Parents,P1,10,John Parent,john.parent@email.com,+91-9876543219,Student Parent
```

## Benefits of This Layout

1. **Dedicated Parents Section**: Parents now have their own designated area (135 seats)
2. **Seamless Transition**: Faculty (F65) flows directly into Parents (P1) in the same row
3. **Balanced Distribution**: More realistic allocation based on typical event attendance
4. **No Wasted Space**: Removed general seats - all 1,050 seats are category-specific
5. **Compact Layout**: 23 rows instead of 29, easier to manage and view
6. **Practical Sizing**:
   - Faculty: 65 seats (realistic size)
   - Parents: 135 seats (adequate space)
   - Students: 800 total (600 college + 200 degree)

## Next Steps

1. **Update user data**: Add parents to users.csv with category "Parents"
2. **Clear old bookings**: Remove any old faculty bookings beyond F65
3. **Test assignments**: Verify that parent assignments work correctly
4. **Update documentation**: Share this guide with event coordinators
5. **Train staff**: Ensure everyone knows about the new Parents category

## Technical Changes Made

- Updated `src/types/index.ts` to include "Parents" category
- Modified `src/utils/index.ts` seat generation logic
- Added pink gradient colors in `src/components/Seat.tsx`
- Updated color legend in `src/App.tsx`
- Adjusted row allocations and seat counters

---

**Last Updated**: October 8, 2025
**Version**: 2.0
**Status**: Active
